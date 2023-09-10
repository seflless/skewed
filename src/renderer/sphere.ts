// All of this code is based on this early prototype:
// https://codesandbox.io/s/directionally-lit-sphere-using-svg-radial-gradients-c32ncz?file=/src/Sphere.tsx:2108-4852
// and this Observable Notebook
// https://observablehq.com/d/011f054fc7eaf966

import { projectToScreenCoordinate } from "../cameras/Camera";
import { ColorToCSS } from "../colors/Color";
import { applyLighting } from "../lighting/LightingModel";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Vector3 } from "../math/Vector3";
import { SphereShape } from "../shapes/Shape";
import { Scene } from "./Scene";
import { Viewport } from "./Viewport";

const Debug = false;

// Assumes only values in the range [0,1]
function dotProductToDegrees(dotProduct: number) {
  const angleInRadians = Math.acos(dotProduct);
  const angleInDegrees = angleInRadians * (180 / Math.PI);
  return angleInDegrees;
}

// function normalToDegrees(x: number, z: number) {
//   return (Math.atan2(x, z) / Math.PI) * 180;
// }

function normalizeDegrees(degrees: number) {
  let adjustedDegrees = degrees;
  if (adjustedDegrees < 0) {
    adjustedDegrees = 360 + (adjustedDegrees % 360);
  } else {
    adjustedDegrees = adjustedDegrees % 360;
  }
  return adjustedDegrees;
}

function calculateRotationAngle(x: number, y: number) {
  const angleInRadians = Math.atan2(y, x);
  // Convert radians to degrees
  const angleInDegrees = angleInRadians * (180 / Math.PI);

  // Normalize the angle to be between 0 and 360
  const normalizedAngle = (angleInDegrees + 360) % 360;

  return normalizedAngle;
}

function calculateCycleAngle(x: number, z: number) {
  const degrees = (calculateRotationAngle(x, -z) + 90) % 360;
  return degrees;
}

(globalThis as any).calculateCycleAngle = calculateCycleAngle;

export function renderSphere(
  scene: Scene,
  svg: SVGElement,
  defs: SVGDefsElement,
  sphere: SphereShape,
  viewport: Viewport,
  worldTransform: Matrix4x4,
  cameraZoom: number,
  inverseCameraMatrix: Matrix4x4,
  inverseAndProjectionMatrix: Matrix4x4
) {
  // Convert the light direction into camera space (not projected into screen space)
  const directionalLightInCameraSpace = scene.directionalLight.direction
    .clone()
    .multiply(-1);
  inverseCameraMatrix
    .extractRotation()
    .applyToVector3(directionalLightInCameraSpace);

  let rotationAngle = calculateRotationAngle(
    directionalLightInCameraSpace.x,
    directionalLightInCameraSpace.y
  );

  const lightSideDotProduct = Vector3(0, 0, 1).dotProduct(
    directionalLightInCameraSpace
  );
  const darkSideLightProduct = Vector3(0, 0, -1).dotProduct(
    directionalLightInCameraSpace
  );

  let cycleAngle;
  if (lightSideDotProduct > 0.0) {
    cycleAngle = dotProductToDegrees(lightSideDotProduct);
    sphereLightSide(
      scene,
      svg,
      defs,
      sphere,
      viewport,
      worldTransform,
      cameraZoom,
      inverseAndProjectionMatrix,
      cycleAngle,
      rotationAngle
    );
  } else {
    cycleAngle = 90 - dotProductToDegrees(darkSideLightProduct);
    sphereDarkSide(
      scene,
      svg,
      defs,
      sphere,
      viewport,
      worldTransform,
      cameraZoom,
      inverseAndProjectionMatrix,
      cycleAngle,
      rotationAngle
    );
  }

  if (sphere.id) {
    console.log(
      `id: ${sphere.id}, 
lightSideDotProduct: ${lightSideDotProduct},
lightSideDotProductDegrees: ${dotProductToDegrees(lightSideDotProduct)},
darkSideLightProduct: ${lightSideDotProduct},
darkSideLightProductDegrees: ${90 - dotProductToDegrees(darkSideLightProduct)},
cycleAngle: ${cycleAngle}, rotationAngle: ${rotationAngle}, 
directionalLightInCameraSpace.x = ${directionalLightInCameraSpace.x.toFixed(1)},
directionalLightInCameraSpace.y = ${directionalLightInCameraSpace.y.toFixed(1)},
directionalLightInCameraSpace.z = ${directionalLightInCameraSpace.z.toFixed(1)}
scene.directionalLight.direction.x = ${scene.directionalLight.direction.x.toFixed(
        1
      )}, 
scene.directionalLight.direction.y = ${scene.directionalLight.direction.y.toFixed(
        1
      )},
scene.directionalLight.direction.z = ${scene.directionalLight.direction.z.toFixed(
        1
      )}
`
    );
  }
}

