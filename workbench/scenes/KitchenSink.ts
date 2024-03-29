import {
  Scene,
  Vector3,
  Box,
  Cylinder,
  Viewport,
  render,
  Sphere,
  Shape,
  Blue,
  Green,
  Red,
  Color,
  Matrix4x4,
  Camera,
  Group,
  Grid,
} from "../../src/index";
import { svgPathParser } from "../../src/svg/svgPathParser";
import { svgPathToSvg3DCommands } from "../../src/svg/svg3d";
import { Octopus } from "./Octopus";
import {
  getCamera,
  getEnvironment,
  getLighting,
  getPaused,
  onUpdate,
} from "../Settings";

export default function () {
  // From this 1 diameter circle flattened into a path in Figma, exported as an SVG file, then copy/pasting out the path string
  // Press 2 to zoom into the circle as it's 1x1 pixel by default and impossible to see until you zoom
  // https://www.figma.com/file/735rFnz0E5ib3rq4ha5MMF/Figma-Experiments?type=design&node-id=1312-16&mode=design&t=w03Fbw0ybh430M6y-4
  const pathFromFigmaCircle =
    "M1 0.5C1 0.776142 0.776142 1 0.5 1C0.223858 1 0 0.776142 0 0.5C0 0.223858 0.223858 0 0.5 0C0.776142 0 1 0.223858 1 0.5Z";
  // console.log(pathFromFigmaCircle);

  const pathSegments = svgPathParser(pathFromFigmaCircle, true);
  // console.log(pathSegments);
  const svg3DCommands = svgPathToSvg3DCommands(pathSegments);
  // console.log(svg3DCommands);

  const size = 35;
  const lightSphere = Sphere({
    position: Vector3(0, 0, 0),
    rotation: Vector3(0, 0, 0),
    scale: 1.0,
    // radius: 80,
    radius: size / 4,
    fill: Color(255, 255, 0, 0),
    stroke: Color(255, 255, 0),
    strokeWidth: size / 2,
  });

  const Particle_Speed_Max = 500;
  // const Particle_Count = 20;
  const Particle_Count = 0;
  const Particle_Invisible_Wall_Distance = 500;
  const particles: Shape[] = [];
  const particleVelocities: Vector3[] = [];
  for (let i = 0; i < Particle_Count; i++) {
    const particle = Sphere({
      position: Vector3(
        randomRange(
          -Particle_Invisible_Wall_Distance,
          Particle_Invisible_Wall_Distance
        ),
        // randomRange(-Particle_Invisible_Wall_Distance, Particle_Invisible_Wall_Distance),
        0,
        randomRange(
          -Particle_Invisible_Wall_Distance,
          Particle_Invisible_Wall_Distance
        )
      ),
      rotation: Vector3(0, 0, 0),
      scale: 1.0,
      radius: 20,
      fill: Color(
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255
      ),
      stroke: Color(0, 0, 0),
      strokeWidth: 0,
    });
    particles.push(particle);

    particleVelocities.push(
      Vector3(
        randomRange(-Particle_Speed_Max, Particle_Speed_Max),
        // randomRange(-Particle_Speed_Max, Particle_Speed_Max),
        0,
        randomRange(-Particle_Speed_Max, Particle_Speed_Max)
      )
    );
  }

  function randomRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  const cylinder = Cylinder({
    position: Vector3(0, 150, 300),
    rotation: Vector3(0, 0, 0),
    scale: 1.0,
    radius: 50,
    height: 300,
    fill: Color(255, 0, 255),
    stroke: Color(0, 0, 0),
    strokeWidth: 0,
  });

  document.addEventListener("pointermove", (event) => {
    // cylinder.position.x = event.clientX - window.innerWidth / 2;
    // cylinder.position.z = event.clientY - window.innerHeight / 2;
  });

  const Axii_Thickness = 4;
  const Axii_Length = 100;
  function Axii(position: Vector3) {
    const strokeWidth = 0.5;
    return [
      Box({
        position: Vector3(Axii_Thickness / 2 + Axii_Length / 2, 0, 0).add(
          position
        ),
        rotation: Vector3(0, 0, 0),
        scale: 1.0,
        width: Axii_Length,
        height: Axii_Thickness,
        depth: Axii_Thickness,
        fill: Red,
        stroke: Color(0, 0, 0),
        strokeWidth,
      }),
      Box({
        position: Vector3(0, Axii_Thickness / 2 + Axii_Length / 2, 0).add(
          position
        ),
        rotation: Vector3(0, 0, 0),
        scale: 1.0,
        width: Axii_Thickness,
        height: Axii_Length,
        depth: Axii_Thickness,
        fill: Green,
        stroke: Color(0, 0, 0),
        strokeWidth,
      }),
      Box({
        position: Vector3(0, 0, Axii_Thickness / 2 + Axii_Length / 2).add(
          position
        ),
        rotation: Vector3(0, 0, 0),
        scale: 1.0,
        width: Axii_Thickness,
        height: Axii_Thickness,
        depth: Axii_Length,
        fill: Blue,
        stroke: Color(0, 0, 0),
        strokeWidth,
      }),
    ];
  }

  const shadows = [
    {
      center: Vector3(0, 0, 300),
      shape: Cylinder({
        position: Vector3(0, 0, 300),
        rotation: Vector3(0, 0, 0),
        scale: 1.0,
        radius: 55,
        height: 1,
        fill: Color(0, 0, 0, 0.5),
        stroke: Color(0, 0, 0, 0),
        strokeWidth: 0.0,
      }),
    },
    {
      center: Vector3(0, 0, 150),
      shape: Box({
        position: Vector3(0, 0, 150),
        rotation: Vector3(0, 0, 0),
        scale: 1.0,
        width: 120,
        height: 1,
        depth: 120,
        fill: Color(0, 0, 0, 0.5),
        stroke: Color(0, 0, 0, 0),
        strokeWidth: 0.0,
      }),
    },
    {
      center: Vector3(0, 0, 0),
      shape: Box({
        position: Vector3(0, 0, 0),
        rotation: Vector3(0, 0, 0),
        scale: 1.0,
        width: 120,
        height: 1,
        depth: 120,
        fill: Color(0, 0, 0, 0.5),
        stroke: Color(0, 0, 0, 0),
        strokeWidth: 0.0,
      }),
    },
    {
      center: Vector3(0, 0, -180),
      shape: Box({
        position: Vector3(0, 0, -180),
        rotation: Vector3(0, 0, 0),
        scale: 1.0,
        width: 120,
        height: 1,
        depth: 120,
        fill: Color(0, 0, 0, 0.5),
        stroke: Color(0, 0, 0, 0),
        strokeWidth: 0.0,
      }),
    },
    {
      center: Vector3(0, 0, -350),
      shape: Box({
        position: Vector3(0, 0, -350),
        rotation: Vector3(0, 0, 0),
        scale: 1.0,
        width: 120,
        height: 1,
        depth: 120,
        fill: Color(0, 0, 0, 0.5),
        stroke: Color(0, 0, 0, 0),
        strokeWidth: 0.0,
      }),
    },
    // {
    //   center: Vector3(200, 0, 0),
    //   shape: Cylinder({
    //     position: Vector3(400, 0, 100),
    //     rotation: Vector3(0, 0, 0),
    //     scale: 1.0,
    //     radius: 55,
    //     height: 1,
    //     fill: Color(0, 0, 0, 0.5),
    //     stroke: Color(0, 0, 0, 0),
    //     strokeWidth: 0.0,
    //   }),
    // },
  ];
  const shadowShapes = shadows.map((shadow) => shadow.shape);

  const boxStrokeWidth = 3;

  const transparentGreenBox = Box({
    position: Vector3(0, 100, 0),
    rotation: Vector3(0, 0, 0),
    scale: 1.0,
    width: 100,
    height: 200,
    depth: 100,
    // fill: Color(0, 255, 0, 0.9),
    fill: Color(0, 255, 0, 1.0),
    stroke: Color(0, 0, 0),
    strokeWidth: boxStrokeWidth,
  });
  const tallBlueBox = Box({
    position: Vector3(1, 200, -180),
    rotation: Vector3(0, 0, 0),
    scale: 1.0,
    width: 100,
    height: 400,
    depth: 100,
    fill: Blue,
    stroke: Color(0, 0, 0),
    strokeWidth: boxStrokeWidth,
  });

  const scene: Scene = {
    ...getLighting("moonlit"),
    shapes: [
      getEnvironment(),
      Box({
        position: Vector3(0, 50, 150),
        fill: Red,
        stroke: Color(0, 0, 0),
        strokeWidth: boxStrokeWidth,
      }),
      Box({
        position: Vector3(0, 200, -350),
        height: 400,
        fill: Color(255, 255, 255),
        stroke: Color(0, 0, 0),
        strokeWidth: boxStrokeWidth,
      }),
      Sphere({
        position: Vector3(200, 70, 0),
        radius: 70,
        fill: Color(255, 128, 0),
        stroke: Color(0, 0, 0, 1),
        strokeWidth: 5,
      }),
      // sphereScaleTestGroup,
      transparentGreenBox,
      tallBlueBox,
      cylinder,
      lightSphere,
      ...shadowShapes,
      ...particles,
      //   Octopus({ position: Vector3(-450, 0, 450) }),
      // ...Axii(Vector3(0, 0, 0)),
    ],
  };

  const { viewport, camera, updateCamera } = getCamera("isometric");

  onUpdate(({ now, deltaTime }) => {
    const cameraSpeed = 0.0;
    // const cameraSpeed = 0.25;
    updateCamera(now * cameraSpeed * 360 + 45, 20);

    // const sphereSpeed = 0.0;
    // const sphereSpeed = 0.1;
    const sphereSpeed = 0.45;
    // const sphereSpeed = 0.55;
    const sphereRotationOffsetDegrees = 65;

    const spherePathRadius = 520;
    lightSphere.position.x =
      Math.sin(
        now * Math.PI * 2 * sphereSpeed +
          (sphereRotationOffsetDegrees / 180) * Math.PI
      ) * spherePathRadius;
    lightSphere.position.y = 100;
    lightSphere.position.z =
      Math.cos(
        now * Math.PI * 2 * sphereSpeed +
          (sphereRotationOffsetDegrees / 180) * Math.PI
      ) * spherePathRadius;

    scene.directionalLight.direction = lightSphere.position
      .clone()
      .normalize()
      .multiply(-1);

    const cylinderRotationSpeed = 0.25;
    const cylinderScaleSpeed = 0.25;
    const cylinderTranslationSpeed = 1;
    // cylinder.rotation.x = 90;
    // cylinder.rotation.z = now * 360 * cylinderRotationSpeed;

    const boxRotationSpeed = 0.25;
    // transparentBox.rotation.y = now * 360 * boxRotationSpeed;
    // transparentGreenBox.rotation.x = 90;

    const boxScalingSpeed = 0.25;
    tallBlueBox.scale =
      (1 + Math.sin(now * Math.PI * 2 * boxScalingSpeed) * 0.5) / 2.0;
    // console.log((now * cylinderRotationSpeed) % 1);
    // cylinder.position.x = ((now * cylinderRotationSpeed) % 1) * 500;

    // cylinder.scale = 1 + Math.sin(now * Math.PI * 2 * cylinderScaleSpeed) * 0.5;

    const shadowOffset = 10;
    for (let shadow of shadows) {
      shadow.shape.position.x =
        shadow.center.x + scene.directionalLight.direction.x * -shadowOffset;
      shadow.shape.position.z =
        shadow.center.z + scene.directionalLight.direction.z * -shadowOffset;
    }

    for (let i = 0; i < Particle_Count; i++) {
      const particle = particles[i];
      const velocity = particleVelocities[i];
      particle.position.x += velocity.x * deltaTime;
      particle.position.y += velocity.y * deltaTime;
      particle.position.z += velocity.z * deltaTime;

      if (particle.position.x > Particle_Invisible_Wall_Distance) {
        particle.position.x = Particle_Invisible_Wall_Distance;
        velocity.x *= -1;
      }
      if (particle.position.x < -Particle_Invisible_Wall_Distance) {
        particle.position.x = -Particle_Invisible_Wall_Distance;
        velocity.x *= -1;
      }

      if (particle.position.y > Particle_Invisible_Wall_Distance) {
        particle.position.y = Particle_Invisible_Wall_Distance;
        velocity.y *= -1;
      }
      if (particle.position.y < -Particle_Invisible_Wall_Distance) {
        particle.position.y = -Particle_Invisible_Wall_Distance;
        velocity.y *= -1;
      }

      if (particle.position.z > Particle_Invisible_Wall_Distance) {
        particle.position.z = Particle_Invisible_Wall_Distance;
        velocity.z *= -1;
      }
      if (particle.position.z < -Particle_Invisible_Wall_Distance) {
        particle.position.z = -Particle_Invisible_Wall_Distance;
        velocity.z *= -1;
      }
    }
    render(document.getElementById("root")!, scene, viewport, camera);
  });
}
