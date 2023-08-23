import "./index.css";
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
} from "../src/index";
import { svgPathParser } from "../src/svg/svgPathParser";
import { svgPathToSvg3DCommands } from "../src/svg/svg3d";

// From this 1 diameter circle flattened into a path in Figma, exported as an SVG file, then copy/pasting out the path string
// Press 2 to zoom into the circle as it's 1x1 pixel by default and impossible to see until you zoom
// https://www.figma.com/file/735rFnz0E5ib3rq4ha5MMF/Figma-Experiments?type=design&node-id=1312-16&mode=design&t=w03Fbw0ybh430M6y-4
const pathFromFigmaCircle =
  "M1 0.5C1 0.776142 0.776142 1 0.5 1C0.223858 1 0 0.776142 0 0.5C0 0.223858 0.223858 0 0.5 0C0.776142 0 1 0.223858 1 0.5Z";
console.log(pathFromFigmaCircle);

const pathSegments = svgPathParser(pathFromFigmaCircle, true);
console.log(pathSegments);
const svg3DCommands = svgPathToSvg3DCommands(pathSegments);
console.log(svg3DCommands);

const sphere = Sphere({
  position: Vector3(0, 0, 0),
  rotation: Vector3(0, 0, 0),
  scale: 1.0,
  // radius: 80,
  radius: 40,
  fill: Color(255, 255, 0),
  stroke: Color(0, 0, 0, 0),
  strokeWidth: 4,
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
    fill: Color(Math.random() * 255, Math.random() * 255, Math.random() * 255),
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
  segments: 180,
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
      segments: 180,
      fill: Color(0, 0, 0, 0.5),
      stroke: Color(0, 0, 0, 0),
      strokeWidth: 0.1,
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
      strokeWidth: 0.1,
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
      strokeWidth: 0.1,
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
      strokeWidth: 0.1,
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
      stroke: Color(0, 0, 0),
      strokeWidth: 0.1,
    }),
  },
  {
    center: Vector3(200, 0, 0),
    shape: Cylinder({
      position: Vector3(400, 0, 100),
      rotation: Vector3(0, 0, 0),
      scale: 1.0,
      radius: 55,
      height: 1,
      segments: 180,
      fill: Color(0, 0, 0, 0.5),
      stroke: Color(0, 0, 0, 0),
      strokeWidth: 0.1,
    }),
  },
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

let ambientLightColor;
let directionalLightColor;

let lightingScenario: string = ["reference", "moonlit"][1];

if (lightingScenario === "moonlit") {
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
} else {
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
}

const nestedThriceGroup = Group({
  position: Vector3(300, 0, 0),
  rotation: Vector3(0, 45, 0),
  scale: 1.0,
  children: [
    Box({
      position: Vector3(0, 0, 0),
      rotation: Vector3(0, 0, 0),
      scale: 1.0,
      width: 100,
      height: 100,
      depth: 100,
      fill: Color(128, 0, 128),
      stroke: Color(0, 0, 0),
      strokeWidth: boxStrokeWidth,
    }),
  ],
});

const nestedTwiceGroup = Group({
  position: Vector3(200, 0, 0),
  rotation: Vector3(0, 45, 0),
  scale: 1.0,
  children: [
    Cylinder({
      position: Vector3(0, 0, 0),
      rotation: Vector3(90, 0, 0),
      scale: 1.0,
      radius: 50 / 2,
      height: 150,
      segments: 180,
      fill: Color(0, 0, 128),
      stroke: Color(0, 0, 0),
      strokeWidth: 0,
    }),
    nestedThriceGroup,
  ],
});

const nestedOnceGroup = Group({
  position: Vector3(200, 0, 0),
  rotation: Vector3(0, 45, 0),
  scale: 1.0,
  children: [
    Sphere({
      position: Vector3(0, 0, 0),
      rotation: Vector3(0, 0, 0),
      scale: 1.0,
      // radius: 80,
      radius: 70,
      fill: Color(0, 128, 0),
      stroke: Color(0, 0, 0, 0),
      strokeWidth: 4,
    }),
    nestedTwiceGroup,
  ],
});

