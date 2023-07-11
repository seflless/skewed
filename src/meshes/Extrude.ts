import { Mesh } from "./Mesh";
import { Vector3 } from "../math/Vector3";

// export type Face = {
//     indices: number[];
//     normal: Vector3;
//   };

//   export type Mesh = {
//     vertices: Vector3[];
//     faces: Face[];
//   };

// {polyline} is the path to extrude. I
//          It is treated as a closed path, by connecting the last point to the first point.
//          It should be wound in a clockwise direction and be laying flush with the floor (XZ) plane.
// {thickness} is the thickness the final mesh should be
export function extrude(polyline: Vector3[], thickness: number): Mesh {
  const mesh: Mesh = { vertices: [], faces: [] };

  // Initialize top face
  mesh.faces.push({
    indices: [],
    normal: Vector3(0, 1, 0),
  });
  // Initialize bottom face
  mesh.faces.push({
    indices: [],
    normal: Vector3(0, -1, 0),
  });

  mesh.vertices = mesh.vertices.concat(
    polyline.map((point) => Vector3(point.x, point.y + thickness / 2, point.z))
  );
  mesh.vertices = mesh.vertices.concat(
    polyline.map((point) => Vector3(point.x, point.y - thickness / 2, point.z))
  );

  // Fill top/bottom face vertices
  polyline.forEach((_, index) => {
    mesh.faces[0].indices.push(index);
    mesh.faces[1].indices.push(polyline.length + index);

    // Edge faces
    const nextIndex = (index + 1) % polyline.length;

    mesh.faces.push({
      indices: [
        index,
        index + polyline.length,
        nextIndex + polyline.length,
        nextIndex,
      ],
      normal: computeEdgeNormal(mesh.vertices[index], mesh.vertices[nextIndex]),
    });
  });

  return mesh;
}

function computeEdgeNormal(start: Vector3, end: Vector3): Vector3 {
  const delta = Vector3(end.x - start.x, 0, end.z - start.z);

  delta.normalize();

  return Vector3(delta.z, 0, -delta.x);
}
