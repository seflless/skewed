import { Color } from "../colors/Color";
import { Vector3 } from "../math/Vector3";
import { Box } from "./Box";
import { GridShape } from "./Shape";

export type GridProps = Omit<
  GridShape,
  "type" | "children" | "position" | "scale"
>;

export function Grid(props: GridProps): GridShape {
  const grid: GridShape = {
    type: "grid",
    ...props,
    children: [],
    position: Vector3(0, 0, 0),
    scale: 1.0,
  };

  for (let i = 0; i <= props.cellCount; i++) {
    const zAxisLine = Box({
      position: Vector3(
        0,
        0,
        i * props.cellSize -
          (props.cellSize * props.cellCount) / 2 /*+ props.cellSize / 2*/
      ),
      rotation: Vector3(0, 0, 0),
      scale: 1.0,
      width: props.cellCount * props.cellSize,
      height: props.strokeWidth,
      depth: props.strokeWidth,
      fill: props.stroke,
      stroke: Color(0, 0, 0),
      strokeWidth: 0,
    });

    grid.children.push(zAxisLine);

    const xAxisLine = Box({
      position: Vector3(
        i * props.cellSize - (props.cellSize * props.cellCount) / 2,
        0,
        0 /*+ props.cellSize / 2*/
      ),
      rotation: Vector3(0, 0, 0),
      scale: 1.0,
      width: props.strokeWidth,
      height: props.strokeWidth,
      depth: props.cellCount * props.cellSize,
      fill: props.stroke,
      stroke: Color(0, 0, 0),
      strokeWidth: 0,
    });

    grid.children.push(xAxisLine);
  }

  return grid;
}
