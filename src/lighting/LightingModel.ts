import { Color } from "../colors/Color";

export function applyLighting(
  directionalLightColor: Color,
  surfaceColor: Color,
  ambientLightColor: Color,
  brightness: number
): Color {
  brightness = Math.min(1.0, Math.max(0, brightness));

  const directionalLightCoefficients = Color(
    (directionalLightColor.r / 255) * brightness,
    (directionalLightColor.g / 255) * brightness,
    (directionalLightColor.b / 255) * brightness
  );

  const ambientLightColorCoefficients = Color(
    ambientLightColor.r / 255,
    ambientLightColor.g / 255,
    ambientLightColor.b / 255
  );

  const finalColor = Color(
    Math.floor(
      Math.min(
        255,
        surfaceColor.r * directionalLightCoefficients.r +
          surfaceColor.r * ambientLightColorCoefficients.r
      )
    ),
    Math.floor(
      Math.min(
        255,
        surfaceColor.g * directionalLightCoefficients.g +
          surfaceColor.g * ambientLightColorCoefficients.g
      )
    ),
    Math.floor(
      Math.min(
        255,
        surfaceColor.b * directionalLightCoefficients.b +
          surfaceColor.b * ambientLightColorCoefficients.b
      )
    ),
    surfaceColor.a
  );

  return finalColor;
}
