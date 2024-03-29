import {
  BasicShapeProperties,
  DefaultBasicShapeProperties,
  DefaultFontSize,
  TextShape,
} from "./Shape";

export type TextProperties = {
  text: string;
  fontSize: number;
  fontFamily: string;
} & BasicShapeProperties;

const DefaultSphereProperties: TextProperties = {
  text: "",
  fontSize: DefaultFontSize,
  fontFamily: "Arial",
  ...DefaultBasicShapeProperties(),
};

export function Text(props: Partial<TextProperties>): TextShape {
  const text: TextShape = {
    type: "text",
    ...DefaultSphereProperties,
    ...props,
  };
  return text;
}
