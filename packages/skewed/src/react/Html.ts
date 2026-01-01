import * as React from "react";
import { TYPE_HTML } from "./intrinsics";
import type { SkewedHtmlProps } from "./types";

export function Html(props: SkewedHtmlProps) {
  const { children, ...rest } = props;
  return React.createElement(TYPE_HTML, { ...rest, __htmlChildren: children });
}
