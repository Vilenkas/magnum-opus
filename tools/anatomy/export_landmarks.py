"""
Exports bony landmarks (acromion, greater trochanter…) from Z-Anatomy as surface points.

Z-Anatomy stores each landmark as a 2-vertex leader line: `<Name>.j` (right side / midline)
parented to a text label `<Name>.t`, itself parented to the bone (e.g. `Scapula.r`).
One end of the line sits on the bone surface. Left-side copies (`.i`) are positioned by the
Blender add-on at runtime and are collapsed at the origin in the file, so left landmarks are
produced by mirroring the right ones across the midsagittal plane and verifying that the
mirrored point really lies on the left bone.

Usage:
  blender -b --factory-startup --disable-autoexec Startup.blend \
    --python tools/anatomy/export_landmarks.py -- <out-dir>
→ <out-dir>/landmarks.json
"""
import bpy, re, json, sys, os
from mathutils import Vector
from mathutils.bvhtree import BVHTree

out_dir = sys.argv[sys.argv.index('--') + 1]
dg = bpy.context.evaluated_depsgraph_get()
col = bpy.data.collections["1: Skeletal system"]

# Max distance (m) between a line end / mirrored point and the bone surface to accept it.
ON_SURFACE = 0.004
# Openings (foramina…) are marked at the void, up to this far from the bone.
OPENING = 0.02
# Radius (m) over which surface normals are averaged around a landmark.
NORMAL_RADIUS = 0.008


def slug(s):
    s = s.lower().replace('(', '').replace(')', '')
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def piece_id(bone_name):
    m = re.search(r'\.([lr])$', bone_name)
    base = bone_name[:-2] if m else bone_name
    return slug(base) + (f'-{m.group(1)}' if m else '')


trees = {}


def nearest_on(bone, world_point):
    """Closest surface point of `bone` to `world_point` (world space), its distance and normal."""
    if bone.name not in trees:
        trees[bone.name] = BVHTree.FromObject(bone, dg)
    local = bone.matrix_world.inverted() @ world_point
    loc, normal, _idx, _dist = trees[bone.name].find_nearest(local)
    if loc is None:
        return None, float('inf'), None
    # Smooth the normal over the neighbourhood: on edges and borders (sagittal border,
    # angles) the single nearest face is arbitrary and its normal can point sideways.
    near = trees[bone.name].find_nearest_range(loc, NORMAL_RADIUS)
    if near:
        avg = Vector((0, 0, 0))
        for _co, nrm, _i, _d in near:
            # Same side only: thin plates (parietal) would otherwise mix in the opposite face.
            if nrm.dot(normal) > 0:
                avg += nrm
        if avg.length > 1e-6:
            normal = avg.normalized()
    world = bone.matrix_world @ loc
    # Normals transform with the inverse transpose (this also mirrors them correctly
    # for the negative-scale left-side bones).
    n = (bone.matrix_world.to_3x3().inverted().transposed() @ normal).normalized()
    return world, (world - world_point).length, n


def to_gltf(v):
    # Blender Z-up → glTF Y-up (same convention as the GLB export).
    return [round(v.x, 5), round(v.z, 5), round(-v.y, 5)]


landmarks, rejected = [], []
lines = [o for o in col.all_objects if o.type == 'MESH' and o.name.endswith('.j')]

for line in lines:
    label = line.parent
    bone = label.parent if label else None
    if not bone or bone.type != 'MESH':
        rejected.append((line.name, 'no bone parent'))
        continue

    ev = line.evaluated_get(dg)
    me = ev.to_mesh()
    ends = [ev.matrix_world @ v.co for v in me.vertices]
    ev.to_mesh_clear()

    snapped, dist, normal, raw = min(((*nearest_on(bone, p), p) for p in ends), key=lambda r: r[1])
    # Openings (foramina, notches, hiatus) mark the void, so their point is off the surface:
    # keep the line end as-is instead of snapping it.
    opening = ON_SURFACE < dist <= OPENING
    if dist > OPENING:
        rejected.append((line.name, f'{dist * 1000:.1f} mm from {bone.name}'))
        continue
    point = raw if opening else snapped

    name_en = line.name[:-2]
    inconstant = name_en.startswith('(') and name_en.endswith(')')
    clean = name_en.strip('()')
    entry = {
        'id': slug(clean) + '--' + piece_id(bone.name),
        'nameEn': clean,
        'inconstant': inconstant,
        'opening': opening,
        'pieceId': piece_id(bone.name),
        'point': to_gltf(point),
        'normal': to_gltf(normal),
    }
    landmarks.append(entry)

    # Mirror right-side landmarks onto the left bone.
    if bone.name.endswith('.r'):
        left = bpy.data.objects.get(bone.name[:-2] + '.l')
        if left:
            mirrored = Vector((-point.x, point.y, point.z))
            snapped_l, d, normal_l = nearest_on(left, mirrored)
            if d <= (OPENING if opening else ON_SURFACE):
                landmarks.append({
                    **entry,
                    'id': slug(clean) + '--' + piece_id(left.name),
                    'pieceId': piece_id(left.name),
                    'point': to_gltf(mirrored if opening else snapped_l),
                    'normal': to_gltf(normal_l),
                })
            else:
                rejected.append((line.name + ' (mirrored)', f'{d * 1000:.1f} mm from {left.name}'))

landmarks.sort(key=lambda l: l['id'])
with open(os.path.join(out_dir, 'landmarks.json'), 'w', encoding='utf-8') as f:
    json.dump(landmarks, f, indent=1, ensure_ascii=False)

print('LANDMARKS', len(landmarks), 'unique names', len({l['nameEn'] for l in landmarks}),
      'ids unique', len({l['id'] for l in landmarks}) == len(landmarks))
print('REJECTED', len(rejected))
for r in [r for r in rejected if not r[1].startswith("no bone") and "Skeletal system.g" not in r[1]]:
    print('  ', r)
