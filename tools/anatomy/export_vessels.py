"""
Exports the heart, the blood vessels and the lymphoid organs of the Z-Anatomy template, in the
skeleton's coordinates:

  vessels-raw.glb     "5: Cardiovascular system": the heart (chambers, valves, papillary muscles)
                      and every artery and vein. Vessels are bevelled curves in the source; they
                      are turned into light tubes (8 sides) here.
  lymph-raw.glb       "6: Lymphoid organs": lymph node groups, tonsils, thymus, spleen
  vessels-meta.json   one entry per exported piece

Run (see README.md):
  blender -b --factory-startup --disable-autoexec <Startup.blend> --python export_vessels.py -- <out-dir>
"""
import bpy, re, json, sys, os

out_dir = sys.argv[sys.argv.index('--') + 1]

# Tube resolution: 4 + 2 * BEVEL_RESOLUTION sides, RESOLUTION_U segments between control points.
BEVEL_RESOLUTION = 2
RESOLUTION_U = 3


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
for o in bpy.data.objects:
    o.hide_set(False)
    o.hide_viewport = False

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


def pieces(col_name):
    col = bpy.data.collections[col_name]
    return [o for o in col.all_objects
            if o.type in ('MESH', 'CURVE') and not re.search(r'\.[ijg]$', o.name) and '?' not in o.name]


scene_col = bpy.context.scene.collection
meta, sets, seen = [], {'vessels': [], 'lymph': []}, set()


# Lighter tubes and no subdivision, set on everything first: the depsgraph is then evaluated
# once, not once per piece (each evaluation walks the whole 300 MB scene).
for col_name in ('5: Cardiovascular system', '6: Lymphoid organs'):
    for o in pieces(col_name):
        if o.type == 'CURVE':
            o.data.bevel_resolution = BEVEL_RESOLUTION
            o.data.resolution_u = min(o.data.resolution_u, RESOLUTION_U)
        for mod in [md for md in o.modifiers if md.type == 'SUBSURF']:
            mod.show_viewport = False
dg = bpy.context.evaluated_depsgraph_get()


def bake(o, new_name):
    """A fresh mesh object with the evaluated geometry (curve → tube) and the world transform."""
    mesh = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
    mesh.materials.clear()
    mesh.name = new_name
    obj = bpy.data.objects.new(new_name, mesh)
    obj.matrix_world = o.matrix_world.copy()
    scene_col.objects.link(obj)
    return obj


def kind_of(o, groups):
    mats = [m.name for m in o.data.materials if m]
    if o.type == 'CURVE':
        return {'Artery': 'artery', 'Vein': 'vein', 'Pulmonary artery': 'pulmonary-artery',
                'Pulmonary vein': 'pulmonary-vein'}.get(mats[0] if mats else '', 'artery')
    if any(g.endswith('valve') for g in groups):
        return 'valve'
    if 'papillary' in o.name.lower():
        return 'papillary'
    if 'Heart' in groups:
        return 'heart'
    if 'Arterial system' in groups:
        return 'pulmonary-artery' if 'Pulmonary arteries' in groups else 'artery'
    if re.search(r'sinus|plexus', o.name, re.I):
        return 'vein'
    if 'Vein' in mats:
        return 'vein'
    if 'Artery' in mats:
        return 'artery'
    return 'organ'


for set_name, col_name in (('vessels', '5: Cardiovascular system'), ('lymph', '6: Lymphoid organs')):
    for o in pieces(col_name):
        raw = o.name
        side = side_of(raw)
        base = strip_side(raw)
        oid = slug(base) + ({'left': '-l', 'right': '-r'}[side] if side else '')
        if oid in seen:
            print('DUPLICATE', raw)
            continue
        seen.add(oid)
        groups = groups_of(o)
        mats = [m.name for m in o.data.materials if m]
        kind = kind_of(o, groups) if set_name == 'vessels' else (
            'node' if any(m.startswith('Lymph') for m in mats) else 'organ')
        obj = bake(o, oid)
        sets[set_name].append(obj)
        meta.append({'set': set_name, 'id': oid, 'kind': kind, 'nameEn': base, 'side': side,
                     'groups': groups, 'verts': len(obj.data.vertices)})

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
with open(os.path.join(out_dir, 'vessels-meta.json'), 'w', encoding='utf-8') as f:
    json.dump(meta, f, indent=1, ensure_ascii=False)
print('DONE', len(meta))
