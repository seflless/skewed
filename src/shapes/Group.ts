import { BasicShapeProperties, GroupShape, Shape } from "./Shape";
import { BoxMesh } from "../meshes/BoxMesh";

export type GroupProps = Omit<GroupShape, "type">;

export function Group(props: GroupProps): GroupShape {
  const group: GroupShape = {
    type: "group",
    position: props.position,
    rotation: props.rotation,
    scale: props.scale,
    children: props.children,
  };

  return group;
}
