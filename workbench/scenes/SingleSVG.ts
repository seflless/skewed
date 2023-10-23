import {
  Scene,
  Vector3,
  Box,
  Sphere,
  Cylinder,
  render,
  Group,
  Grid,
  Color,
  Text,
  deserializeSVG,
  Svg,
} from "../../src/index";
import {
  getCamera,
  getEnvironment,
  getLighting,
  getPaused,
  onUpdate,
} from "../Settings";
import { Axii } from "../Axii";
import { type } from "os";

export default function () {
  const referenceRadius = 75;

  const lightSpeed = 0.3;
  const lightDistance = 200;
  const lightSphere = Sphere({
    // id: "light",
    radius: 5,
    fill: Color(255, 255, 0, 0),
    stroke: Color(255, 255, 0),
    strokeWidth: 10,
  });

  const angryFaceSVGCode = `<svg width="228" height="356" viewBox="0 0 228 356" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M188 113C161 121.5 126.721 102.91 118 59L209.5 35C227.5 67.5 217.5 103.713 188 113Z" fill="white"/>
  <path d="M42.4835 115C69.4835 123.5 103.762 104.91 112.483 61L21 35C3 67.5 12.9835 105.713 42.4835 115Z" fill="white"/>
  <path d="M188 113C161 121.5 126.721 102.91 118 59L209.5 35C227.5 67.5 217.5 103.713 188 113Z" stroke="black" stroke-width="5" stroke-linecap="round"/>
  <path d="M42.4835 115C69.4835 123.5 103.762 104.91 112.483 61L21 35C3 67.5 12.9835 105.713 42.4835 115Z" stroke="black" stroke-width="5" stroke-linecap="round"/>
  <path d="M211.5 17L114.5 45.5L17 17" stroke="black" stroke-width="33" stroke-linecap="round"/>
  <path d="M86.4992 34.9935C73.5 32.5 63.5278 32.1002 49.5001 51.4883C38.7856 72.602 43.0117 85.3892 54.5001 92.9883C65.9992 98.5008 84.7002 95.0008 92.5001 81.4883C106.503 58.7283 103.436 38.2424 86.4992 34.9935Z" fill="black"/>
  <path d="M57.5 58.5C58.1182 54.755 59 53 63 52.5C65.5 52.5 68.4482 55.1154 68.0019 59C67.5997 62.5 65.7748 64.7052 62.0019 65C58.6788 65.2596 56.9999 63.5 57.5 58.5Z" fill="white"/>
  <path d="M143.85 35.2142C156.85 32.7207 166.822 32.3209 180.85 51.709C191.564 72.8227 187.338 85.61 175.85 93.209C164.35 98.7215 145.649 95.2215 137.85 81.709C123.847 58.949 126.913 38.4631 143.85 35.2142Z" fill="black"/>
  <path d="M142.087 62C142.705 58.255 143.587 56.5 147.587 56C150.087 56 153.035 58.6154 152.589 62.5C152.187 66 150.362 68.2052 146.589 68.5C143.266 68.7596 141.587 67 142.087 62Z" fill="white"/>
  <path d="M151.5 177.492C147.331 129.618 130.5 101.992 115 101.992C96.5 101.992 85.4026 128.988 78.5 177.492C63.2629 177.416 57.4942 182.11 54 201.992C55.0956 222.902 63.9328 225.341 87 221.492C109.691 235.08 122.171 235.061 144 221.492C165.777 225.285 173.513 221.912 176 201.992C173.404 184.855 169.204 178.798 151.5 177.492Z" fill="#F5B1D1" stroke="black" stroke-width="4"/>
  <path d="M145.5 268.502C133.951 267.716 127.255 269.13 115 274.502C105.377 269.925 95.5 266.341 89 267.502C65 270.5 38.5 296.002 32 342.002C32.103 349.855 37.5 354.5 45 353.002C56 348.5 84 323.002 115 323.002C150 323.002 181.5 357.502 193 352.002C196.481 349.586 197.893 347.577 197.5 340.502C190.196 299.711 167 269.964 145.5 268.502Z" fill="#F8A399"/>
  <path d="M177.5 325.502C156.22 304.251 134 294.502 115 294.502C97 294.502 73.468 305.118 53 325.502M115 274.502C127.255 269.13 133.951 267.716 145.5 268.502C167 269.964 190.196 299.711 197.5 340.502C197.893 347.577 196.481 349.586 193 352.002C181.5 357.502 150 323.002 115 323.002C84 323.002 56 348.5 45 353.002C37.5 354.5 32.103 349.855 32 342.002C38.5 296.002 65 270.5 89 267.502C95.5 266.341 105.377 269.925 115 274.502Z" stroke="black" stroke-width="4"/>
  </svg>
  `;

  const angryFace = Svg({
    svg: deserializeSVG(angryFaceSVGCode),
    position: Vector3(-206.47 / 2, 336.28, 0),
    scale: 1,
    // radius: referenceRadius,
    fill: Color(255, 0, 0),
    stroke: Color(0, 0, 0),
    strokeWidth: 10,
  });
  const anchor = Group({
    scale: 1.9,
    children: [angryFace],
  });

  const lighting = getLighting("moonlit");
  lighting.ambientLightColor = Color(128, 128, 128);
  const scene: Scene = {
    ...lighting,
    shapes: [
      getEnvironment("white floor"),
      // Axii(Vector3(-referenceRadius * 3, 0, 0)),
      anchor,

      // fakeShadow,
      // referenceBox,
      // lightSphere,
    ],
  };

  lightSphere.position = Vector3(1, 1, -1);

  lightSphere.fill = scene.directionalLight.color;

  const { viewport, camera, updateCamera } = getCamera("isometric");

  const onPointerEvent = (event: PointerEvent) => {
    // return;
    event.preventDefault();
    event.stopPropagation();

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const diffX = event.clientX - centerX;
    const diffY = event.clientY - centerY;
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    const lightSpeed = 2;

    const distanceNormalized = distance / referenceRadius;
    let degrees = distanceNormalized * 90;

    const spinMode: string = "z";

    if (spinMode === "y") {
      if (diffX < 0) {
        degrees *= -1;
      }
      lightSphere.position.x = Math.sin((degrees / 180) * Math.PI * lightSpeed);
      lightSphere.position.y = 0.0;
      lightSphere.position.z = Math.cos((degrees / 180) * Math.PI * lightSpeed);

      if (event.buttons === 1) {
        console.log();
        lightSphere.position.z *= -1;
      }
    } else if (spinMode === "z") {
      lightSphere.position.x = Math.sin((degrees / 180) * Math.PI * lightSpeed);
      lightSphere.position.y = Math.cos((degrees / 180) * Math.PI * lightSpeed);
      lightSphere.position.z = 0;
    }

    lightSphere.position.normalize().multiply(lightDistance).add(position);
  };
  document.addEventListener("pointerdown", onPointerEvent);
  document.addEventListener("pointermove", onPointerEvent);
  document.addEventListener("pointerup", onPointerEvent);

  const overallSpeed = 1;
  const rotationSpeed = 1 * overallSpeed;

  onUpdate(({ now, deltaTime }) => {
    // const cameraSpeed = 0.1 * overallSpeed;
    const cameraSpeed = 0.0;
    updateCamera(now * cameraSpeed * 360 + 45, 20);

    // angryFace.rotation.x = (now * 180 * rotationSpeed) % 360;
    // angryFace.rotation.z = (now * 90 * rotationSpeed) % 360;
    anchor.rotation.y = (now * 180 * rotationSpeed) % 360;

    scene.directionalLight.direction = lightSphere.position
      .clone()
      .normalize()
      .multiply(-1);

    render(document.getElementById("root")!, scene, viewport, camera);
  });
}
