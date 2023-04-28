import { Mesh, Face } from "./Mesh";
import { Vector3 } from "./Vector3";

/*

       Coordinate System                              
               Y                     
               |                                         
               |                     
               |                     
               |                     
             /   \                   
           /       \                
         Z           \ X
         
            ^    
            \_         0       
               \      /
                <----/




 */

export function generateCylinder(options: {
  x: number;
  y: number;
  z: number;
  radius: number;
  height: number;
  segments: number;
  fill: string;
  stroke: string;
}): Mesh {
  const mesh: Mesh = {
    vertices: [],
    faces: [],
  };

  let sideFacesNormals = [];

  // Top face vertices
  for (let i = 0; i < options.segments; i++) {
    const percent = i / options.segments;
    const theta = percent * (Math.PI * 2);

    const normalizedX = Math.cos(theta);
    const normalizedZ = Math.sin(theta);

    mesh.vertices.push(
      Vector3(
        options.x + normalizedX * options.radius,
        options.y + options.height / 2,
        options.z + normalizedZ * options.radius
      )
    );
  }

  // Calculate side faces normals
  for (let i = 0; i < options.segments; i++) {
    const nextI = (i + 1) % options.segments;
    const average = Vector3(
      (mesh.vertices[i].x + mesh.vertices[nextI].x) / 2 - options.x,
      0,
      (mesh.vertices[i].z + mesh.vertices[nextI].z) / 2 - options.z
    );
    average.normalize();
    sideFacesNormals.push(average);
  }

  // Bottom face vertices are derived from top face vertices but reversed and z is flipped
  const bottomFaceVertices = mesh.vertices.map((vertex) =>
    Vector3(vertex.x, options.y - options.height / 2.0, vertex.z)
  );

  // Make bottom face vertices clockwise
  bottomFaceVertices.reverse();
  mesh.vertices = mesh.vertices.concat(bottomFaceVertices);

  // Generate faces
  const topFace: Face = {
    indices: [],
    fill: options.fill,
    stroke: options.stroke,
    normal: Vector3(0, 1, 0),
  };
  const bottomFace: Face = {
    indices: [],
    fill: options.fill,
    stroke: options.stroke,
    normal: Vector3(0, -1, 0),
  };
  mesh.faces.push(topFace);
  mesh.faces.push(bottomFace);
  for (let i = 0; i < options.segments; i++) {
    // Top face
    topFace.indices.push(i);
    // Bottom face
    bottomFace.indices.push(i + options.segments);

    // Side faces
    const nextI = (i + 1) % options.segments;
    const sideFace: Face = {
      indices: [
        nextI,
        i,
        options.segments - 1 - i + options.segments,
        options.segments - 1 - nextI + options.segments,
      ],
      fill: options.fill,
      stroke: options.stroke,
      normal: sideFacesNormals[i],
    };

    mesh.faces.push(sideFace);
  }

  return mesh;
}
