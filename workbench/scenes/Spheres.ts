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
} from "../../src/index";
import { Axii } from "../Axii";
import {
  getCamera,
  getEnvironment,
  getLighting,
  getPaused,
  onUpdate,
} from "../Settings";

const scenarios: [Vector3, string][] = [
  [Vector3(-1, -1, -3), "From Up, Right, and in Front"],
  [Vector3(-1, -1, 3), "From Up, Right, and in Back"],
  [Vector3(0, 0, -1), "From Front"],
  [Vector3(0, 0, 1), "From Back"],
  [Vector3(-1, 0, 0), "From Right"],
  [Vector3(1, 0, 0), "From Left"],
  [Vector3(-1, 0, 1), "From Right Behind"],
  [Vector3(1, 0, 1), "From Left Behind"],
  [Vector3(0, -1, 1), "From Top Behind"],
  [Vector3(0, 1, -1), "From Bottom Front"],
  [Vector3(0, 1, 1), "From Bottom Behind"],
  [Vector3(-1, 0, 0.0001), "From Right Just Behind"],
];

export default function () {
  const viewportScale = 1 / Math.floor(Math.sqrt(scenarios.length));

  scenarios.forEach(([lightDirection, title]) => {
    addSphereScene(lightDirection, title);
  });
}

function addSphereScene(lightDirection: Vector3, title: string) {
  const container = document.createElement("div");
  container.innerHTML = `<h3>${title}</h3>`;
  container.style.display = "inline-block";
  const svgContainer = document.createElement("div");
  // container.style.transform = "translate(-50%, -50%) scale(2)"; //`translate(${scale},${scale}) scale(${scale})`;
  svgContainer.style.display = "inline-block";

  let cameraZoom = 8;
  const { viewport, camera, updateCamera } = getCamera("front", cameraZoom);

  function resize() {
    const viewportScale = 1 / Math.ceil(Math.sqrt(scenarios.length));

    svgContainer.style.width =
      Math.floor(window.innerWidth * viewportScale - 1) + "px";
    svgContainer.style.height =
      Math.floor(window.innerWidth * viewportScale - 1) + "px";

    viewport.height = viewport.width;
  }
  resize();
  window.addEventListener("resize", resize);

  svgContainer.style.transform = `translate(0%,0%)`; //`translate(${scale},${scale}) scale(${scale})`;
  svgContainer.className = "scene 2";
  container.appendChild(svgContainer);

  lightDirection.normalize();

  const lightRadius = 15;

  const lightBall = Sphere({
    radius: lightRadius / 4,
    fill: Color(255, 255, 0, 0),
    stroke: Color(255, 255, 0),
    strokeWidth: lightRadius / 2,
  });
  lightBall.position = lightDirection.clone().multiply(-70);

  const sphere = Sphere({ id: title });
  const scene: Scene = {
    ...getLighting("moonlit"),
    shapes: [
      getEnvironment(),
      // Axii(Vector3(-sphere.radius * 2, 0, 0)),
      sphere,
      lightBall,
    ],
  };

  scene.directionalLight.direction = lightDirection;

  onUpdate(({ now, deltaTime }) => {
    const cameraSpeed = 0.0;

    updateCamera(now * cameraSpeed * 360 + 45, 20);

    render(svgContainer, scene, viewport, camera);
    document.getElementById("root")!.appendChild(container);
  });
}
