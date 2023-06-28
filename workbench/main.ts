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
} from "../src/index";
import { pathParser } from "../src/utils/svgPathParser";

// From this shape in Figma, exported as an SVG file, then copy/pasting out the path string
// https://www.figma.com/file/735rFnz0E5ib3rq4ha5MMF/Figma-Experiments?type=design&node-id=1312-16&mode=design&t=w03Fbw0ybh430M6y-4
const pathFromFigmaCircle =
  "M99.9571 50C101.207 78.75 74.9678 100 49.9785 100C22.3762 100 0 75 0 50C0 22.3857 26.6552 -1.24592e-09 49.9785 0C77.5808 0 99.9571 22.9167 99.9571 50Z";
console.log(pathFromFigmaCircle);
console.log(pathParser(pathFromFigmaCircle, true));

const sphere = Sphere(Vector3(300, 100, 300), 75, Color(255, 255, 0));

const Particle_Speed_Max = 500;
const Particle_Count = 20;
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
    Box({
      position: Vector3(0, 50, 0),
      width: 100,
      height: 100,
      depth: 100,
      fill: Red,
    }),
    Box({
      position: Vector3(150, 50, 0),
      width: 100,
      height: 100,
      depth: 100,
      fill: Green,
    }),
    Box({
      position: Vector3(300, 50, 0),
      width: 100,
      height: 100,
      depth: 100,
      fill: Blue,
    }),
    Cylinder({
      position: Vector3(0, 100, 300),
      radius: 50,
      height: 300,
      segments: 180,
      fill: Color(255, 0, 255),
    }),
    sphere,
    ...particles,
    ...Axii(Vector3(-500, 0, 0)),
  ],
};

const viewport: Viewport = {
  left: 0,
  top: 0,
  width: window.innerWidth,
  height: window.innerHeight,
};

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
  render(document.body, scene, viewport);
  requestAnimationFrame(renderLoop);
}
renderLoop();
