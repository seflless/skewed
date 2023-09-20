// All of this code is based on this early prototype:
// https://codesandbox.io/s/directionally-lit-sphere-using-svg-radial-gradients-c32ncz?file=/src/Sphere.tsx:2108-4852
// and this Observable Notebook
// https://observablehq.com/d/011f054fc7eaf966

import { projectToScreenCoordinate } from "../cameras/Camera";
import { ColorToCSS } from "../colors/Color";
import { applyLighting } from "../lighting/LightingModel";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Vector3 } from "../math/Vector3";
import { CylinderShape } from "../shapes/Shape";
import { Scene } from "./Scene";
import { Viewport } from "./Viewport";

enum CylinderEnds {
  Top = 0,
  Bottom = 1,
}

export function renderCylinder(
  _scene: Scene,
  svg: SVGElement,
  _defs: SVGDefsElement,
  cylinder: CylinderShape,
  viewport: Viewport,
  worldTransform: Matrix4x4,
  _cameraZoom: number,
  cameraDirection: Vector3,
  _inverseCameraMatrix: Matrix4x4,
  inverseAndProjectionMatrix: Matrix4x4
) {
  const points: Vector3[] = [
    // Top
    Vector3(0, cylinder.height / 2, 0),
    // Bottom
    Vector3(0, -cylinder.height / 2, 0),
  ].map((point) => {
    worldTransform.applyToVector3(point);

    return projectToScreenCoordinate(
      point,
      inverseAndProjectionMatrix,
      viewport
    );
  });

  const yAxis = Vector3(0, 1, 0);
  worldTransform.extractBasis(Vector3(0, 0, 0), yAxis, Vector3(0, 0, 0));

  // Top === -1
  // Bottom === 1
  // Front === 0
  console.log(yAxis.dotProduct(cameraDirection));

  // Scenarios we can view the cylinder from:
  // 1. From the top/bottom (can't see the tube)
  // 2. From the side (can't see the top or bottom)
  // 3. From a diagonal (can see the tube and either the top or bottom)

  // Are we viewing the cylinder from the top or bottom?

  points.forEach(({ x, y }) => {
    // Create a 'circle' element
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    circle.id = "sphere";
    circle.setAttribute("cx", x.toString());
    circle.setAttribute("cy", y.toString());

    // TODO: Factor in camera projection matrix, this currectly
    // ignores all zoom factors. Can we even handle skew with sphere?!
    // I don't think we can.
    circle.setAttribute("r", "10");

    circle.setAttribute("fill", ColorToCSS(cylinder.fill));

    svg.appendChild(circle);
  });

  // Get the center of the cylinder's top face

  // Get the center of the cylinder's bottom face
}