// All of this code is based on this early prototype:
// https://codesandbox.io/s/directionally-lit-sphere-using-svg-radial-gradients-c32ncz?file=/src/Sphere.tsx:2108-4852
// and this Observable Notebook
// https://observablehq.com/d/011f054fc7eaf966

import { projectToScreenCoordinate } from "../cameras/Camera";
import { ColorToCSS } from "../colors/Color";
import { applyLighting } from "../lighting/LightingModel";
import { Matrix4x4 } from "../math/Matrix4x4";
import { SphereShape } from "../shapes/Shape";
import { Scene } from "./Scene";
import { Viewport } from "./Viewport";

const Debug = false;

// function normalToDegrees(x: number, z: number) {
//   return (Math.atan2(x, z) / Math.PI) * 180;
// }

export function normalizeDegrees(degrees: number) {
  let adjustedDegrees = degrees;
  if (adjustedDegrees < 0) {
    adjustedDegrees = 360 + (adjustedDegrees % 360);
  } else {
    adjustedDegrees = adjustedDegrees % 360;
  }
  return adjustedDegrees;
}

function calculateRotationAngle(x: number, y: number) {
  const angleInRadians = Math.atan2(-y, -x);
  // Convert radians to degrees
  const angleInDegrees = angleInRadians * (180 / Math.PI);

  // Normalize the angle to be between 0 and 360
  const normalizedAngle = (angleInDegrees + 360) % 360;

  return normalizedAngle;
}

function calculateCycleAngle(x: number, z: number) {
  const angleInRadians = Math.atan2(x, z);
  // Convert radians to degrees
  const angleInDegrees = angleInRadians * (180 / Math.PI);

  // Normalize the angle to be between 0 and 360
  const normalizedAngle = (angleInDegrees + 360) % 360;

  return normalizedAngle;
}

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
  if (sphere.id) {
    console.log(sphere.id);
  }
  // Convert the light direction into camera space (not projected into screen space)
  const directionalLightInCameraSpace =
    scene.directionalLight.direction.clone();
  inverseCameraMatrix
    .extractRotation()
    .applyToVector3(directionalLightInCameraSpace);

  let rotationAngle = calculateRotationAngle(
    -directionalLightInCameraSpace.x,
    -directionalLightInCameraSpace.y
  );

  // Rotate the normal to be in the horizontal plane of the sphere
  const counterRotation = Matrix4x4().makeRotationZ(
    (-rotationAngle / 180) * Math.PI
  );
  counterRotation.applyToVector3(directionalLightInCameraSpace);

  let cycleAngle = calculateCycleAngle(
    directionalLightInCameraSpace.x,
    directionalLightInCameraSpace.z
  );

  // console.log(
  //   `rotationAngle: ${rotationAngle}, x: ${directionalLightInCameraSpace.x}, y: ${directionalLightInCameraSpace.y}`
  // );

  // console.log(
  //   `cycleAngle: ${cycleAngle}, x: ${directionalLightInCameraSpace.x}, y: ${directionalLightInCameraSpace.y}, z: ${directionalLightInCameraSpace.z}`
  // );

  if (directionalLightInCameraSpace.x < 0) {
    // rotationAngle += 180;
  }
  // directionalLightInCameraSpace.x < 0
  //   ? 90 - Math.abs(directionalLightInCameraSpace.x * 90)
  //   : directionalLightInCameraSpace.x * 90;

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
  // We do all logic assuming the light is from the center to the right below.
  // When cycleRange is over 270, we treat it the same by adjusting the angles here
  // so that the rotationAngle causes the lighting to flip/mirror
  if (cycleAngle > 270) {
    cycleAngle = 90 - (cycleAngle - 270);
    rotationAngle += 180;
  }

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

  //   <radialGradient
  //             id={fillUuid}
  //             cx={0}
  //             cy={0}
  //             r={1}
  //             gradientUnits="userSpaceOnUse"
  //             gradientTransform={`translate(${translate.x} ${
  //               translate.y
  //             }) rotate(${-rotationAngle}) scale(${scale.x} ${scale.y})`}
  //           >
  //             {gradientStops}
  //           </radialGradient>,

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

// function LightSide({
//     x,
//     y,
//     cycleAngle,
//     surfaceColor,
//     ambientLightColor,
//     rotationAngle
//   }: SphereProps) {
//     // We do all logic assuming the light is from the center to the right below.
//     // When cycleRange is over 270, we treat it the same by adjusting the angles here
//     // so that the rotationAngle causes the lighting to flip/mirror
//     if (cycleAngle > 270) {
//       cycleAngle = 90 - (cycleAngle - 270);
//       rotationAngle += 180;
//     }

//     const Radius = 80;
//     const count = Radius;

//     const Width = Radius * 2;
//     const Height = Radius * 2;
//     const uuid = useMemo(() => crypto.randomUUID(), []);

//     const size = Debug ? 0.01 : 0.0;
//     const gradientStops = [];
//     gradientStops.push(<stop key={1000} offset={0.0} stopColor={"red"} />);
//     gradientStops.push(<stop key={1001} offset={size} stopColor={"red"} />);
//     for (let i = 0; i <= count; i++) {
//       const normalized = i / count;
//       const angle = (normalized * Math.PI) / 2;
//       // const brightness = Math.cos(angle);
//       // const offset = Math.sin(angle);

//       const brightness = Math.cos(angle);
//       const offset = Math.sin(angle);

//       gradientStops.push(
//         <stop
//           key={i}
//           offset={offset * (1.0 - size) + size}
//           stopColor={applyLighting(surfaceColor, ambientLightColor, brightness)}
//         />
//       );
//     }

//     const offsetX = Math.sin((cycleAngle / 180) * Math.PI) * Radius;
//     const translateX =
//       Math.cos((-rotationAngle / 180) * Math.PI) * offsetX + Radius;
//     const translateY =
//       Math.sin((-rotationAngle / 180) * Math.PI) * offsetX + Radius;

//     // const lightCenterX = Math.sin((cycleAngle / 180) * Math.PI) * Radius;
//     const shadowEdgeX = Math.sin(((cycleAngle - 90) / 180) * Math.PI) * Radius;
//     // const shadowEdgeX = -(Radius - lightCenterX);
//     const translate: Vector2 = {
//       x: translateX + Radius,
//       y: translateY + Radius
//     };
//     const horizontalScale = offsetX - shadowEdgeX;
//     const verticalScale = calculateVerticalRadius(
//       horizontalScale,
//       -offsetX,
//       Radius
//     );
//     const scale: Vector2 = { x: horizontalScale, y: verticalScale };

//     const fillUuid = uuid + "-fill";
//     const fillUrl = `url(#${fillUuid})`;

//     return (
//       <>
//         {createPortal(
//           <circle
//             cx={x}
//             cy={y}
//             r={Radius}
//             fill={fillUrl}
//             filter="url(#fresnel)"
//             // stroke="rgb(64,64,128)"
//             // stroke-width="3"
//           />,
//           document.getElementById("svg-root")
//         )}

//         {createPortal(
//           <radialGradient
//             id={fillUuid}
//             cx={0}
//             cy={0}
//             r={1}
//             gradientUnits="userSpaceOnUse"
//             gradientTransform={`translate(${translate.x} ${
//               translate.y
//             }) rotate(${-rotationAngle}) scale(${scale.x} ${scale.y})`}
//           >
//             {gradientStops}
//           </radialGradient>,
//           document.getElementById("svg-refs")
//         )}
//       </>
//     );
//   }
