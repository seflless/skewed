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
  directionalLight,
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
  position: Vector3(300, 100, 300),
  radius: 30,
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
      width: 120,
      height: 1,
      depth: 120,
      fill: Color(0, 0, 0, 0.5),
      stroke: Color(0, 0, 0, 0),
      strokeWidth: 0.1,
    }),
  },
];
const shadowShapes = shadows.map((shadow) => shadow.shape);

const gridCount = 8;
const grid: Shape[] = [];
const gridSpacing = 100;
const gridLineThickness = 2;
const gridLineFill = Color(128, 128, 128, 0.5);

for (let i = 0; i <= gridCount; i++) {
  const zAxisLine = Box({
    position: Vector3(
      0,
      0,
      i * gridSpacing - (gridSpacing * gridCount) / 2 /*+ gridSpacing / 2*/
    ),
    width: gridCount * gridSpacing,
    height: gridLineThickness,
    depth: gridLineThickness,
    fill: gridLineFill,
    stroke: Color(0, 0, 0),
    strokeWidth: 0,
  });

  grid.push(zAxisLine);

  const xAxisLine = Box({
    position: Vector3(
      i * gridSpacing - (gridSpacing * gridCount) / 2,
      0,
      0 /*+ gridSpacing / 2*/
    ),
    width: gridLineThickness,
    height: gridLineThickness,
    depth: gridCount * gridSpacing,
    fill: gridLineFill,
    stroke: Color(0, 0, 0),
    strokeWidth: 0,
  });

  grid.push(xAxisLine);
}

const boxStrokeWidth = 3;
const scene: Scene = {
  shapes: [
    // Box({
    //   position: Vector3(-100, 150, 0),
    //   width: 100,
    //   height: 100,
    //   depth: 100,
    //   fill: Blue,
    // }),
    Box({
      position: Vector3(0, 50, 150),
      width: 100,
      height: 100,
      depth: 100,
      fill: Red,
      stroke: Color(0, 0, 0),
      strokeWidth: boxStrokeWidth,
    }),
    Box({
      position: Vector3(0, 100, 0),
      width: 100,
      height: 200,
      depth: 100,
      fill: Green,
      stroke: Color(0, 0, 0),
      strokeWidth: boxStrokeWidth,
    }),
    Box({
      position: Vector3(1, 200, -180),
      width: 100,
      height: 400,
      depth: 100,
      fill: Blue,
      stroke: Color(0, 0, 0),
      strokeWidth: boxStrokeWidth,
    }),
    cylinder,
    sphere,
    ...shadowShapes,
    ...particles,
    ...grid,
    // ...Axii(Vector3(-500, 0, 0)),
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
    viewport.width,
    0,
    viewport.height,
    0,
    10000
  );
}
resize();

// Front view
// camera.matrix.makeTranslation(0, 0, 0);

// Isometric view
// camera.matrix.makeTranslation(20, 20, 20);
camera.matrix.lookAt(Vector3(20, 20, 20), Vector3(0, 0, 0), Vector3(0, 1, 0));

window.addEventListener("resize", resize);

let lastRenderTime = performance.now() / 1000;
function renderLoop() {
  const now = performance.now() / 1000;
  const deltaTime = Math.max(0.0001, now - lastRenderTime);
  lastRenderTime = now;

  const sphereSpeed = 0.55;
  const spherePathRadius = 400;
  sphere.position.x =
    Math.sin(now * Math.PI * 2 * sphereSpeed) * spherePathRadius;
  sphere.position.y = 100;
  sphere.position.z =
    Math.cos(now * Math.PI * 2 * sphereSpeed) * spherePathRadius;

  directionalLight.x = Math.sin(now * Math.PI * 2 * sphereSpeed);
  directionalLight.y = 0.75;
  directionalLight.z = Math.cos(now * Math.PI * 2 * sphereSpeed);
  directionalLight.normalize();

  const shadowOffset = 40;
  for (let shadow of shadows) {
    shadow.shape.position.x =
      shadow.center.x + directionalLight.x * -shadowOffset;
    shadow.shape.position.z =
      shadow.center.z + directionalLight.z * -shadowOffset;
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
  render(document.body, scene, viewport, camera);
  requestAnimationFrame(renderLoop);
}
renderLoop();

const matrix = Matrix4x4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

matrix.makeTranslation(100, 200, 300);
console.log(matrix);
