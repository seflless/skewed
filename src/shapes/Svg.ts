import {
  BasicShapeProperties,
  DefaultBasicShapeProperties,
  SvgShape,
} from "./Shape";

export type SvgProperties = {
  svg: SVGElement;
} & BasicShapeProperties;

const DefaultSvgProperties: SvgProperties = {
  svg: document.createElementNS("http://www.w3.org/2000/svg", "svg"),
  ...DefaultBasicShapeProperties(),
};

export function Svg(props: Partial<SvgProperties>): SvgShape {
  const svg: SvgShape = {
    type: "svg",
    ...DefaultSvgProperties,
    ...props,
  };
  return svg;
}