const topMostGroup = Group({
  position: Vector3(-450, 50, 0),
  rotation: Vector3(0, 45, 0),
  scale: 1.0,
  children: [
    Box({
      position: Vector3(0, 0, 0),
      rotation: Vector3(0, 0, 0),
      scale: 1.0,
      width: 100,
      height: 100,
      depth: 100,
      fill: Color(128, 0, 0),
      stroke: Color(0, 0, 0),
      strokeWidth: boxStrokeWidth,
    }),
    nestedOnceGroup,
  ],
});

const sphereScaleTestGroup = Group({
  position: Vector3(-250, 50, 250),
  rotation: Vector3(0, 0, 0),
  scale: 1.0,
  children: [
    Sphere({
      position: Vector3(0, 0, 0),
      rotation: Vector3(0, 0, 0),
      scale: 1,
      // radius: 80,
      radius: 50,
      fill: Color(128, 128, 255),
      stroke: Color(0, 0, 0, 0),
      strokeWidth: 4,
    }),
  ],
});

const scene: Scene = {
  directionalLight: {
    type: "directional light",
    direction: Vector3(1, 0.75, 0).normalize(),
    color: Color(
      directionalLightColor.r - ambientLightColor.r,
      directionalLightColor.g - ambientLightColor.g,
      directionalLightColor.b - ambientLightColor.b
    ),
  },

  ambientLightColor,
  shapes: [
    Grid({
      rotation: Vector3(0, 0, 0),
      cellCount: 10,
      cellSize: 100,
      fill: Red,
      stroke: Color(0, 0, 0),
      strokeWidth: 4,
    }),
    topMostGroup,
    Box({
      position: Vector3(0, 50, 150),
      rotation: Vector3(0, 0, 0),
      scale: 1.0,
      width: 100,
      height: 100,
      depth: 100,
      fill: Red,
      stroke: Color(0, 0, 0),
      strokeWidth: boxStrokeWidth,
    }),
    Box({
      position: Vector3(0, 200, -350),
      rotation: Vector3(0, 0, 0),
      scale: 1.0,
      width: 100,
      height: 400,
      depth: 100,
      fill: Color(255, 255, 255),
      stroke: Color(0, 0, 0),
      strokeWidth: boxStrokeWidth,
    }),
    Sphere({
      position: Vector3(200, 70, 0),
      rotation: Vector3(0, 0, 0),
      scale: 1.0,
      // radius: 80,
      radius: 70,
      fill: Color(255, 128, 0),
      stroke: Color(0, 0, 0, 1),
      strokeWidth: 5,
    }),
    // sphereScaleTestGroup,
    transparentGreenBox,
    tallBlueBox,
    cylinder,
    sphere,
    ...shadowShapes,
    ...particles,
    // ...Axii(Vector3(0, 0, 0)),
  ],
};

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
    viewport.width * 2,
    0,
    viewport.height * 2,
    0,
    10000
  );
}
resize();

const cameraMode = ["front", "isometric", "cabinet"][1];

function updateCamera(rotationDegrees: number, distance: number = 20) {
  const x = Math.sin((rotationDegrees / 180) * Math.PI) * distance;
  const z = Math.cos((rotationDegrees / 180) * Math.PI) * distance;
  // const x = 20;
  // const z = 20;

  switch (cameraMode) {
    case "front":
      camera.matrix.makeTranslation(0, 0, 0);
      break;
    case "isometric":
      camera.matrix.makeTranslation(x, 20, z);
      const eye = Vector3(x, 20, z);
      camera.matrix[3] = eye.x;
      camera.matrix[7] = eye.y;
      camera.matrix[11] = eye.z;
      camera.matrix.lookAt(eye, Vector3(0, 0, 0), Vector3(0, 1, 0));
      break;
    case "cabinet":
      const alpha = Math.PI / 4; // 45 degrees in radians
      const cabinetSkew = Matrix4x4().set(
        1,
        0,
        -0.5 * Math.cos(alpha),
        0,
        0,
        1,
        -0.5 * Math.sin(alpha),
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      );

      camera.projectionMatrix.multiply(cabinetSkew);
      break;
  }
}

