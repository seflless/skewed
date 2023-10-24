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
import { angryFaceSVGSource } from "../assets/angrySVGFace";

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

  const angryFace = Svg({
    svg: deserializeSVG(angryFaceSVGSource()),
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
    updateCamera(now * cameraSpeed * 180 + 45, 20);

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
