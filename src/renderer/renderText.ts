import { text } from "stream/consumers";
import { projectToScreenCoordinate } from "../cameras/Camera";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Vector3 } from "../math/Vector3";
import { TextShape } from "../shapes/Shape";
import { Scene } from "./Scene";
import { Viewport } from "./Viewport";
import { ColorToCSS } from "../colors/Color";

export function renderText(
  scene: Scene,
  svg: SVGElement,
  _defs: SVGDefsElement,
  textShape: TextShape,
  viewport: Viewport,
  worldTransform: Matrix4x4,
  cameraZoom: number,
  _cameraDirection: Vector3,
  _inverseCameraMatrix: Matrix4x4,
  inverseAndProjectionMatrix: Matrix4x4
) {
  const textScale = worldTransform.getScale().x;
  const textScaleFactor = textScale * cameraZoom;

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

  setSVGElementRotation(x, y, textElement, worldTransform);

  svg.appendChild(textElement);
}

function setSVGElementRotation(
  x: number,
  y: number,
  textElement: SVGTextElement,
  worldTransform: Matrix4x4
) {
  // Extract the elements of the rotation matrix
  const elements = worldTransform.elements;
  // Elements of rotation matrix for ZYX rotation order
  const r11 = elements[0],
    r12 = elements[4],
    r13 = elements[8];
  const r21 = elements[1],
    r22 = elements[5],
    r23 = elements[9];
  const r31 = elements[2],
    r32 = elements[6],
    r33 = elements[10];
  // Compute rotation angles (in radians) for ZYX rotation order
  const beta = Math.atan2(-r31, Math.sqrt(r11 * r11 + r21 * r21));
  const alpha = Math.atan2(r21, r11);
  const gamma = Math.atan2(r32, r33);
  // Convert to degrees
  const rotationZ = alpha * (180 / Math.PI);
  const rotationY = beta * (180 / Math.PI);
  const rotationX = gamma * (180 / Math.PI);
  // SVG transform attribute for 3D rotation
  // Note: SVG has limited 3D transformation capabilities compared to Three.js
  const transform = ` translate(${x},${y}) rotate(${rotationX},${rotationY},${rotationZ})`;
  //   const transform = `translate(${x},${y}) rotate(45,0,0)`;

  textElement.setAttribute("transform", transform);
}
