/*
 *
 */

export function logSVG(svg: SVGElement) {
  // @ts-ignore
  const clientRect = svg.getBoundingClientRect();
  const width = clientRect.width;
  const height = clientRect.height / 2;

  // Get svg data
  var xml = new XMLSerializer().serializeToString(svg);

  // Make it base64
  var svg64 = btoa(xml);
  var b64Start = "data:image/svg+xml;base64,";

  // Prepend a "header"
  var image64 = b64Start + svg64;

  const style =
    "font-size: 1px; padding: " +
    Math.floor(height / 2) +
    "px " +
    Math.floor(width / 2) +
    "px; line-height: " +
    height +
    "px;";

  // Logging part
  console.log(
    "%c" + "+",
    style +
      "background-image: url(" +
      image64 +
      "); background-size: " +
      width +
      "px " +
      height +
      "px; background-size: 100% 100%; background-repeat: norepeat; color: transparent;"
  );
}
