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
  TransformProperties,
  GroupShape,
  Shape,
} from "../../src/index";
import {
  getCamera,
  getEnvironment,
  getLighting,
  getPaused,
  onUpdate,
} from "../Settings";

export default function () {
  const octopus = Octopus({});
  const scene: Scene = {
    ...getLighting("reference"),
    shapes: [getEnvironment("underwater"), octopus],
  };

  // const { viewport, camera, updateCamera } = getCamera("front");
  const { viewport, camera, updateCamera } = getCamera("isometric");

  onUpdate(({ now, deltaTime }) => {
    // const cameraSpeed = 0.1;
    const cameraSpeed = 0.0;
    updateCamera(now * cameraSpeed * 360 + 45, 20);

    // Animate the legs in a spiral pattern
    const legRotationSpeedPerSecond = 1.0;
    const maxLegCurlDegreesAbsolute = 15;
    const legCurlDegrees =
      maxLegCurlDegreesAbsolute * pingPongTime(legRotationSpeedPerSecond, now);
    // maxLegCurlDegreesAbsolute;
    // console.log(legCurlDegrees);
    octopus.children
      .filter((child) => child.id === "Leg")
      .forEach((leg) => {
        setLegSegmentRotationCurl(legCurlDegrees, leg as GroupShape);
      });

    render(document.getElementById("root")!, scene, viewport, camera);
  });
}

const BodyColor = Color(128, 64, 128);

const LegSegmentLength = 200;
const LegShrinkFactor = 0.4;
const LegSegmentCount = 5;

export function Octopus(props: Partial<TransformProperties>) {
  const head = Sphere({
    position: Vector3(0, 150, 0),
    fill: BodyColor,
    radius: 150,
    strokeWidth: 0,
  });

  const eyes = Group({
    id: "Eyes",
    children: [
      Eye(Vector3(50, 0, 150)),
      Eye(Vector3(-50, 0, 150)),
      // Box({ position: Vector3(100, 0, 0) }),
      // Box({ position: Vector3(-100, 0, 0) }),
      // Eye({ position: Vector3(200, 0, 0) }),
      // Group({ children: [Eye({ position: Vector3(50, 0, 0) })] }),
      // Group({ children: [Eye({ position: Vector3(500, 0, 0) })] }),
    ],
    position: Vector3(0, 150, 0),
  });

  // const shadow = Cylinder({
  //   radius: 150,
  //   position: Vector3(0, 0, 0),
  // });

  // Overall container
  const group = Group({
    id: "Octopus",
    ...props,
    children: [head, eyes],
    // children: [],
  });

  const legCount = 8;
  // const legCount = 0;
  for (let i = 0; i < legCount; i++) {
    const leg = Leg();
    group.children.push(leg);
    const percent = i / legCount;
    // Tilt leg over
    leg.rotation.x = 90;

    const legAngle = percent * 360;
    console.log(legAngle);
    leg.rotation.y = legAngle;
    // leg.rotation.x = 0;
    // leg.rotation.y = 0;
  }

  return group;
}

function Eye(position: Vector3): Shape {
  const eye = Group({
    // position,
    rotation: Vector3(-10, 0, 0),
  });
  const eyeWhites = Cylinder({
    position,
    radius: 30,
    rotation: Vector3(90, 0, 0),
    fill: Color(255, 255, 255),
    stroke: Color(0, 0, 0, 0),
    height: 10,
  });
  const pupil = Cylinder({
    position: position.clone().add(Vector3(0, 0, 10)),
    radius: 15,
    rotation: Vector3(90, 0, 0),
    fill: Color(0, 0, 0),
    stroke: Color(0, 0, 0, 0),
    height: 10,
  });
  // const eyeWhites = Box({
  //   position,
  //   rotation: Vector3(90, 0, 0),
  //   scale: 0.5,
  //   fill: Color(255, 255, 255),
  //   stroke: Color(0, 0, 0, 0),
  //   height: 10,
  // });

  eye.children.push(eyeWhites);
  eye.children.push(pupil);

  return eye;
}

function Leg(): GroupShape {
  const heights = [200, 170, 150, 120, 100].map((a) => a * 0.7);
  const leg = Group({
    id: "Leg",
    children: [
      Cylinder({
        position: Vector3(0, heights[0] / 2, 0),
        fill: BodyColor,
        stroke: Color(0, 0, 0, 0),
        height: heights[0],
        radius: heights[0] / 4,
      }),
      Group({
        id: `LegSegment-0`,
        position: Vector3(0, heights[0], 0),
        // rotation: Vector3(45, 0, 0),
        scale: 1,
        children: [
          Cylinder({
            position: Vector3(0, heights[1] / 2, 0),
            fill: BodyColor,
            stroke: Color(0, 0, 0, 0),
            height: heights[1],
            radius: heights[1] / 4,
          }),
          Group({
            id: `LegSegment-1`,
            position: Vector3(0, heights[1], 0),
            // rotation: Vector3(45, 0, 0),
            scale: 1,
            children: [
              Cylinder({
                position: Vector3(0, heights[2] / 2, 0),
                fill: BodyColor,
                stroke: Color(0, 0, 0, 0),
                height: heights[2],
                radius: heights[2] / 4,
              }),
              Group({
                id: `LegSegment-2`,
                position: Vector3(0, heights[2], 0),
                children: [
                  Cylinder({
                    position: Vector3(0, heights[3] / 2, 0),
                    fill: BodyColor,
                    stroke: Color(0, 0, 0, 0),
                    height: heights[3],
                    radius: heights[3] / 4,
                  }),
                  Group({
                    id: `LegSegment-3`,
                    position: Vector3(0, heights[3], 0),
                    children: [
                      Cylinder({
                        position: Vector3(0, heights[4] / 2, 0),
                        fill: BodyColor,
                        stroke: Color(0, 0, 0, 0),
                        height: heights[4],
                        radius: heights[4] / 4,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  return leg;
}

function setLegSegmentRotationCurl(degrees: number, segmentParent: GroupShape) {
  segmentParent.children.forEach((child) => {
    if (child.type === "group") {
      child.rotation.z = degrees;
      setLegSegmentRotationCurl(degrees, child);
    }
  });
}

function pingPongTime(scaleFactor: number, now: number): number {
  const timeInSeconds = now * scaleFactor;
  return Math.sin((timeInSeconds * Math.PI) / 1); // Half period for 2 seconds
}
