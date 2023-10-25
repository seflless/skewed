import {
  BasicShapeProperties,
  Shape,
  DefaultBasicShapeProperties,
  DefaultShapeDimension,
  EventProperties,
} from "./Shape";
import { BoxMesh } from "../meshes/BoxMesh";

export type BoxProperties = EventProperties & {
  width: number;
  height: number;
  depth: number;
};

const DefaultBoxProperties: BoxProperties & { id: string } = {
  width: DefaultShapeDimension,
  height: DefaultShapeDimension,
  depth: DefaultShapeDimension,
  id: "box",
};

export function Box(
  props: Partial<BoxProperties & BasicShapeProperties>
): Shape {
  const dimensions: BoxProperties = {
    width: props.width || DefaultBoxProperties.width,
    height: props.height || DefaultBoxProperties.height,
    depth: props.depth || DefaultBoxProperties.depth,
  };

  const box: Shape = {
    type: "mesh",
    mesh: BoxMesh(dimensions.width, dimensions.height, dimensions.depth),
    ...DefaultBasicShapeProperties(),
    id: props.id || DefaultBoxProperties.id,
    ...props,
  };

  return box;
}
