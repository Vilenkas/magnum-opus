"""
Exports "7: Nervous system & Sense organs" of the Z-Anatomy template, in the skeleton's coordinates:

  nervous-raw.glb     brain (gyri, sulci, deep nuclei, white matter), cerebellum, brainstem, spinal
                      cord, meninges, nerves (bevelled curves in the source, turned into light tubes
                      here) and the eye and ear
  nervous-meta.json   one entry per piece: TA English name, side, TA groups, materials

The kind of each piece (cortex, nucleus, nerve…) is decided later by tools/anatomy/gen-nervous.mjs,
from these groups and materials, so it can be tuned without re-exporting.

Run (see README.md):
  blender -b --factory-startup --disable-autoexec <Startup.blend> --python export_nervous.py -- <out-dir>
"""
import bpy, re, json, sys, os

out_dir = sys.argv[sys.argv.index('--') + 1]
COLLECTION = '7: Nervous system & Sense organs'
# Tube resolution: 4 + 2 * BEVEL_RESOLUTION sides, RESOLUTION_U segments between control points.
BEVEL_RESOLUTION = 1
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
for o in bpy.data.objects:
    o.hide_set(False)
    o.hide_viewport = False

SIDE = {'l': 'left', 'r': 'right'}


def side_of(name):
    m = re.search(r'\.([lr])$', name)
    return SIDE[m.group(1)] if m else None


def groups_of(o):
    out, p = [], o.parent
    while p:
        if p.name.endswith('.g'):
            out.append(p.name[:-2])
        p = p.parent
    return out


# Curve helpers ("-curve", "-profile") shape other objects; they aren't structures.
pieces = [o for o in bpy.data.collections[COLLECTION].all_objects
          if o.type in ('MESH', 'CURVE') and not re.search(r'\.[ijg]$', o.name)
          and not re.search(r'-(curve|profile)(\.[lr])?$', o.name) and '?' not in o.name]

# Lighter tubes and no subdivision, set on everything first, then one depsgraph evaluation.
for o in pieces:
    if o.type == 'CURVE':
        o.data.bevel_resolution = min(o.data.bevel_resolution, BEVEL_RESOLUTION)
        o.data.resolution_u = min(o.data.resolution_u, RESOLUTION_U)
    for mod in [md for md in o.modifiers if md.type == 'SUBSURF']:
        mod.show_viewport = False
dg = bpy.context.evaluated_depsgraph_get()

scene_col = bpy.context.scene.collection
meta, objs, seen = [], [], set()
for o in pieces:
    side = side_of(o.name)
    base = re.sub(r'\.[lr]$', '', o.name)
    oid = slug(base) + ({'left': '-l', 'right': '-r'}[side] if side else '')
    if oid in seen:
        print('DUPLICATE', o.name)
        continue
    seen.add(oid)
    mesh = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
    # Reference lines (the eyeball's equator, meridians and axes) have no faces: nothing to draw.
    if len(mesh.polygons) == 0:
        print('NO FACES', o.name)
        continue
    mats = [m.name for m in o.data.materials if m]
    mesh.materials.clear()
    mesh.name = oid
    obj = bpy.data.objects.new(oid, mesh)
    obj.matrix_world = o.matrix_world.copy()
    scene_col.objects.link(obj)
    objs.append(obj)
    meta.append({'id': oid, 'nameEn': base, 'side': side, 'curve': o.type == 'CURVE', 'groups': groups_of(o),
                 'materials': mats, 'verts': len(mesh.vertices)})

bpy.ops.object.select_all(action='DESELECT')
for o in objs:
    o.select_set(True)
print('EXPORTING', len(objs), 'verts', sum(len(o.data.vertices) for o in objs))
bpy.ops.export_scene.gltf(
    filepath=os.path.join(out_dir, 'nervous-raw.glb'),
    export_format='GLB', use_selection=True, export_apply=True,
    export_materials='NONE', export_texcoords=False, export_vertex_color='NONE', export_normals=True,
    export_extras=False, export_yup=True, export_animations=False,
    export_skins=False, export_morph=False, export_cameras=False, export_lights=False,
)
meta.sort(key=lambda m: m['id'])
with open(os.path.join(out_dir, 'nervous-meta.json'), 'w', encoding='utf-8') as f:
    json.dump(meta, f, indent=1, ensure_ascii=False)
print('DONE', len(meta))