function sphereLightSide(
  scene: Scene,
  svg: SVGElement,
  defs: SVGDefsElement,
  sphere: SphereShape,
  viewport: Viewport,
  worldTransform: Matrix4x4,
  cameraZoom: number,
  inverseAndProjectionMatrix: Matrix4x4,
  cycleAngle: number,
  rotationAngle: number
) {
  const sphereScale = worldTransform.getScale().x;
  const sphereScaleFactor = sphereScale * cameraZoom;

  const Radius = sphere.radius * sphereScaleFactor;

  const count = Radius;

  const uuid = crypto.randomUUID();

  const size = Debug ? 0.01 : 0.0;

  const gradientStops: { offset: number; stopColor: string }[] = [];

  gradientStops.push({ offset: 0.0, stopColor: "red" });
  gradientStops.push({ offset: size, stopColor: "red" });

  for (let i = 0; i <= count; i++) {
    const normalized = i / count;
    const angle = (normalized * Math.PI) / 2;
    // const brightness = Math.cos(angle);
    // const offset = Math.sin(angle);

    const brightness = Math.cos(angle);
    const offset = Math.sin(angle);

    gradientStops.push({
      offset: offset * (1.0 - size) + size,
      stopColor: applyLighting(
        scene.directionalLight.color,
        sphere.fill,
        scene.ambientLightColor,
        brightness
      ),
    });
  }

  const offsetX = Math.sin((cycleAngle / 180) * Math.PI) * Radius;
  const translateX =
    Math.cos((-rotationAngle / 180) * Math.PI) * offsetX + Radius;
  const translateY =
    Math.sin((-rotationAngle / 180) * Math.PI) * offsetX + Radius;

  const { x, y } = projectToScreenCoordinate(
    worldTransform.getTranslation(),
    inverseAndProjectionMatrix,
    viewport
  );
  //   const { x, y } = { x: 320, y: 320 };

  // const lightCenterX = Math.sin((cycleAngle / 180) * Math.PI) * Radius;
  const shadowEdgeX = Math.sin(((cycleAngle - 90) / 180) * Math.PI) * Radius;
  // const shadowEdgeX = -(Radius - lightCenterX);
  const translate = {
    x: translateX + Radius + x - Radius * 2,
    y: translateY + Radius + y - Radius * 2,
  };
  const horizontalScale = offsetX - shadowEdgeX;
  const verticalScale = calculateVerticalRadius(
    horizontalScale,
    -offsetX,
    Radius
  );
  const scale = { x: horizontalScale, y: verticalScale };

  const fillUuid = uuid + "-fill";
  const fillUrl = `url(#${fillUuid})`;

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
  circle.setAttribute("r", Radius.toString());

  circle.setAttribute("fill", fillUrl);

  if (sphere.strokeWidth && sphere.stroke.a > 0.0) {
    circle.setAttribute("stroke", ColorToCSS(sphere.stroke));

    if (sphere.strokeWidth !== 1.0) {
      circle.setAttribute(
        "stroke-width",
        (sphere.strokeWidth * sphereScaleFactor).toString()
      );
    }
  }

  //   circle.setAttribute("fill", "red");

  // Radial gradient
  // Create the 'radialGradient' element
  const radialGradient = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "radialGradient"
  );

  radialGradient.setAttribute("id", fillUuid);
  radialGradient.setAttribute("cx", "0");
  radialGradient.setAttribute("cy", "0");
  radialGradient.setAttribute("r", "1");
  radialGradient.setAttribute("gradientUnits", "userSpaceOnUse");
  radialGradient.setAttribute(
    "gradientTransform",
    `translate(${translate.x} ${translate.y}) rotate(${-rotationAngle}) scale(${
      scale.x
    } ${scale.y})`
  );

  for (let stop of gradientStops) {
    const stopElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );

    stopElement.setAttribute("offset", stop.offset.toString());
    stopElement.setAttribute("stop-color", stop.stopColor);
    radialGradient.appendChild(stopElement);
  }

  defs.appendChild(radialGradient);

  svg.appendChild(circle);
}

function calculateVerticalRadius(
  horizontalRadius: number,
  x: number,
  y: number
): number {
  let factor = 1 - (x * x) / (horizontalRadius * horizontalRadius);
  if (factor === 0) {
    factor = 0.0001;
  }
  return Math.sqrt((y * y) / factor);
}

