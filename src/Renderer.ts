import { point3DToIsometric } from "./Camera";
import { Scene } from "./Scene";
import { Viewport } from "./Viewport";

export function Render(
  container: HTMLElement,
  scene: Scene,
  viewport: Viewport
) {
  // Clear the container of all children
  // TODO: Change API to make it so we reuse created elements
  container.innerHTML = "";

  const svg = document.createElement("svg");
  svg.setAttribute("width", viewport.width.toString());
  svg.setAttribute("height", viewport.height.toString());
  svg.style.position = "absolute";

  // For each shape in the scene
  for (let shape of scene.shapes) {
    // Transform the shape's mesh's points to screen space
    const vertices = shape.mesh.vertices.map((vertex) =>
      point3DToIsometric(
        vertex.x + shape.position.x,
        vertex.y + shape.position.y,
        vertex.z + shape.position.z
      )
    );

    // Render each face of the shape
    // TODO: Add in backface culling
    for (let face of shape.mesh.faces) {
      let points = "";
      // A face
      face.indices.forEach((index) => {
        points += `${Math.floor(vertices[index].x)},${Math.floor(
          vertices[index].y
        )} `;
      });

      const polygon = document.createElement("polygon");

      polygon.setAttribute("fill", face.fill);
      polygon.setAttribute("points", points);

      svg.appendChild(polygon);
    }
  }

  container.appendChild(svg);
}
