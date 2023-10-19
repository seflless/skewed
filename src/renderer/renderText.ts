import { projectToScreenCoordinate } from "../cameras/Camera";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Vector3 } from "../math/Vector3";
import { TextShape } from "../shapes/Shape";
import { Scene } from "./Scene";
import { Viewport } from "./Viewport";
import { ColorToCSS } from "../colors/Color";
import { Euler, EulerOrder } from "../math/Euler";

export function renderText(
  _scene: Scene,
  svg: SVGElement,
  _defs: SVGDefsElement,
  textShape: TextShape,
  viewport: Viewport,
  worldTransform: Matrix4x4,
  cameraZoom: number,
  _cameraDirection: Vector3,
  inverseCameraMatrix: Matrix4x4,
  inverseAndProjectionMatrix: Matrix4x4
) {
  const textScale = worldTransform.getScale().x;
  const textScaleFactor = textScale * cameraZoom;

  const transformMatrixCameraSpace = inverseCameraMatrix
    .clone()
    .multiply(worldTransform)
    .extractRotation();

  const textElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  textElement.setAttribute("id", "text");

  const { x, y } = projectToScreenCoordinate(
    worldTransform.getTranslation(),
    inverseAndProjectionMatrix,
    viewport
  );

  //   textElement.setAttribute("x", x.toFixed(2));
  //   textElement.setAttribute("y", y.toFixed(2));
  textElement.setAttribute(
    "font-size",
    (textShape.fontSize * textScaleFactor).toFixed(2)
  );
  textElement.setAttribute("font-family", textShape.fontFamily);
  textElement.setAttribute("fill", ColorToCSS(textShape.fill));
  textElement.setAttribute("stroke", ColorToCSS(textShape.stroke));
  textElement.setAttribute("stroke-width", textShape.strokeWidth.toFixed(2));
  // Align the text to the center
  textElement.setAttribute("text-anchor", "middle");
  textElement.setAttribute("dominant-baseline", "middle");

  textElement.textContent = textShape.text;

  setSVGElementRotation(x, y, textElement, transformMatrixCameraSpace);

  svg.appendChild(textElement);
}

function setSVGElementRotation(
  x: number,
  y: number,
  textElement: SVGTextElement,
  worldTransform: Matrix4x4
) {
  const euler = new Euler();
  euler.setFromRotationMatrix(worldTransform, EulerOrder.XYZ);
  console.log(
    radiansToDegrees(euler.x).toFixed(0),
    radiansToDegrees(euler.y).toFixed(0),
    radiansToDegrees(euler.z).toFixed(0)
  );

  const transform = `translate(${x}, ${y}) ${getIsometricTransformMatrix(
    euler.x,
    euler.y,
    euler.z
  )}`;
  // console.log(transform);
  // textElement.setAttribute("transform", transform);
  textElement.setAttribute("transform", transform);
}

function radiansToDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}

function getIsometricTransformMatrix(a: number, b: number, c: number): string {
  // Calculate the rotation matrices for each axis
  const Rx = [
    [1, 0, 0],
    [0, Math.cos(a), -Math.sin(a)],
    [0, Math.sin(a), Math.cos(a)],
  ];

  const Ry = [
    [Math.cos(b), 0, Math.sin(b)],
    [0, 1, 0],
    [-Math.sin(b), 0, Math.cos(b)],
  ];

  const Rz = [
    [Math.cos(c), -Math.sin(c), 0],
    [Math.sin(c), Math.cos(c), 0],
    [0, 0, 1],
  ];

  // Calculate the combined rotation matrix
  const Rxy = matrixMultiply(Rx, Ry);
  const Rxyz = matrixMultiply(Rxy, Rz);

  // Extract the 2D isometric transformation matrix
  const m11 = Rxyz[0][0];
  const m12 = Rxyz[0][1];
  const m21 = Rxyz[1][0];
  const m22 = Rxyz[1][1];

  return `matrix(${m11}, ${m21}, ${m12}, ${m22}, 0, 0)`;
}

function matrixMultiply(A: number[][], B: number[][]): number[][] {
  const rowsA = A.length,
    colsA = A[0].length;
  // const rowsB = B.length,
  const colsB = B[0].length;
  const C: number[][] = [];

  for (let i = 0; i < rowsA; i++) {
    C[i] = [];
    for (let j = 0; j < colsB; j++) {
      C[i][j] = 0;
      for (let k = 0; k < colsA; k++) {
        C[i][j] += A[i][k] * B[k][j];
      }
    }
  }

  return C;
}
