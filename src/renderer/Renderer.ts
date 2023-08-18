import { Camera, point3DToIsometric } from "../cameras/Camera";
import { Scene } from "./Scene";
import { Vector3 } from "../math/Vector3";
import { Viewport } from "./Viewport";
import { MeshShape, Shape, SphereShape } from "../shapes/Shape";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Color } from "../colors/Color";

export const directionalLight = Vector3(1, 0.75, 0).normalize();
const cameraDirection = Vector3(1, 1, 1).normalize();
const strokeSize = 0.5;

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
          svg,
          shape,
          viewport,
          inverseAndProjectionMatrix,
          cameraDirection
        );
        break;
      case "sphere":
        renderSphere(svg, defs, shape, viewport);
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
  svg: SVGElement,
  shape: MeshShape,
  viewport: Viewport,
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

  const directionalLightInShapeSpaceAndInverted = directionalLight.clone();
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

    const brightness = Math.max(
      0.4,
      directionalLightInShapeSpaceAndInverted.dotProduct(face.normal)
    );
    const fill = stringifyFill(
      Color(
        shape.fill.r * brightness,
        shape.fill.g * brightness,
        shape.fill.b * brightness,
        shape.fill.a
      )
    );
    polygon.setAttribute("fill", fill);

    // polygon.setAttribute("stroke-linecap", "round");
    polygon.setAttribute("stroke-linejoin", "round");

    if (shape.strokeWidth > 0) {
      polygon.setAttribute("stroke", stringifyFill(shape.stroke));
      polygon.setAttribute("stroke-width", shape.strokeWidth.toString());
    } else {
      polygon.setAttribute("stroke", fill);
      polygon.setAttribute("stroke-width", strokeSize.toString());
    }

    //   console.log(face.normal);
    //   console.log(brightness);

    //   svg.style.filter = `brightness(${brightness})`;

    g.appendChild(polygon);
    svg.appendChild(g);
  }
}

// Used this svg file of a 3D sphere as reference:
// https://upload.wikimedia.org/wikipedia/commons/7/7e/Sphere_-_monochrome_simple.svg
function renderSphere(
  svg: SVGElement,
  defs: SVGDefsElement,
  sphere: SphereShape,
  viewport: Viewport
) {
  const radialGradientId = crypto.randomUUID();

  // Radial gradient
  // Create the 'radialGradient' element
  const radialGradient = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "radialGradient"
  );
  radialGradient.setAttribute("id", radialGradientId);
  radialGradient.setAttribute("cx", "50%");
  radialGradient.setAttribute("cy", "50%");
  radialGradient.setAttribute("r", "50%");
  radialGradient.setAttribute("fx", "75%");
  radialGradient.setAttribute("fy", "25%");
  // radialGradient.setAttribute("fx", "50%");
  // radialGradient.setAttribute("fy", "50%");

  // Create 'stop' elements for the gradient
  const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute("offset", "0%");
  stop1.style.stopColor = `rgb(${sphere.fill.r},${sphere.fill.g},${sphere.fill.b})`;
  stop1.style.stopOpacity = "1";

  const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute("offset", "100%");
  const darker = 0.5;
  stop2.style.stopColor = `rgba(${sphere.fill.r * darker},${
    sphere.fill.g * darker
  },${sphere.fill.b * darker}, ${sphere.fill.a})`;
  stop2.style.stopOpacity = "1";

  // Append 'stop' elements to the 'radialGradient'
  radialGradient.appendChild(stop1);
  radialGradient.appendChild(stop2);

  // Append 'radialGradient' to 'defs'
  defs.appendChild(radialGradient);

  // Create a 'circle' element
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  const { x, y } = point3DToIsometric(
    sphere.position.x,
    sphere.position.y,
    sphere.position.z,
    viewport
  );

  circle.setAttribute("cx", x.toString());
  circle.setAttribute("cy", y.toString());
  circle.setAttribute("r", sphere.radius.toString());
  // circle.setAttribute("fill", `url(#${radialGradientId})`);
  circle.setAttribute("fill", stringifyFill(sphere.fill));

  circle.setAttribute(
    "stroke",
    `rgba(${sphere.stroke.r},${sphere.stroke.g},${sphere.stroke.b},${sphere.stroke.a})`
  );
  circle.setAttribute("stroke-width", sphere.strokeWidth.toString());

  // Add circle
  // <circle cx="250" cy="250" r="200" style="fill:url(#radialGradient)"/>
  // const circle = document.createElementNS(

  svg.appendChild(circle);
}

function projectToScreenCoordinate(
  vertex: Vector3,
  inverseAndProjectionMatrix: Matrix4x4,
  viewport: Viewport
): Vector3 {
  const v = Vector3(vertex);
  inverseAndProjectionMatrix.applyToVector3(v);
  v.x = (v.x * viewport.width) / 2 + viewport.width;
  v.y = (v.y * viewport.height) / 2;
  return v;
}

// <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0" y="0" width="500" height="500"><script xmlns=""/>
// <defs>
//   <linearGradient id="linearGradient">
//     <stop style="stop-color:#ffffff;stop-opacity:1" offset="0" id="stop6455"/>
//     <stop style="stop-color:#000000;stop-opacity:1" offset="1" id="stop6457"/>
//   </linearGradient>
//   <radialGradient cx="171.20810" cy="196.85463" r="200" fx="171.20810" fy="196.85463" id="radialGradient" xlink:href="#linearGradient" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1.040418,0.796229,-0.814518,1.064316,153.4218,-150.4353)"/>
// </defs>

// </svg>
