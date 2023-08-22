import {
  Camera,
  point3DToIsometric,
  projectToScreenCoordinate,
} from "../cameras/Camera";
import { Scene } from "./Scene";
import { Vector3 } from "../math/Vector3";
import { Viewport } from "./Viewport";
import { MeshShape, Shape, SphereShape } from "../shapes/Shape";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Color } from "../colors/Color";
import { applyLighting } from "../lighting/LightingModel";
import { renderSphere } from "./sphere";

const CrackFillingStrokeWidth = 0.5;

export function render(
  container: HTMLElement,
  scene: Scene,
  viewport: Viewport,
  camera: Camera
) {
  const inverseCameraMatrix = camera.matrix.clone().invert();
  const inverseAndProjectionMatrix = camera.projectionMatrix
    .clone()
    .multiply(inverseCameraMatrix);

  // Clear the container of all children
  // TODO: Change API to make it so we reuse created elements
  container.innerHTML = "";

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.setAttribute(
    "viewBox",
    `0 0 ${viewport.width.toString()} ${viewport.height.toString()}`
  );

  // Create the 'defs' element, which is where we'll put shared definitions, gradients, and etc.
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  svg.appendChild(defs);

  const cameraRotationMatrix = camera.matrix.extractRotation();
  const cameraDirection = Vector3(0, 0, 0);
  cameraRotationMatrix.extractBasis(
    Vector3(0, 0, 0),
    Vector3(0, 0, 0),
    cameraDirection
  );

  // Sort shapes back to front
  let sortedShapesByIndex = scene.shapes.map((_, index) => index);
  sortedShapesByIndex.sort((aIndex, bIndex) => {
    const a = cameraDirection.dotProduct(scene.shapes[aIndex].position);
    const b = cameraDirection.dotProduct(scene.shapes[bIndex].position);

    return a - b;
  });

  // For each shape in the scene
  for (let shapeIndex of sortedShapesByIndex) {
    const shape = scene.shapes[shapeIndex];
    switch (shape.type) {
      case "mesh":
        renderMesh(
          scene,
          svg,
          shape,
          viewport,
          inverseCameraMatrix,
          inverseAndProjectionMatrix,
          cameraDirection
        );
        break;
      case "sphere":
        renderSphere(
          scene,
          svg,
          defs,
          shape,
          viewport,
          inverseCameraMatrix,
          inverseAndProjectionMatrix
        );
        break;
      default:
        throw new Error(`Unknown shape type: ${(shape as Shape).type}`);
    }
  }

  container.appendChild(svg);
}

function stringifyFill(color: Color) {
  if (color.a !== 1.0) {
    return `rgba(${Math.floor(color.r)},${Math.floor(color.g)},${Math.floor(
      color.b
    )},${color.a.toFixed(1)})`;
  } else {
    return `rgb(${Math.floor(color.r)},${Math.floor(color.g)},${Math.floor(
      color.b
    )})`;
  }
}

