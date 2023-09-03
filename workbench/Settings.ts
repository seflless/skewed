import {
  Box,
  Camera,
  Color,
  DirectionalLight,
  Grid,
  Group,
  Shape,
  Vector3,
  Viewport,
} from "../src";

export type LightingChoice = "reference" | "moonlit" | "headon" | "none";

export function getLighting(lighting: LightingChoice): {
  directionalLight: DirectionalLight;
  ambientLightColor: Color;
} {
  let ambientLightColor;
  let directionalLightColor;

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
  } else if (lighting === "headon") {
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
    return {
      ambientLightColor,
      directionalLight: DirectionalLight({
        direction: Vector3(1, 1, 1).normalize(),
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
        direction: Vector3(1, 1, 1).normalize(),
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
      direction: Vector3(1, 0.75, 0).normalize(),
      color: Color(
        directionalLightColor.r - ambientLightColor.r,
        directionalLightColor.g - ambientLightColor.g,
        directionalLightColor.b - ambientLightColor.b
      ),
    }),
  };
}

export type CameraChoice = "front" | "isometric" | "front-tilted"; //| "cabinet" ;

export function getCamera(choice: CameraChoice, zoom: number = 1) {
  const camera = Camera();

  const viewport: Viewport = {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  function resize() {
    viewport.left = 0;
    viewport.top = 0;
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;

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
          camera.matrix.makeTranslation(0, 0, 0);
          break;
        case "isometric":
          {
            camera.matrix.makeTranslation(x, 20, z);
            const eye = Vector3(x, 20, z);
            camera.matrix[3] = eye.x;
            camera.matrix[7] = eye.y;
            camera.matrix[11] = eye.z;
            camera.matrix.lookAt(eye, Vector3(0, 0, 0), Vector3(0, 1, 0));
          }
          break;
        case "front-tilted":
          {
            camera.matrix.makeTranslation(0, 20, 20);
            const eye = Vector3(0, 20, 20);
            camera.matrix[3] = eye.x;
            camera.matrix[7] = eye.y;
            camera.matrix[11] = eye.z;
            camera.matrix.lookAt(eye, Vector3(0, 0, 0), Vector3(0, 1, 0));
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

export type Environment = "none" | "underwater" | "grid" | "white-floor";

export function getEnvironment(environment: Environment = "grid"): Shape {
  switch (environment) {
    case "none":
      return Group({});
    case "underwater":
      document.body.style.backgroundColor = "#104A8A";
      return Group({});
    case "grid":
      document.body.style.backgroundColor = "#e1e1e1";
      return Grid({
        id: "background",
        rotation: Vector3(0, 0, 0),
        cellCount: 10,
        cellSize: 100,
        fill: Color(0, 0, 0, 0),
        stroke: Color(0, 0, 0),
        strokeWidth: 4,
      });
    case "white-floor":
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

let paused = false;
export function setPaused(pause: boolean) {
  paused = pause;
}
export function getPaused() {
  return paused;
}
