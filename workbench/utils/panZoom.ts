export function panZoom() {
  document.addEventListener(
    "wheel",
    (event: WheelEvent) => {
      event.preventDefault();
      if (event.ctrlKey) {
        console.log("pinch");
      } else {
        console.log("pan");
      }
      // console.log(event);
    },
    { passive: false }
  );
}
