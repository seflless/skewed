import { Color, ColorToCSS } from "../colors/Color";
import { Viewport } from "./Viewport";

export function DebugLine2D(
  svg: SVGElement,
  viewport: Viewport,
  x: number,
  y: number,
  x2: number,
  y2: number,
  stroke: Color = Color(0, 0, 0)
) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.style.zIndex = "1000";
  line.setAttribute("x1", x.toFixed(2));
  line.setAttribute("y1", y.toFixed(2));
  line.setAttribute("x2", x2.toFixed(2));
  line.setAttribute("y2", y2.toFixed(2));
  line.setAttribute("stroke", ColorToCSS(stroke));
  //   line.setAttribute("stroke-width", "0.1");

  // @ts-ignore
  if (!svg.debugQueue) {
    // @ts-ignore
    svg.debugQueue = [];
  }
  // @ts-ignore
  svg.debugQueue.push(line);
}
