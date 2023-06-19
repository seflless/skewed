import { point3DToCabinet, point3DToIsometric } from "./Camera";
import { Scene } from "./Scene";
import { Vector3 } from "./Vector3";
import { Viewport } from "./Viewport";

const directionalLight = Vector3(1, 0.75, 0).normalize();
const cameraDirection = Vector3(1, 1, 1).normalize();

export function render(
  container: HTMLElement,
  scene: Scene,
  viewport: Viewport
) {
  // Clear the container of all children
  // TODO: Change API to make it so we reuse created elements
  container.innerHTML = "";

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.setAttribute(
    "viewBox",
    `0 0 ${viewport.width.toString()} ${viewport.height.toString()}`
  );

  //   svg.style.position = "absolute";

  // For each shape in the scene
  for (let shape of scene.shapes) {
    // Transform the shape's mesh's points to screen space
    const vertices = shape.mesh.vertices.map((vertex) =>
      point3DToIsometric(
        //   point3DToCabinet(
        vertex.x + shape.position.x,
        vertex.y + shape.position.y,
        vertex.z + shape.position.z,
        viewport
      )
    );

    // Render each face of the shape
    // TODO: Add in backface culling
    for (let face of shape.mesh.faces) {
      const cameraFaceDot = cameraDirection.dotProduct(face.normal);
      if (cameraFaceDot < 0) continue;
      console.log(cameraFaceDot);

      let points = "";
      // A face
      face.indices.forEach((index) => {
        points += `${vertices[index].x},${vertices[index].y} `;
      });

      const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );

      polygon.setAttribute("points", points);

      const brightness = Math.max(
        0.5,
        directionalLight.dotProduct(face.normal)
      );
      //   polygon.setAttribute("fill", shape.fill);
      polygon.setAttribute(
        "fill",
        `rgb(${shape.fill.r * brightness}, ${shape.fill.g * brightness}, ${
          shape.fill.b * brightness
        })`
      );

      //   console.log(face.normal);
      //   console.log(brightness);

      //   svg.style.filter = `brightness(${brightness})`;

      svg.appendChild(polygon);
    }
  }

  container.appendChild(svg);
}
