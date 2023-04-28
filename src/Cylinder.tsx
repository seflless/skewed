import React from "react";
import { point3DToIsometric } from "./Camera";
import { generateCylinder } from "./CylinderMesh";
import { Vector3 } from "./Vector3";

type CylinderProps = {
  x: number;
  y: number;
  z: number;
  height: number;
  radius: number;
  fill: string;
  stroke: string;
  segments: number;
};

const directLight = Vector3(1, 1, 0).normalize();
const ambientLight = 0.4;
const cameraDirection = Vector3(1, 1, 1).normalize();

export function Cylinder(props: CylinderProps) {
  const mesh = generateCylinder({
    x: props.x,
    y: props.y,
    z: props.z,
    height: props.height,
    radius: props.radius,
    segments: props.segments,
    fill: props.fill,
    stroke: props.stroke,
  });

  const transformedVertices = mesh.vertices.map((vertex) => {
    return point3DToIsometric(vertex.x, vertex.y, vertex.z);
  });

  const maxDotPerFace = mesh.faces.map((face) => {
    let maxDot = cameraDirection.dotProduct(mesh.vertices[face.indices[0]]);
    for (let i = 1; i < face.indices.length; i++) {
      maxDot = Math.max(
        cameraDirection.dotProduct(mesh.vertices[face.indices[i]]),
        maxDot
      );
    }
    return maxDot;
  });

  // Sort faces by distance from camera
  const faceIndices = mesh.faces.map((_, i) => i);
  const sortedFaces = faceIndices.sort((faceIndexA, faceIndexB) => {
    return maxDotPerFace[faceIndexA] - maxDotPerFace[faceIndexB];
  });

  return (
    <g>
      {
        // All faces
        sortedFaces.map((faceIndex) => {
          const face = mesh.faces[faceIndex];
          let points = "";

          const brightness = Math.min(
            Math.max(
              face.normal.dotProduct(directLight) + ambientLight,
              ambientLight
            ),
            1.0
          );

          face.indices.forEach((index) => {
            console.log(faceIndex, index);
            points += `${transformedVertices[index].x},${transformedVertices[index].y} `;
          });
          return (
            <polygon
              style={{
                // translate: `${props.radius},${props.radius}`,
                filter: `brightness(${brightness})`,
              }}
              fill={face.fill}
              // stroke={face.stroke}
              key={faceIndex}
              points={points}
            />
          );
        })
      }
      {/* {transformedVertices.map((vertex, i) => (
          <text
            key={i}
            x={vertex.x.toFixed(2)}
            y={vertex.y.toFixed(2)}
            filter={"drop-shadow(0px 0px 1px white)"}
          >
            {i}
          </text>
        ))} */}
    </g>
  );
}
