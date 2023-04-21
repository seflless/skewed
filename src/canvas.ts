/*
 *
 */

// @ts-ignore
export function logCanvas(canvas: HTMLCanvasElement) {
  // Make it base64
  var image64 = canvas.toDataURL();
  const width = canvas.width;
  const height = canvas.height / 2;

  const style =
    "font-size: 1px; padding: " +
    Math.floor(height / 2) +
    "px " +
    Math.floor(width / 2) +
    "px; line-height: " +
    height +
    "px;";
  // Logging part
  const elementString =
    style +
    "background-image: url(" +
    image64 +
    "); background-size: " +
    width +
    "px " +
    height +
    "px; background-size: 100% 100%; background-repeat: norepeat; color: transparent;";
  console.log("%c" + "+", elementString);
}
