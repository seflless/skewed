import {
  BasicShapeProperties,
  DefaultTransformProperties,
  GroupShape,
  Shape,
} from "./Shape";

export type GroupProperties = Omit<GroupShape, "type">;

const DefaultGridProperties: GroupProperties = {
  ...DefaultTransformProperties,
  id: "",
  children: [],
};

export function Group(props?: Partial<GroupProperties>): GroupShape {
  const group: GroupShape = {
    type: "group",
    ...DefaultGridProperties,
    ...props,
  };

  return group;
}
