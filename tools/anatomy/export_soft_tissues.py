"""
Exports the soft tissues of the Z-Anatomy template, in the skeleton's coordinates:

  muscles-raw.glb     "4: Muscular system": muscles (belly and tendon as separate pieces),
                      fasciae, bursae and tendon sheaths
  joints-raw.glb      "3: Joints": ligaments, capsules, discs, menisci, labra
  insertions-raw.glb  "2: Muscular insertions": origin/insertion areas drawn on the bones
  soft-meta.json      one entry per exported piece

Run (see README.md):
  blender -b --factory-startup --disable-autoexec <Startup.blend> --python export_soft_tissues.py -- <out-dir>
"""
import bpy, re, json, sys, os

out_dir = sys.argv[sys.argv.index('--') + 1]


def slug(s):
    s = s.lower().replace('(', '').replace(')', '')
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def unhide_layer(lc):
    lc.exclude = False
    lc.hide_viewport = False
    for c in lc.children:
        unhide_layer(c)


unhide_layer(bpy.context.view_layer.layer_collection)
for c in bpy.data.collections:
    c.hide_viewport = False
    c.hide_select = False

SIDE = {'l': 'left', 'r': 'right'}


def side_of(name):
    m = re.search(r'\.([lr])$', name)
    return SIDE[m.group(1)] if m else None


def strip_side(name):
    return re.sub(r'\.[lr]$', '', name)


def groups_of(o):
    """Group parents ('.g' text labels) from the nearest up, without the suffix."""
    out, p = [], o.parent
    while p:
        if p.name.endswith('.g'):
            out.append(p.name[:-2])
        p = p.parent
    return out


def meshes(col_name):
    col = bpy.data.collections[col_name]
    return [o for o in col.all_objects if o.type == 'MESH' and not re.search(r'\.[ijg]$', o.name)]


def detach(o, new_name):
    """World transform baked in, no parent, one material-less primitive, renamed."""
    mw = o.matrix_world.copy()
    o.parent = None
    o.matrix_world = mw
    o.data.materials.clear()
    o.hide_set(False)
    o.hide_viewport = False
    o.hide_select = False
    o.name = new_name
    o.data.name = new_name


def separate_tendon(o):
    """Splits a muscle into belly + tendon when it has a 'Tendon' material and another one."""
    names = [m.name if m else '' for m in o.data.materials]
    if 'Tendon' not in names or all(n == 'Tendon' for n in names):
        return o, None
    tendon_index = names.index('Tendon')
    # Some muscles list the material without any face using it.
    tendon_faces = sum(1 for p in o.data.polygons if p.material_index == tendon_index)
    if tendon_faces == 0 or tendon_faces == len(o.data.polygons):
        return o, None
    bpy.ops.object.select_all(action='DESELECT')
    o.select_set(True)
    bpy.context.view_layer.objects.active = o
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='DESELECT')
    o.active_material_index = tendon_index
    bpy.ops.object.material_slot_select()
    bpy.ops.mesh.separate(type='SELECTED')
    bpy.ops.object.mode_set(mode='OBJECT')
    parts = [x for x in bpy.context.selected_objects if x is not o]
    return o, (parts[0] if parts else None)


meta = []
sets = {'muscles': [], 'joints': [], 'insertions': []}

# ---------- Muscles, fasciae, bursae ----------
for o in meshes('4: Muscular system'):
    raw = o.name
    side = side_of(raw)
    base = strip_side(raw)
    oid = slug(base) + ({'left': '-l', 'right': '-r'}[side] if side else '')
    groups = groups_of(o)
    functions = [m.name for m in o.data.materials if m and m.name not in ('Tendon', 'Cartilage')]
    kind = ('fascia' if 'Fasciae' in groups else
            'bursa' if re.search(r'bursa', base, re.I) else
            'sheath' if re.search(r'sheath', base, re.I) else 'muscle')
    belly, tendon = separate_tendon(o) if kind == 'muscle' else (o, None)
    for part, obj, pid in (('belly', belly, oid), ('tendon', tendon, oid + '--tendon')):
        if obj is None:
            continue
        verts = len(obj.data.vertices)
        detach(obj, pid)
        sets['muscles'].append(obj)
        meta.append({'set': 'muscles', 'id': pid, 'of': oid, 'part': part, 'kind': kind, 'nameEn': base,
                     'side': side, 'groups': groups, 'function': functions[0] if functions else None, 'verts': verts})

