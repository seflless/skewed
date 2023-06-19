export type Color = {
  r: number;
  g: number;
  b: number;
};

function Color(r: number, g: number, b: number): Color {
  return { r, g, b };
}

export const Red: Color = Color(255, 0, 0);
export const Green: Color = Color(0, 255, 0);
export const Blue: Color = Color(0, 0, 255);
