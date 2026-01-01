import { projectToScreenCoordinate } from "../cameras/Camera";
import { Matrix4x4 } from "../math/Matrix4x4";
import { HtmlShape } from "../shapes/Shape";
import { Viewport } from "./Viewport";

export const HTML_CONTAINER_ATTR = "data-skewed-html-container";

export function renderHtml(
  svg: SVGElement,
  shape: HtmlShape,
  viewport: Viewport,
  worldTransform: Matrix4x4,
  cameraZoom: number,
  inverseAndProjectionMatrix: Matrix4x4,
  reusedForeignObject?: SVGForeignObjectElement,
) {
  const { x, y } = projectToScreenCoordinate(
    worldTransform.getTranslation(),
    inverseAndProjectionMatrix,
    viewport,
  );

  const scale = worldTransform.getScale().x;
  const width = shape.width * scale * cameraZoom;
  const height = shape.height * scale * cameraZoom;

  const fo =
    reusedForeignObject ||
    (document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject",
    ) as unknown as SVGForeignObjectElement);

  fo.setAttribute("id", shape.id);
  fo.setAttribute("data-skewed-html-id", shape.id);
  fo.setAttribute("x", (x - width / 2).toString());
  fo.setAttribute("y", (y - height / 2).toString());
  fo.setAttribute("width", width.toString());
  fo.setAttribute("height", height.toString());

  // Ensure there is a stable HTML container inside the foreignObject for ReactDOM.
  const existing = fo.querySelector(`[${HTML_CONTAINER_ATTR}="true"]`);
  if (!existing) {
    while (fo.firstChild) {
      fo.removeChild(fo.firstChild);
    }
    const div = document.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "div",
    ) as unknown as HTMLDivElement;
    div.setAttribute(HTML_CONTAINER_ATTR, "true");
    div.style.width = "100%";
    div.style.height = "100%";
    fo.appendChild(div as any);
  }

  svg.appendChild(fo);
}
