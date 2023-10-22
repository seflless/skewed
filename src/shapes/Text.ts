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
  thickness: number;
} & BasicShapeProperties;

const DefaultSphereProperties: TextProperties = {
  text: "",
  fontSize: DefaultFontSize,
  fontFamily: "Arial",
  thickness: 10,
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
