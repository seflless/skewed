export function point3DToIsometric(x: number, y: number, z: number) {
  return {
    x: (x - z) * Math.cos(Math.PI / 6),
    y: (x + z) * Math.sin(Math.PI / 6) - y,
  };
}