function sphereDarkSide(
  scene: Scene,
  svg: SVGElement,
  defs: SVGDefsElement,
  sphere: SphereShape,
  viewport: Viewport,
  worldTransform: Matrix4x4,
  cameraZoom: number,
  inverseAndProjectionMatrix: Matrix4x4,
  cycleAngle: number,
  rotationAngle: number
) {
  const sphereScale = worldTransform.getScale().x;
  const sphereScaleFactor = sphereScale * cameraZoom;

  const Radius = sphere.radius * sphereScaleFactor;
  const Count = Radius;

  const Circumference = Radius * 2;
  const Width = Radius * 2;
  const Height = Radius * 2;
  const uuid = crypto.randomUUID();

  // Add debug red dot/ring
  const size = Debug ? 0.01 / 2 : 0.0;
  const gradientStops = [];
  gradientStops.push({ offset: 0.0, stopColor: "red" });
  gradientStops.push({ offset: size, stopColor: "red" });

  // Inner half of gradient is pure black, then after that fades from black to
  // white
  gradientStops.push({
    offset: size,
    stopColor: applyLighting(
      scene.directionalLight.color,
      sphere.fill,
      scene.ambientLightColor,
      0
    ),
  });
  gradientStops.push({
    offset: 0.5,
    stopColor: applyLighting(
      scene.directionalLight.color,
      sphere.fill,
      scene.ambientLightColor,
      0
    ),
  });

  for (let i = 0; i <= Count; i++) {
    const normalized = i / Count;
    const angle = (normalized * Math.PI) / 2;

    let brightness = Math.max(0, Math.sin(angle));

    const offset = Math.cos((normalized * Math.PI) / 2 + Math.PI) + 1.0;

    gradientStops.push({
      offset: offset / 2 + 0.5,
      stopColor: applyLighting(
        scene.directionalLight.color,
        sphere.fill,
        scene.ambientLightColor,
        brightness
      ),
    });
  }

  const { x, y } = projectToScreenCoordinate(
    worldTransform.getTranslation(),
    inverseAndProjectionMatrix,
    viewport
  );

  // Calculate center coordinates of the gradient
  const offsetX = (Math.cos(((cycleAngle + 180) / 180) * Math.PI) + 1) * Radius;

  const translate = {
    x:
      -Math.cos((-rotationAngle / 180) * Math.PI) * (Radius - offsetX) +
      Radius * 2 -
      x,
    y:
      -Math.sin((-rotationAngle / 180) * Math.PI) * (Radius - offsetX) +
      Radius * 2 +
      y / 2,
  };

  // const translateX =

  // const translateY =
  //   -Math.sin((-rotationAngle / 180) * Math.PI) * (Radius - offsetX) +
  //   Radius +
  //   Radius;

  // Calculate horizontal/vertical scales
  const shadowEdgeX = Math.sin((cycleAngle / 180) * Math.PI) * Radius + Radius;
  const horizontalScale = offsetX - shadowEdgeX;
  const verticalScale = calculateVerticalRadius(
    horizontalScale,
    -(Radius - offsetX),
    Radius
  );
  const scale = { x: horizontalScale, y: verticalScale };

  if (Debug) {
    console.log(
      `DarkSide: offsetX = ${offsetX}, shadowEdgeX = ${shadowEdgeX}, cycleAngle = ${cycleAngle}`
    );
  }

  const fillUuid = uuid + "-fill";
  const fillUrl = `url(#${fillUuid})`;

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
  circle.setAttribute("r", Radius.toString());

  circle.setAttribute("fill", fillUrl);

  if (sphere.strokeWidth && sphere.stroke.a > 0.0) {
    circle.setAttribute("stroke", ColorToCSS(sphere.stroke));

    if (sphere.strokeWidth !== 1.0) {
      circle.setAttribute(
        "stroke-width",
        (sphere.strokeWidth * sphereScaleFactor).toString()
      );
    }
  }

  // Radial gradient
  // Create the 'radialGradient' element
  const radialGradient = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "radialGradient"
  );

  radialGradient.setAttribute("id", fillUuid);
  radialGradient.setAttribute("cx", "0");
  radialGradient.setAttribute("cy", "0");
  radialGradient.setAttribute("r", "1");
  radialGradient.setAttribute("gradientUnits", "userSpaceOnUse");
  radialGradient.setAttribute(
    "gradientTransform",
    `translate(${translate.x + x} ${
      translate.y - y
    }) rotate(${-rotationAngle}) scale(${scale.x * 2} ${scale.y * 2})`
  );

  for (let stop of gradientStops) {
    const stopElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );

    stopElement.setAttribute("offset", stop.offset.toString());
    stopElement.setAttribute("stop-color", stop.stopColor);
    radialGradient.appendChild(stopElement);
  }

  defs.appendChild(radialGradient);

  svg.appendChild(circle);
}
