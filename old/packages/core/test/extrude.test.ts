import { extrude } from "../src/meshes/Extrude";
import { Vector3 } from "../src/math/Vector3";

describe("extrude", () => {
  it("creates a mesh with vertices and faces from a polyline", () => {
    const square = [
      Vector3(-1, 0, -1),
      Vector3(1, 0, -1),
      Vector3(1, 0, 1),
      Vector3(-1, 0, 1),
    ];
    const mesh = extrude(square, 2);
    expect(mesh.vertices.length).toBeGreaterThan(0);
    expect(mesh.faces.length).toBeGreaterThan(0);
  });
});


