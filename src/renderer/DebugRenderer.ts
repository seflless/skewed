import { Color, ColorToCSS } from "../colors/Color";

export function DebugLine2D(
  svg: SVGElement,
  x: number,
  y: number,
  x2: number,
  y2: number,
  stroke: Color = Color(0, 0, 0)
) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x.toFixed(2));
  line.setAttribute("y1", y.toFixed(2));
  line.setAttribute("x2", x2.toFixed(2));
  line.setAttribute("y2", y2.toFixed(2));
  line.setAttribute("stroke", ColorToCSS(stroke));
  //   line.setAttribute("stroke-width", "0.1");
  svg.appendChild(line);
}
