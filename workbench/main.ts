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

const sphere = Sphere(Vector3(300, 100, 300), 75, Color(255, 255, 0));

const Particle_Speed_Max = 500;
// const Particle_Count = 20;
const Particle_Count = 0;
const Particle_Invisible_Wall_Distance = 500;
const particles: Shape[] = [];
const particleVelocities: Vector3[] = [];
for (let i = 0; i < Particle_Count; i++) {
  const particle = Sphere(
    Vector3(
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
    20,
    Color(Math.random() * 255, Math.random() * 255, Math.random() * 255)
  );
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

// document.addEventListener("pointermove", (event) => {
//   sphere.position.x = event.clientX - window.innerWidth / 2;
//   sphere.position.z = event.clientY - window.innerHeight / 2;
// });

const Axii_Thickness = 4;
const Axii_Length = 100;
function Axii(position: Vector3) {
  return [
    Box({
      position: Vector3(Axii_Thickness / 2 + Axii_Length / 2, 0, 0).add(
        position
      ),
      width: Axii_Length,
      height: Axii_Thickness,
      depth: Axii_Thickness,
      fill: Red,
    }),
    Box({
      position: Vector3(0, Axii_Thickness / 2 + Axii_Length / 2, 0).add(
        position
      ),
      width: Axii_Thickness,
      height: Axii_Length,
      depth: Axii_Thickness,
      fill: Green,
    }),
    Box({
      position: Vector3(0, 0, Axii_Thickness / 2 + Axii_Length / 2).add(
        position
      ),
      width: Axii_Thickness,
      height: Axii_Thickness,
      depth: Axii_Length,
      fill: Blue,
    }),
  ];
}

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
      position: Vector3(0, 0, 0),
      width: 100,
      height: 100,
      depth: 100,
      fill: Green,
    }),
    // Box({
    //   position: Vector3(150, 50, 0),
    //   width: 100,
    //   height: 100,
    //   depth: 100,
    //   fill: Green,
    // }),
    // Box({
    //   position: Vector3(300, 50, 0),
    //   width: 100,
    //   height: 100,
    //   depth: 100,
    //   fill: Blue,
    // }),
    Cylinder({
      position: Vector3(0, 100, 300),
      radius: 50,
      height: 300,
      segments: 180,
      fill: Color(255, 0, 255),
    }),
    // sphere,
    ...particles,
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

camera.matrix.makeTranslation(0, 0, 0);

window.addEventListener("resize", resize);

let lastRenderTime = performance.now() / 1000;
function renderLoop() {
  const now = performance.now() / 1000;
  const deltaTime = Math.max(0.0001, now - lastRenderTime);
  lastRenderTime = now;
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
