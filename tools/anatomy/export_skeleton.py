import bpy, re, json, sys, os

out_dir = sys.argv[sys.argv.index('--') + 1]
col = bpy.data.collections["1: Skeletal system"]
EXCLUDE = re.compile(r'^(Sinus of |.*cells of ethmoid bone)')

def slug(s):
    s = s.lower().replace('(', '').replace(')', '')
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')

def tissue_of(o):
    names = ' '.join(m.name for m in o.data.materials if m)
    if 'Teeth' in names: return 'tooth'
    if o.name.startswith(('Costal cartilage', 'Arytenoid', 'Corniculate', 'Cricoid', 'Thyroid cartilage',
                          'Lateral process of nasal', 'Major alar', 'Nasal septal')):
        return 'cartilage'
    return 'bone'

# Make everything selectable.
def unhide_layer(lc):
    lc.exclude = False; lc.hide_viewport = False
    for c in lc.children: unhide_layer(c)
unhide_layer(bpy.context.view_layer.layer_collection)
for c in bpy.data.collections: c.hide_viewport = False; c.hide_select = False

bones = [o for o in col.all_objects
         if o.type == 'MESH' and not re.search(r'\.[ijg]$', o.name) and not EXCLUDE.match(o.name)]

meta = []
bpy.ops.object.select_all(action='DESELECT')
for o in bones:
    name = o.name
    side = {'l': 'left', 'r': 'right'}.get(name.rsplit('.', 1)[1]) if re.search(r'\.[lr]$', name) else None
    base = name[:-2] if side else name
    group = o.parent.name[:-2] if o.parent and o.parent.name.endswith('.g') else (o.parent.name if o.parent else '')
    oid = slug(base) + ({'left': '-l', 'right': '-r'}[side] if side else '')
    tissue = tissue_of(o)
    # One primitive per piece: multi-material meshes would export as a group of sub-meshes.
    o.data.materials.clear()
    mw = o.matrix_world.copy()
    o.parent = None
    o.matrix_world = mw
    o.hide_set(False); o.hide_viewport = False; o.hide_select = False
    o.name = oid
    o.select_set(True)
    meta.append({'id': oid, 'nameEn': base, 'side': side, 'group': group,
                 'tissue': tissue, 'verts': len(o.data.vertices)})

print('EXPORTING', len(bones))
bpy.ops.export_scene.gltf(
    filepath=os.path.join(out_dir, 'skeleton-raw.glb'),
    export_format='GLB', use_selection=True, export_apply=True,
    export_materials='NONE', export_texcoords=False, export_vertex_color='NONE', export_normals=True,
    export_extras=False, export_yup=True, export_animations=False,
    export_skins=False, export_morph=False, export_cameras=False, export_lights=False,
)
meta.sort(key=lambda m: m['id'])
with open(os.path.join(out_dir, 'skeleton-meta.json'), 'w', encoding='utf-8') as f:
    json.dump(meta, f, indent=1, ensure_ascii=False)
print('DONE', len(meta), 'ids unique:', len({m['id'] for m in meta}) == len(meta))