window.addEventListener("resize", resize);

let lastRenderTime = performance.now() / 1000;

let renderCount = 0;
function renderLoop() {
  // if (renderCount++ > 2) {
  //   return;
  // }
  const now = performance.now() / 1000;
  const deltaTime = Math.max(0.0001, now - lastRenderTime);
  lastRenderTime = now;

  // const cameraSpeed = 0.0;
  const cameraSpeed = 0.25;
  updateCamera(now * cameraSpeed * 360 + 45, 20);

  const sphereSpeed = 0.0;
  // const sphereSpeed = 0.1;
  // const sphereSpeed = 0.45;
  // const sphereSpeed = 0.55;
  const sphereRotationOffsetDegrees = 65;

  const spherePathRadius = 520;
  sphere.position.x =
    Math.sin(
      now * Math.PI * 2 * sphereSpeed +
        (sphereRotationOffsetDegrees / 180) * Math.PI
    ) * spherePathRadius;
  sphere.position.y = 100;
  sphere.position.z =
    Math.cos(
      now * Math.PI * 2 * sphereSpeed +
        (sphereRotationOffsetDegrees / 180) * Math.PI
    ) * spherePathRadius;

  scene.directionalLight.direction.x = Math.sin(
    now * Math.PI * 2 * sphereSpeed +
      (sphereRotationOffsetDegrees / 180) * Math.PI
  );
  // scene.directionalLight.direction.y = 0.75;
  scene.directionalLight.direction.z = Math.cos(
    now * Math.PI * 2 * sphereSpeed +
      (sphereRotationOffsetDegrees / 180) * Math.PI
  );
  scene.directionalLight.direction.normalize();

  const cylinderRotationSpeed = 0.25;
  const cylinderScaleSpeed = 0.25;
  const cylinderTranslationSpeed = 1;
  // cylinder.rotation.x = 90;
  // cylinder.rotation.y = now * 360 * cylinderRotationSpeed;

  const boxRotationSpeed = 0.25;
  // transparentBox.rotation.y = now * 360 * boxRotationSpeed;
  // transparentGreenBox.rotation.x = 90;

  const boxScalingSpeed = 0.25;
  tallBlueBox.scale =
    (1 + Math.sin(now * Math.PI * 2 * boxScalingSpeed) * 0.5) / 2.0;
  // console.log((now * cylinderRotationSpeed) % 1);
  // cylinder.position.x = ((now * cylinderRotationSpeed) % 1) * 500;

  // cylinder.scale = 1 + Math.sin(now * Math.PI * 2 * cylinderScaleSpeed) * 0.5;

  const groupScalingSpeed = 0.15;
  const scaleMultiplier = 1.0;
  topMostGroup.scale =
    ((1 + Math.sin(now * Math.PI * 2 * boxScalingSpeed) * 0.5) / 2.0) *
    scaleMultiplier;
  nestedOnceGroup.scale =
    ((1 + Math.sin(now * Math.PI * 2 * boxScalingSpeed) * 0.5) / 2.0) *
    scaleMultiplier;
  nestedTwiceGroup.scale =
    ((1 + Math.sin(now * Math.PI * 2 * boxScalingSpeed) * 0.5) / 2.0) *
    scaleMultiplier;
  const groupRotationSpeed = 0.15;
  topMostGroup.rotation.y = now * 360 * groupRotationSpeed;
  nestedOnceGroup.rotation.y = now * 360 * groupRotationSpeed;
  nestedTwiceGroup.rotation.y = now * 360 * groupRotationSpeed;

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
