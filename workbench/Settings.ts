import { on } from "events";
import {
  Box,
  Camera,
  Color,
  DirectionalLight,
  Grid,
  Group,
  Matrix4x4,
  Shape,
  Vector3,
  Viewport,
} from "../src";

export type LightingChoice =
  | "reference"
  | "black and white"
  | "moonlit"
  | "underwater"
  | "none";

export function getLighting(lighting: LightingChoice): {
  directionalLight: DirectionalLight;
  ambientLightColor: Color;
} {
  let ambientLightColor;
  let directionalLightColor;

  // Lighting direction options
  const fromAbove = Vector3(0, -1, 0).normalize();
  const fromBelow = Vector3(0, 1, 0).normalize();

  // By default the light comes from above and at a slight angle from the front right
  const direction = Vector3(-0.25, -1, -0.25).normalize();

  if (lighting === "reference") {
    ambientLightColor = {
      r: 64,
      g: 64,
      b: 64,
    };
    directionalLightColor = {
      r: 255,
      g: 252,
      b: 255,
    };
  } else if (lighting === "black and white") {
    ambientLightColor = {
      r: 0,
      g: 0,
      b: 0,
    };
    directionalLightColor = {
      r: 255,
      g: 252,
      b: 255,
    };
  } else if (lighting === "moonlit") {
    //    Bluish white
    ambientLightColor = {
      r: 64,
      g: 64,
      b: 120,
    };

    directionalLightColor = {
      r: 255,
      g: 252,
      b: 181,
    };
  } else if (lighting === "underwater") {
    //    Bluish white
    ambientLightColor = {
      r: 16,
      g: 55,
      b: 119,
    };

    directionalLightColor = {
      r: 200,
      g: 200,
      b: 255,
    };
    return {
      ambientLightColor,
      directionalLight: DirectionalLight({
        direction: fromAbove,
        color: Color(
          directionalLightColor.r - ambientLightColor.r,
          directionalLightColor.g - ambientLightColor.g,
          directionalLightColor.b - ambientLightColor.b
        ),
      }),
    };
  } else if (lighting === "none") {
    ambientLightColor = {
      r: 255,
      g: 255,
      b: 255,
    };

    directionalLightColor = {
      r: 0,
      g: 0,
      b: 0,
    };
    return {
      ambientLightColor,
      directionalLight: DirectionalLight({
        direction,
        color: Color(
          directionalLightColor.r - ambientLightColor.r,
          directionalLightColor.g - ambientLightColor.g,
          directionalLightColor.b - ambientLightColor.b
        ),
      }),
    };
  } else {
    throw new Error("Unknown lighting choice");
  }

  return {
    ambientLightColor,
    directionalLight: DirectionalLight({
      direction,
      color: Color(
        directionalLightColor.r - ambientLightColor.r,
        directionalLightColor.g - ambientLightColor.g,
        directionalLightColor.b - ambientLightColor.b
      ),
    }),
  };
}

export type CameraChoice = "front" | "top" | "isometric" | "front-tilted"; //| "cabinet" ;

export function getCamera(
  choice: CameraChoice,
  splitScreen: "horizontally" | "vertically" | "fullscreen" = "fullscreen",
  zoom: number = 1
) {
  const camera = Camera();

  const viewport: Viewport = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };

  function resize() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    if (splitScreen === "horizontally") {
      width /= 2;
    } else if (splitScreen === "vertically") {
      height /= 2;
    } else {
      // Do nothing
    }

    viewport.left = 0;
    viewport.top = 0;
    viewport.width = width;
    viewport.height = height;

    camera.projectionMatrix.makeOrthographic(
      0,
      viewport.width / zoom,
      0,
      viewport.height / zoom,
      0,
      10000
    );
  }
  resize();

  window.addEventListener("resize", resize);

  return {
    viewport,
    camera,
    updateCamera(rotationDegrees: number, distance: number = 20) {
      const x = Math.sin((rotationDegrees / 180) * Math.PI) * distance;
      const z = Math.cos((rotationDegrees / 180) * Math.PI) * distance;
      // const x = 20;
      // const z = 20;

      switch (choice) {
        case "front":
          camera.matrix.makeTranslation(0, 0, distance);
          break;
        case "top":
          camera.matrix.makeRotationX(-Math.PI / 2);

          const translate = Matrix4x4().makeTranslation(0, distance, 0);
          camera.matrix.multiply(translate);
          break;
        case "isometric":
          {
            const eye = Vector3(x, distance, z);

            camera.matrix.lookAt(eye, Vector3(0, 0, 0), Vector3(0, 1, 0));

            camera.matrix.setTranslation(
              eye.add(camera.matrix.getBackwards().multiply(1))
            );
          }
          break;
        case "front-tilted":
          {
            camera.matrix.makeTranslation(0, distance, distance);

            camera.matrix.lookAt(
              camera.matrix.getTranslation(),
              Vector3(0, 0, 0),
              Vector3(0, 1, 0)
            );
          }
          break;
          // case "cabinet":
          //   const alpha = Math.PI / 4; // 45 degrees in radians
          //   const cabinetSkew = Matrix4x4().set(
          //     1,
          //     0,
          //     -0.5 * Math.cos(alpha),
          //     0,
          //     0,
          //     1,
          //     -0.5 * Math.sin(alpha),
          //     0,
          //     0,
          //     0,
          //     1,
          //     0,
          //     0,
          //     0,
          //     0,
          //     1
          //   );

          //   camera.projectionMatrix.multiply(cabinetSkew);
          break;
      }
    },
  };
}

export type Environment = "none" | "underwater" | "grid" | "white floor";

export function getEnvironment(environment: Environment = "grid"): Shape {
  switch (environment) {
    case "none":
      return Group({});
    case "underwater":
      document.body.style.backgroundColor = "#104A8A";
      return Group({});
    case "grid":
      document.body.style.backgroundColor = "#e1e1e1";
      return Group({
        children: [
          Grid({
            id: "background",
            rotation: Vector3(0, 0, 0),
            cellCount: 10,
            cellSize: 100,
            fill: Color(255, 0, 0, 1),
            stroke: Color(0, 0, 0),
            strokeWidth: 1,
          }),
        ],
      });
    case "white floor":
      document.body.style.backgroundColor = "rgb(32,32,32)";
      return Box({
        id: "background",
        width: 1000,
        height: 30,
        depth: 1000,
        fill: Color(255, 255, 255),
        stroke: Color(0, 0, 0),
        strokeWidth: 2,
      });
      break;
    default:
      throw new Error("Unknown environment");
  }
}

let lastUpdateTime: number | undefined = undefined;
let simTime = 0;
function getSimTimeInSeconds() {
  return simTime;
}

let paused = false;
export function setPaused(pause: boolean) {
  paused = pause;
  if (paused) {
    lastUpdateTime = undefined;
  }
}
export function getPaused() {
  return paused;
}

export function onUpdate(
  updateCallback: (time: { now: number; deltaTime: number }) => void
): void {
  const onUpdateLoop = () => {
    if (!paused) {
      const now = performance.now() / 1000;
      if (lastUpdateTime === undefined) {
        lastUpdateTime = now;
      }
      const deltaTime = now - lastUpdateTime;
      lastUpdateTime = now;
      simTime += deltaTime;

      updateCallback({ now: simTime, deltaTime });
    }

    requestAnimationFrame(onUpdateLoop as unknown as FrameRequestCallback);
  };
  onUpdateLoop();
}
