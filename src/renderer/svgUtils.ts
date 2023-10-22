import { Matrix4x4 } from "../math/Matrix4x4";

export function generateSVGTransformMatrix(
  x: number,
  y: number,
  transformCameraSpace: Matrix4x4,
  totalScaleFactor: number = 1
) {
  const e = transformCameraSpace.elements;

  const xAxis = { x: e[0] * totalScaleFactor, y: -e[1] * totalScaleFactor };
  const yAxis = { x: -e[4] * totalScaleFactor, y: e[5] * totalScaleFactor };

  const precision = 3;
  const transformMatrixText = `matrix(${xAxis.x.toFixed(
    precision
  )} ${xAxis.y.toFixed(precision)} ${yAxis.x.toFixed(
    precision
  )} ${yAxis.y.toFixed(precision)} ${x.toFixed(precision)} ${y.toFixed(
    precision
  )})`;
  return transformMatrixText;
}

export function deserializeSVG(svgString: string): SVGElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svg = doc.firstChild as SVGElement;

  return svg;
}

export function serializeSVG(svg: SVGElement): string {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);

  return svgString;
}
