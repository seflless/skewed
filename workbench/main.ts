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
} from "../src/index";
import { Blue, Green, Red, Color } from "../src/colors/Color";

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

const scene: Scene = {
  shapes: [
    Box(Vector3(0, 50, 0), Red),
    Box(Vector3(150, 50, 0), Green),
    Box(Vector3(300, 50, 0), Blue),
    Cylinder(Vector3(0, 100, 300), Color(255, 0, 255)),
    sphere,
    ...particles,
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
