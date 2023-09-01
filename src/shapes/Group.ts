import { DefaultTransformProperties, GroupShape } from "./Shape";

export type GroupProperties = Omit<GroupShape, "type">;

const DefaultGridProperties = {
  id: "",
  children: [],
};

export function Group(props?: Partial<GroupProperties>): GroupShape {
  const group: GroupShape = {
    type: "group",
    ...DefaultTransformProperties(),
    ...DefaultGridProperties,
    ...props,
  };

  return group;
}
