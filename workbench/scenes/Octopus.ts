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
} from "../../src/index";
import { getCamera, getGrid, getLighting } from "../Settings";

export default function () {
  const scene: Scene = {
    ...getLighting("moonlit"),
    shapes: [getGrid(), Octopus({})],
  };

  // const { viewport, camera, updateCamera } = getCamera("front");
  const { viewport, camera, updateCamera } = getCamera("isometric");

  let lastRenderTime = performance.now() / 1000;

  function renderLoop() {
    const now = performance.now() / 1000;
    const deltaTime = Math.max(0.0001, now - lastRenderTime);
    lastRenderTime = now;

    const cameraSpeed = 0.0;
    updateCamera(now * cameraSpeed * 360 + 45, 20);

    render(document.getElementById("root")!, scene, viewport, camera);
    requestAnimationFrame(renderLoop);
  }
  renderLoop();

  document
    .getElementById("copy-svg")
    ?.addEventListener("pointerdown", (event: PointerEvent) => {
      event.stopPropagation();
      const svg = document.querySelector("svg");
      navigator.clipboard.writeText(svg!.outerHTML);
    });
}

const BodyColor = Color(99, 99, 194);

const LegSegmentLength = 200;
const LegShrinkFactor = 0.4;
const LegSegmentCount = 5;

export function Octopus(props: Partial<TransformProperties>) {
  // const head = Sphere({
  //   position: Vector3(0, 150, 0),
  //   fill: BodyColor,
  //   radius: 150,
  //   strokeWidth: 4,
  // });

  // const shadow = Cylinder({
  //   radius: 150,
  //   position: Vector3(0, 0, 0),
  // });

  // Overall container
  const group = Group({
    id: "Octopus",
    ...props,
    // children: [head],
    children: [],
  });

  for (let i = 0; i < 1; i++) {
    const leg = Leg();
    group.children.push(leg);
    leg.rotation.x = 0;
    // leg.rotation.y = 0;
    // leg.rotation.x = 0;
    // leg.rotation.y = 0;
  }

  return group;
}

function Leg(): GroupShape {
  // const heights = [500, 400, 300, 200, 100];
  const heights = [200, 170, 150, 100, 80];
  // const heights = [50, 40, 30, 20, 10];
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
        rotation: Vector3(0, 0, 0),
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
                      // Group({
                      //   id: `LegSegment-2`,
                      //   position: Vector3(0, heights[2], 0),
                      //   children: [],
                      // }),
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
