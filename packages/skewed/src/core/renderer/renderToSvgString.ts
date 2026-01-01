import { Camera } from "../cameras/Camera";
import { render } from "./Renderer";
import { Scene } from "./Scene";
import { Viewport } from "./Viewport";

/**
 * Deterministic render helper for tests and tooling.
 *
 * Requires a DOM environment (e.g. Jest `testEnvironment: 'jsdom'`).
 */
export function renderToSvgString(
  scene: Scene,
  viewport: Viewport,
  camera: Camera,
): string {
  if (typeof document === "undefined") {
    throw new Error(
      "renderToSvgString requires a DOM. Use a jsdom test environment.",
    );
  }

  const container = document.createElement("div");
  render(container, scene, viewport, camera);
  const svg = container.querySelector("svg");
  if (!svg) throw new Error("No <svg> produced by renderer");
  return svg.outerHTML;
}
