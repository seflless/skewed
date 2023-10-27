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
  Text,
  deserializeSVG,
  Svg,
  Plane,
  Arrow,
  pointerToWorldStartDirection,
  ArrowShape,
} from "../../src/index";
import { svgPathParser } from "../../src/svg/svgPathParser";
import { svgPathToSvg3DCommands } from "../../src/svg/svg3d";
import { Octopus } from "./Octopus";
import {
  CameraChoice,
  LightingChoice,
  getCamera,
  getEnvironment,
  getLighting,
  getPaused,
  onUpdate,
} from "../Settings";
import { angryFaceSVGSource } from "../assets/angrySVGFace";

export default function () {
  const leftContainer = document.createElement("div");
  const rightContainer = document.createElement("div");
  document.body.appendChild(leftContainer);
  document.body.appendChild(rightContainer);
  leftContainer.style.float = "left";
  function doIt(
    container: HTMLDivElement,
    cameraChoice: CameraChoice,
    lightingChoice: LightingChoice
  ) {
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
      position: Vector3(0, 150, 0),
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

    const tallTorquoiseBoxShadow = {
      center: Vector3(0, 0, -180),
      shape: Box({
        position: Vector3(0, 0, -180),
        rotation: Vector3(0, 0, 0),
        scale: 1.0,
        width: 120,
        height: 1,
        depth: 120,
        fill: Color(0, 64, 128, 0.75),
        stroke: Color(0, 0, 0, 0),
        strokeWidth: 0.0,
      }),
    };

    const shadows = [
      {
        center: Vector3(0, 0, 300),
        shape: Box({
          position: Vector3(0, 0, 300),
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
        shape: Cylinder({
          position: Vector3(0, 0, 0),
          rotation: Vector3(0, 0, 0),
          scale: 1.0,
          radius: 58,
          height: 1,
          fill: Color(0, 0, 0, 0.5),
          stroke: Color(0, 0, 0, 0),
          strokeWidth: 0.0,
        }),
      },
      tallTorquoiseBoxShadow,
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
      {
        center: Vector3(150, 70, 0),
        shape: Cylinder({
          position: Vector3(0, 0, -350),
          rotation: Vector3(0, 0, 0),
          scale: 1.0,
          height: 0,
          radius: 60,
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

    const text = Text({
      id: "text",
      text: "Kitchen Sink",
      rotation: Vector3(0, 0, 0),
      position: Vector3(0, 500, 0),
      fontSize: 70,
      scale: 1,
      // radius: referenceRadius,
      fill: Color(255, 255, 255),
      stroke: Color(0, 0, 0),
      strokeWidth: 4,
    });

    Vector3(0, 50, 150);
    const angryFace = Group({
      scale: 1,
      position: Vector3(-55, 250, 100),
      children: [
        Svg({
          svg: deserializeSVG(angryFaceSVGSource()),
          position: Vector3(-50, 0, 0),
          scale: 0.5,
          rotation: Vector3(0, 0, 0),
          // radius: referenceRadius,
          fill: Color(255, 0, 0),
          stroke: Color(0, 0, 0),
          strokeWidth: 10,
        }),
      ],
    });

    const floorPlane = Plane(Vector3(0, 1, 0), 0);

    const result = floorPlane.intersect(
      Vector3(767.71, -299.26, -287.92),
      Vector3(0.5, 0.71, 0.5)
    );

    console.log(`intersect = (${result?.x},${result?.y},${result?.z})`);

    let startDrag: Vector3 | undefined;
    let startTranslation: Vector3 | undefined;

    const cursorRetical = Cylinder({
      fill: Red,
      radius: 10,
      height: 2,
      scale: 1,
    });

    const dragOffsetX = Arrow({
      stroke: Red,
      strokeWidth: 50,
    });
    const dragOffsetY = Arrow({
      stroke: Green,
      strokeWidth: 10,
    });
    const dragOffsetZ = Arrow({
      stroke: Blue,
      strokeWidth: 10,
    });

    function setArrowHead(position: Vector3, event: PointerEvent) {
      const { start, direction } = pointerToWorldStartDirection(
        viewport,
        camera,
        event.clientX,
        event.clientY
      );

      // console.log(
      //   `start = (${start.x.toFixed(2)},${start.y.toFixed(2)},${start.z.toFixed(
      //     2
      //   )}). direction = (${direction.x.toFixed(2)},${direction.y.toFixed(
      //     2
      //   )},${direction.z.toFixed(2)})`
      // );

      const floorIntersection = floorPlane.intersect(
        start,
        direction.clone().multiply(-1)
      );
      if (floorIntersection) {
        position.x = floorIntersection.x;
        position.y = floorIntersection.y;
        position.z = floorIntersection.z;

        cursorRetical.position = floorIntersection.clone();
      }
    }

    // document.addEventListener("pointerdown", (event) => {
    //   setArrowHead(dragOffsetX, event);
    // });

    // document.addEventListener("pointermove", (event) => {
    //   setArrowHead(dragOffsetZ, event);
    // });

    // document.addEventListener("pointerup", (event) => {
    //   setArrowHead(dragOffsetY, event);
    // });

    // let startDrag: Vector3 | undefined;
    // let startTranslation: Vector3 | undefined;

    const createDraggableEventHandlers = () => {
      return {
        onPointerDown(
          shape: Shape,
          _event: PointerEvent,
          start: Vector3,
          direction: Vector3
        ) {
          // setArrowHead(dragOffsetX, event);

          const startDrag = floorPlane.intersect(start, direction.clone());

          if (startDrag) {
            startTranslation = shape.position.clone();
          }
        },
        onPointerMove(
          shape: Shape,
          _event: PointerEvent,
          start: Vector3,
          direction: Vector3
        ) {
          if (startDrag) {
            const intersection = floorPlane.intersect(start, direction.clone());
            if (intersection && startTranslation) {
              const delta = intersection.clone().subtract(startDrag);
              shape.position = Vector3(
                startTranslation.x + delta.x,
                startTranslation.y,
                startTranslation.z + delta.z
              );
            }
          }
        },

        onPointerUp(shape: Shape, event: PointerEvent) {
          startDrag = undefined;
        },
      };
    };

    const transparentGreenBox = Box({
      position: Vector3(0, 50, 300),
      rotation: Vector3(0, 0, 0),
      scale: 1.0,
      width: 100,
      height: 100,
      depth: 100,
      ...createDraggableEventHandlers(),
      // onPointerDown: (event, start, direction) => {
      //   startDrag = floorPlane.intersect(start, direction.clone().multiply(-1));
      //   console.log(
      //     `startDrag: (${startDrag?.x},${startDrag?.y},${startDrag?.z})`
      //   );

      //   startTranslation = transparentGreenBox.position.clone();

      //   if (startDrag) {
      //     cursorRetical.position = startDrag.clone();
      //   }

      //   // console.log("transparentGreenBox onPointerDown", transparentGreenBox);
      // },
      // onPointerMove: (event, start, direction) => {
      //   if (startDrag && startTranslation) {
      //     // console.log("-------------transparentGreenBox onPointerMove");
      //     // console.log(`start = (${start.x},${start.y},${start.z})`);
      //     // console.log(
      //     //   `direction = (${direction.x},${direction.y},${direction.z})`
      //     // );
      //     const floorIntersection = floorPlane.intersect(
      //       start,
      //       direction.clone().multiply(-1)
      //     );

      //     if (floorIntersection) {
      //       if (floorIntersection) {
      //         cursorRetical.position = floorIntersection.clone();
      //       }

      //       // console.log("YES floor intersection");

      //       // console.log(
      //       //   `floorIntersection = (${floorIntersection?.x},${floorIntersection?.y},${floorIntersection?.z})`
      //       // );
      //       const delta = floorIntersection?.clone().subtract(startDrag);
      //       // console.log(`delta = (${delta.x},${delta.y},${delta.z})`);

      //       if (delta) {
      //         transparentGreenBox.position = Vector3(
      //           startTranslation.x + delta.x,
      //           startTranslation.y,
      //           startTranslation.z + delta.z
      //         );

      //         // dragOffsetX.start.x = startDrag.x;
      //         // dragOffsetX.start.z = startDrag.z;

      //         // dragOffsetX.end.x = floorIntersection.x;
      //         // dragOffsetX.end.z = floorIntersection.z;
      //         // dragOffsetX.scale = delta.z;
      //       }
      //       console.log(
      //         `transparentGreenBox.position = (${transparentGreenBox.position?.x},${transparentGreenBox.position?.y},${transparentGreenBox.position?.z})`
      //       );
      //     } else {
      //       // console.log("NO floor intersection");
      //     }
      //     // console.log("transparentGreenBox onPointerMove-------------");
      //   }
      // },
      // onPointerUp: (event) => {
      //   startDrag = undefined;
      //   console.log("transparentGreenBox onPointerUp");
      // },
      // fill: Color(0, 255, 0, 0.9),
      fill: Color(0, 255, 0, 1),
      stroke: Color(0, 0, 0),
      strokeWidth: boxStrokeWidth,
    });
    const tallTorquoiseBox = Box({
      position: Vector3(1, 200, -180),
      rotation: Vector3(0, 0, 0),
      scale: 1.0,
      width: 100,
      height: 400,
      depth: 100,
      fill: Color(64, 255, 255, 0.75),
      stroke: Color(0, 0, 0),
      strokeWidth: boxStrokeWidth,
    });

    const cameraPosition = Text({
      text: "Camera Position",
      fontSize: 50,
      fill: Color(0, 255, 0),
      stroke: Color(255, 255, 255),
      strokeWidth: 1,
      rotation: Vector3(-20, 45, 0),
      position: Vector3(-400, 200, -400),
    });

    const cameraDirection = Text({
      text: "Camera Direction",
      fontSize: 50,

      fill: Color(255, 0, 0),
      stroke: Color(255, 255, 255),
      strokeWidth: 1,
      rotation: Vector3(-20, 45, 0),
      position: Vector3(400, 0, 400),
    });

    const scene: Scene = {
      ...getLighting(lightingChoice),
      shapes: [
        getEnvironment(),
        cursorRetical,
        // dragOffsetX,
        // dragOffsetY,
        // dragOffsetZ,
        Box({
          position: Vector3(0, 50, 150),
          fill: Red,
          stroke: Color(0, 0, 0),
          strokeWidth: 0,
        }),
        Box({
          position: Vector3(0, 200, -350),
          height: 400,
          fill: Color(255, 255, 255),
          stroke: Color(0, 0, 0),
          strokeWidth: 0,
        }),

        Sphere({
          position: Vector3(150, 70, 0),
          radius: 70,
          fill: Color(255, 128, 0),
          stroke: Color(0, 0, 0, 1),
          strokeWidth: 5,
        }),
        // sphereScaleTestGroup,
        transparentGreenBox,
        tallTorquoiseBox,
        cylinder,
        lightSphere,
        ...shadowShapes,
        ...particles,
        text,
        angryFace,
        // cameraDirection,
        // cameraPosition,
        //   Octopus({ position: Vector3(-450, 0, 450) }),
        ...Axii(Vector3(-400, 0, -400)),
      ],
    };

    const { viewport, camera, updateCamera } = getCamera(
      cameraChoice,
      "fullscreen"
    );

    const displayVector = (v: Vector3) => {
      return `(${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`;
    };

    onUpdate(({ now, deltaTime }) => {
      const cameraSpeed = 0.0;
      // const cameraSpeed = 0.25;
      updateCamera(now * cameraSpeed * 360 + 45, 20);

      cameraPosition.text = `Pos: ${displayVector(
        camera.matrix.getTranslation()
      )}`;

      cameraDirection.text = `Dir: ${displayVector(
        camera.matrix.getForward()
      )}`;

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

      const textSpinSpeed = 1.0;
      text.rotation.y = 90;
      text.rotation.x = now * 360 * textSpinSpeed;

      angryFace.rotation.y = now * 360 * cylinderRotationSpeed;

      const boxRotationSpeed = 0.25;
      // transparentBox.rotation.y = now * 360 * boxRotationSpeed;
      // transparentGreenBox.rotation.x = 90;

      const boxScalingSpeed = 0.25;
      tallTorquoiseBox.scale =
        (1 + Math.sin(now * Math.PI * 2 * boxScalingSpeed) * 0.5) / 2.0;
      tallTorquoiseBox.rotation.y = now * 360 * cylinderRotationSpeed;

      tallTorquoiseBoxShadow.shape.scale = tallTorquoiseBox.scale * 0.9;
      tallTorquoiseBoxShadow.shape.rotation.y = tallTorquoiseBox.rotation.y;
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
      render(container, scene, viewport, camera);
    });
  }

  doIt(leftContainer, "isometric", "moonlit");
  // doIt(rightContainer, "top", "underwater");
}
