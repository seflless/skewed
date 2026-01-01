import { DefaultTransformProperties, HtmlShape } from "./Shape";

export type HtmlProperties = Omit<HtmlShape, "type">;

const DefaultHtmlProperties: HtmlProperties = {
  ...DefaultTransformProperties(),
  id: "",
  width: 100,
  height: 100,
};

export function Html(props: Partial<HtmlProperties>): HtmlShape {
  return {
    type: "html",
    ...DefaultHtmlProperties,
    ...props,
  };
}