function renderMesh(
  scene: Scene,
  svg: SVGElement,
  shape: MeshShape,
  viewport: Viewport,
  _inverseCameraMatrix: Matrix4x4,
  inverseAndProjectionMatrix: Matrix4x4,
  cameraDirection: Vector3
) {
  const translateMatrix = Matrix4x4().makeTranslation(
    shape.position.x,
    shape.position.y,
    shape.position.z
  );
  const scaleMatrix = Matrix4x4().makeScale(
    shape.scale,
    shape.scale,
    shape.scale
  );
  const rotationXMatrix = Matrix4x4().makeRotationX(
    (shape.rotation.x * Math.PI) / 180
  );
  const rotationYMatrix = Matrix4x4().makeRotationY(
    (shape.rotation.y * Math.PI) / 180
  );
  const rotationZMatrix = Matrix4x4().makeRotationZ(
    (shape.rotation.z * Math.PI) / 180
  );

  const shapeMatrix = translateMatrix
    .multiply(scaleMatrix)
    .multiply(rotationZMatrix)
    .multiply(rotationYMatrix)
    .multiply(rotationXMatrix);
  const shapeInverseRotationMatrix = shapeMatrix.extractRotation().invert();

  const cameraDirectionInShapeSpaceAndInverted = cameraDirection.clone();
  shapeInverseRotationMatrix.applyToVector3(
    cameraDirectionInShapeSpaceAndInverted
  );

  const directionalLightInShapeSpaceAndInverted =
    scene.directionalLight.direction.clone();
  shapeInverseRotationMatrix.applyToVector3(
    directionalLightInShapeSpaceAndInverted
  );

  // Transform the shape's mesh's points to screen space
  const vertices = shape.mesh.vertices.map((vertex) => {
    vertex = vertex.clone();
    shapeMatrix.applyToVector3(vertex);
    // return point3DToIsometric(vertex.x, vertex.y, vertex.z, viewport);

    return projectToScreenCoordinate(
      vertex,
      inverseAndProjectionMatrix,
      viewport
    );
  });

  // Figure out bounding box and wrap shape in a group
  let left = Infinity;
  let right = -Infinity;
  let top = -Infinity;
  let bottom = -Infinity;

  vertices.forEach((vertex) => {
    left = Math.min(left, vertex.x);
    right = Math.max(right, vertex.x);
    top = Math.max(top, vertex.y);
    bottom = Math.min(bottom, vertex.y);
  });

  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${left},${top})`);

  const shapeSpaceCameraDirection = cameraDirection.clone();

  shapeMatrix.clone().invert().applyToVector3(shapeSpaceCameraDirection);

  // Render each face of the shape
  // TODO: Add in backface culling
  for (let face of shape.mesh.faces) {
    const cameraFaceDot = cameraDirectionInShapeSpaceAndInverted.dotProduct(
      face.normal
    );
    if (cameraFaceDot < 0) continue;

    let points = "";
    // A face
    face.indices.forEach((index) => {
      points += `${vertices[index].x - left},${vertices[index].y - top} `;
    });

    const polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );

    polygon.setAttribute("points", points);

    const brightness = directionalLightInShapeSpaceAndInverted.dotProduct(
      face.normal
    );

    const fill = applyLighting(
      scene.directionalLight.color,
      shape.fill,
      scene.ambientLightColor,
      brightness
    );

    polygon.setAttribute("fill", fill);

    // polygon.setAttribute("stroke-linecap", "round");
    polygon.setAttribute("stroke-linejoin", "round");

    if (shape.strokeWidth > 0) {
      polygon.setAttribute("stroke", stringifyFill(shape.stroke));
      polygon.setAttribute("stroke-width", shape.strokeWidth.toString());
    } else {
      polygon.setAttribute("stroke", fill);
      polygon.setAttribute("stroke-width", CrackFillingStrokeWidth.toString());
    }

    //   console.log(face.normal);
    //   console.log(brightness);

    //   svg.style.filter = `brightness(${brightness})`;

    g.appendChild(polygon);
    svg.appendChild(g);
  }
}

// function renderSphere(
//   scene: Scene,
//   svg: SVGSVGElement,
//   defs: SVGDefsElement,
//   shape: SphereShape,
//   viewport: Viewport,
//   inverseCameraMatrix: Matrix4x4,
//   inverseAndProjectionMatrix: Matrix4x4
// ) {
//   throw new Error("Function not implemented.");
// }
// <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0" y="0" width="500" height="500"><script xmlns=""/>
// <defs>
//   <linearGradient id="linearGradient">
//     <stop style="stop-color:#ffffff;stop-opacity:1" offset="0" id="stop6455"/>
//     <stop style="stop-color:#000000;stop-opacity:1" offset="1" id="stop6457"/>
//   </linearGradient>
//   <radialGradient cx="171.20810" cy="196.85463" r="200" fx="171.20810" fy="196.85463" id="radialGradient" xlink:href="#linearGradient" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1.040418,0.796229,-0.814518,1.064316,153.4218,-150.4353)"/>
// </defs>

// </svg>
