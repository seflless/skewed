import { log } from "console";
import { type } from "os";

export type PanDelta = {
  type: "pan";
  x: number;
  y: number;
};
export type ZoomDelta = {
  type: "zoom";
  zoom: number;
};

export type PanZoomDelta = PanDelta | ZoomDelta;

function logDelta(delta: PanZoomDelta) {
  console.log(delta);
}

export function panZoom(cb: (delta: PanZoomDelta) => void = logDelta) {
  document.addEventListener(
    "wheel",
    (event: WheelEvent) => {
      event.preventDefault();
      if (event.ctrlKey) {
        cb({ type: "zoom", zoom: event.deltaY });
        // console.log("pinch");
      } else {
        cb({ type: "pan", x: event.deltaX, y: event.deltaY });
        // console.log("pan");
      }
      console.log(event);
    },
    { passive: false }
  );
}
