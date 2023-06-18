export function point3DToIsometric(x: number, y: number, z: number) {
  return {
    x: (x - z) * Math.cos(Math.PI / 6) + window.innerWidth / 2,
    y: (x + z) * Math.sin(Math.PI / 6) - y + window.innerHeight / 2,
  };
}

export function point3DToCabinet(x: number, y: number, z: number) {
  // Oblique angle usually is 45 degrees for cabinet projection.
  let alpha = Math.PI / 4;

  // scale factor typically half in depth (z) direction.
  let scale = 0.5;

  return {
    x: x + scale * z * Math.cos(alpha) + window.innerWidth / 2,
    y: y + scale * z * Math.sin(alpha) + window.innerHeight / 2,
  };
}
