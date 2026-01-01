import * as React from "react";
import { AmbientLight, DirectionalLight, Grid } from "skewed";
import { Color, Vector3 } from "skewed";

export type LightingChoice =
  | "reference"
  | "blackAndWhite"
  | "moonlit"
  | "underwater"
  | "none";
export type EnvironmentChoice = "none" | "underwater" | "grid" | "whiteFloor";

export function Lighting({ choice }: { choice: LightingChoice }) {
  const direction = Vector3(-0.25, -1, -0.25).normalize();

  if (choice === "none") {
    return (
      <>
        <AmbientLight color={Color(255, 255, 255)} />
        <DirectionalLight direction={direction} color={Color(0, 0, 0)} />
      </>
    );
  }

  if (choice === "underwater") {
    const ambient = Color(16, 55, 119);
    const directional = Color(
      200 - ambient.r,
      200 - ambient.g,
      255 - ambient.b,
    );
    return (
      <>
        <AmbientLight color={ambient} />
        <DirectionalLight
          direction={Vector3(0, -1, 0).normalize()}
          color={directional}
        />
      </>
    );
  }

  if (choice === "moonlit") {
    return (
      <>
        <AmbientLight color={Color(64, 64, 120)} />
        <DirectionalLight direction={direction} color={Color(255, 252, 181)} />
      </>
    );
  }

  if (choice === "blackAndWhite") {
    return (
      <>
        <AmbientLight color={Color(0, 0, 0)} />
        <DirectionalLight direction={direction} color={Color(255, 252, 255)} />
      </>
    );
  }

  // reference
  return (
    <>
      <AmbientLight color={Color(64, 64, 64)} />
      <DirectionalLight direction={direction} color={Color(255, 252, 255)} />
    </>
  );
}

export function Environment({ choice }: { choice: EnvironmentChoice }) {
  React.useEffect(() => {
    if (choice === "underwater")
      document.body.style.backgroundColor = "#104A8A";
    else if (choice === "grid") document.body.style.backgroundColor = "#e1e1e1";
    else if (choice === "whiteFloor")
      document.body.style.backgroundColor = "rgb(32,32,32)";
    else document.body.style.backgroundColor = "";
  }, [choice]);

  if (choice === "grid") {
    return (
      <Grid
        id="background"
        rotation={Vector3(0, 0, 0)}
        cellCount={10}
        cellSize={100}
        fill={Color(0, 0, 0, 0)}
        stroke={Color(0, 0, 0)}
        strokeWidth={4}
      />
    );
  }

  return null;
}
