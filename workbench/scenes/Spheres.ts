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
import {
  getCamera,
  getEnvironment,
  getLighting,
  getPaused,
  onUpdate,
} from "../Settings";

export default function () {
  const scale = 0.3;

  addSphereScene(Vector3(0, 0, -1), scale, "From Front");
  addSphereScene(Vector3(-1, 0, 0), scale, "From Right");
  addSphereScene(Vector3(1, 0, 0), scale, "From Left");
  addSphereScene(Vector3(-1, 0, 1), scale, "From Right Behind");
  addSphereScene(Vector3(1, 0, 1), scale, "From Left Behind");
  addSphereScene(Vector3(0, -1, 1), scale, "From Top Behind");
  addSphereScene(Vector3(0, 1, -1), scale, "From Bottom Front");
}

function addSphereScene(lightDirection: Vector3, scale: number, title: string) {
  const container = document.createElement("div");
  container.innerHTML = `<h3>${title}</h3>`;
  container.style.display = "inline-block";
  const svgContainer = document.createElement("div");
  // container.style.transform = "translate(-50%, -50%) scale(2)"; //`translate(${scale},${scale}) scale(${scale})`;
  svgContainer.style.display = "inline-block";
  svgContainer.style.width = Math.floor(window.innerWidth * scale) + "px";
  svgContainer.style.height = Math.floor(window.innerHeight * scale) + "px";
  svgContainer.style.transform = `translate(0%,0%) scale(${scale})`; //`translate(${scale},${scale}) scale(${scale})`;
  svgContainer.className = "scene 2";
  container.appendChild(svgContainer);

  lightDirection.normalize().multiply(-1);

  const lightBall = Sphere({ radius: 10 });
  lightBall.position = lightDirection.clone().multiply(75);

  const sphere = Sphere({});
  const scene: Scene = {
    ...getLighting("moonlit"),
    shapes: [
      getEnvironment(),
      sphere,
      lightBall,
      // Sphere({
      //   radius: 75,
      //   stroke: Color(0, 0, 0),
      //   strokeWidth: 4,
      //   position: Vector3(0, 35 + 100, 0),
      // }),
      // // Fake shadow
      // Cylinder({
      //   height: 1,
      //   radius: 60,
      //   fill: Color(0, 0, 0, 0.6),
      //   stroke: Color(0, 0, 0, 0),
      // }),
    ],
  };

  scene.directionalLight.direction = lightDirection;

  const { viewport, camera, updateCamera } = getCamera("front", 10);

  onUpdate(({ now, deltaTime }) => {
    const cameraSpeed = 0.0;
    updateCamera(now * cameraSpeed * 360 + 45, 20);

    render(svgContainer, scene, viewport, camera);
    document.getElementById("root")!.appendChild(container);
    // render(document.getElementById("root")!, scene, viewport, camera);
  });
}