# ---------- Joints ----------
for o in meshes('3: Joints'):
    raw = o.name
    side = side_of(raw)
    base = strip_side(raw)
    oid = slug(base) + ({'left': '-l', 'right': '-r'}[side] if side else '')
    mats = [m.name for m in o.data.materials if m]
    verts = len(o.data.vertices)
    groups = groups_of(o)
    detach(o, oid)
    sets['joints'].append(o)
    meta.append({'set': 'joints', 'id': oid, 'kind': (mats[0] if mats else 'Ligament').lower(), 'nameEn': base,
                 'side': side, 'groups': groups, 'verts': verts})

# ---------- Muscular insertions: "<muscle>.o2r" = second origin area, right side ----------
INSERTION = re.compile(r'^\(?(.+?)\)?\.([oe])(\d*)([lr])?$')
for o in meshes('2: Muscular insertions'):
    m = INSERTION.match(o.name)
    if not m:
        print('SKIP insertion', o.name)
        continue
    muscle, oe, n, s = m.groups()
    side = SIDE.get(s) if s else None
    muscle_id = slug(muscle) + ({'left': '-l', 'right': '-r'}[side] if side else '')
    bone = o.parent.name if o.parent else None
    bone_side = side_of(bone) if bone else None
    bone_id = (slug(strip_side(bone)) + ({'left': '-l', 'right': '-r'}[bone_side] if bone_side else '')) if bone else None
    mats = [x.name for x in o.data.materials if x]
    # The material ("Origin-Flexion", "End-Adduction") is more reliable than the .o/.e suffix,
    # which Z-Anatomy sometimes swaps; the id keeps the suffix so it stays stable.
    prefix = mats[0].split('-', 1)[0].lower() if mats else ''
    kind = {'origin': 'origin', 'end': 'insertion'}.get(prefix, 'origin' if oe == 'o' else 'insertion')
    oid = f'{muscle_id}--{"origin" if oe == "o" else "insertion"}{n or ""}--{bone_id}'
    verts = len(o.data.vertices)
    # A patch on the bone needs its thickness (Solidify), not the ×10 vertices of its subdivision.
    for mod in [md for md in o.modifiers if md.type == 'SUBSURF']:
        o.modifiers.remove(mod)
    detach(o, oid)
    sets['insertions'].append(o)
    meta.append({'set': 'insertions', 'id': oid, 'muscle': muscle_id, 'muscleEn': muscle, 'kind': kind,
                 'suffixKind': 'origin' if oe == 'o' else 'insertion',
                 'bone': bone_id, 'side': side, 'function': (mats[0].split('-', 1)[1] if mats and '-' in mats[0] else None),
                 'verts': verts})

ids = [m['id'] for m in meta]
dupes = sorted({i for i in ids if ids.count(i) > 1})
print('DUPLICATE IDS', len(dupes), dupes[:10])

for name, objs in sets.items():
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    print('EXPORTING', name, len(objs), 'verts', sum(len(o.data.vertices) for o in objs))
    bpy.ops.export_scene.gltf(
        filepath=os.path.join(out_dir, f'{name}-raw.glb'),
        export_format='GLB', use_selection=True, export_apply=True,
        export_materials='NONE', export_texcoords=False, export_vertex_color='NONE', export_normals=True,
        export_extras=False, export_yup=True, export_animations=False,
        export_skins=False, export_morph=False, export_cameras=False, export_lights=False,
    )

meta.sort(key=lambda m: (m['set'], m['id']))
with open(os.path.join(out_dir, 'soft-meta.json'), 'w', encoding='utf-8') as f:
    json.dump(meta, f, indent=1, ensure_ascii=False)
print('DONE', len(meta))
