export type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export function Color(r: number, g: number, b: number): Color;
export function Color(r: number, g: number, b: number, a: number): Color;

export function Color(r: number, g: number, b: number, a: number = 1.0): Color {
  return { r, g, b, a };
}

export const Red: Color = Color(255, 0, 0);
export const Green: Color = Color(0, 255, 0);
export const Blue: Color = Color(0, 0, 255);
