import { Vector3 } from "../math/Vector3";
import {
  BasicShapeProperties,
  DefaultBasicShapeProperties,
  DefaultFontSize,
  ArrowShape,
  TextShape,
} from "./Shape";

export type ArrowProperties = {
  start: Vector3;
  middleOffset: number;
  end: Vector3;
} & BasicShapeProperties;

const DefaultArrowProperties: ArrowProperties = {
  start: Vector3(0, 0, 0),
  middleOffset: 0.5,
  end: Vector3(100, 0, 0),
  ...DefaultBasicShapeProperties(),
};

export function Arrow(props: Partial<ArrowProperties>): ArrowShape {
  const arrow: ArrowShape = {
    type: "arrow",
    ...DefaultArrowProperties,
    ...props,
  };
  return arrow;
}
