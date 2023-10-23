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

const DefaultTextProperties: TextProperties = {
  text: "",
  fontSize: DefaultFontSize,
  fontFamily: "Arial",
  ...DefaultBasicShapeProperties(),
};

export function Text(props: Partial<TextProperties>): TextShape {
  const text: TextShape = {
    type: "text",
    ...DefaultTextProperties,
    ...props,
  };
  return text;
}
