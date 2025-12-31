import { Color } from "../colors/Color";
import { Vector3 } from "../math/Vector3";
import { Box } from "./Box";
import { DefaultBasicShapeProperties, GridShape } from "./Shape";

export type GridProperties = Omit<
  GridShape,
  "type" | "children" | "position" | "scale"
>;

const DefaultGridProperties: GridProperties = {
  cellCount: 10,
  cellSize: 100,
  ...DefaultBasicShapeProperties(),
};

export function Grid(props: Partial<GridProperties>): GridShape {
  const grid: GridShape = {
    type: "grid",
    children: [],
    position: Vector3(0, 0, 0),
    scale: 1,
    ...DefaultGridProperties,
    ...props,
  };

  for (let i = 0; i <= grid.cellCount; i++) {
    const zAxisLine = Box({
      position: Vector3(
        0,
        0,
        i * grid.cellSize -
          (grid.cellSize * grid.cellCount) / 2 /*+ props.cellSize / 2*/
      ),
      rotation: Vector3(0, 0, 0),
      scale: 1.0,
      width: grid.cellCount * grid.cellSize,
      height: props.strokeWidth,
      depth: props.strokeWidth,
      fill: props.stroke,
      stroke: Color(0, 0, 0),
      strokeWidth: 0,
    });

    grid.children.push(zAxisLine);

    const xAxisLine = Box({
      position: Vector3(
        i * grid.cellSize - (grid.cellSize * grid.cellCount) / 2,
        0,
        0 /*+ props.cellSize / 2*/
      ),
      rotation: Vector3(0, 0, 0),
      scale: 1.0,
      width: props.strokeWidth,
      height: props.strokeWidth,
      depth: grid.cellCount * grid.cellSize,
      fill: props.stroke,
      stroke: Color(0, 0, 0),
      strokeWidth: 0,
    });

    grid.children.push(xAxisLine);
  }

  return grid;
}
