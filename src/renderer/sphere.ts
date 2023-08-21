// All of this code is based on this early prototype:
// https://codesandbox.io/s/directionally-lit-sphere-using-svg-radial-gradients-c32ncz?file=/src/Sphere.tsx:2108-4852

import {
  point3DToIsometric,
  projectToScreenCoordinate,
} from "../cameras/Camera";
import { applyLighting } from "../lighting/LightingModel";
import { Matrix4x4 } from "../math/Matrix4x4";
import { SphereShape } from "../shapes/Shape";
import { Scene } from "./Scene";
import { Viewport } from "./Viewport";

// Used this svg file of a 3D sphere as reference:
// https://upload.wikimedia.org/wikipedia/commons/7/7e/Sphere_-_monochrome_simple.svg
export function renderSphere(
  _scene: Scene,
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

const Debug = true;

export function sphereLightSide(
  scene: Scene,
  svg: SVGElement,
  defs: SVGDefsElement,
  sphere: SphereShape,
  viewport: Viewport,
  inverseAndProjectionMatrix: Matrix4x4
) {
  let cycleAngle = 0;
  let rotationAngle = 0;
  // We do all logic assuming the light is from the center to the right below.
  // When cycleRange is over 270, we treat it the same by adjusting the angles here
  // so that the rotationAngle causes the lighting to flip/mirror
  if (cycleAngle > 270) {
    cycleAngle = 90 - (cycleAngle - 270);
    rotationAngle += 180;
  }

  const Radius = sphere.radius;
  const count = Radius;

  const Width = Radius * 2;
  const Height = Radius * 2;
  const uuid = crypto.randomUUID();

  const size = Debug ? 0.01 : 0.0;
  //   const gradientStops = [];

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

  //   const { x, y } = projectToScreenCoordinate(
  //     sphere.position,
  //     inverseAndProjectionMatrix,
  //     viewport
  //   );
  const { x, y } = { x: 160, y: 160 };

  // const lightCenterX = Math.sin((cycleAngle / 180) * Math.PI) * Radius;
  const shadowEdgeX = Math.sin(((cycleAngle - 90) / 180) * Math.PI) * Radius;
  // const shadowEdgeX = -(Radius - lightCenterX);
  const translate = {
    x: translateX + Radius,
    y: translateY + Radius,
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

  circle.setAttribute("cx", x.toString());
  circle.setAttribute("cy", y.toString());

  // TODO: Factor in camera projection matrix, this currectly
  // ignores all zoom factors. Can we even handle skew with sphere?!
  // I don't think we can.
  circle.setAttribute("r", sphere.radius.toString());

  circle.setAttribute("fill", fillUrl);
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
    stopElement.setAttribute("stopColor", stop.stopColor);
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
