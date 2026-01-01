import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { Camera, Color, Vector3 } from "@skewed/core";
import { AmbientLight, Box, DirectionalLight, Html, Skewed, Sphere } from "../src";

function makeCamera(width: number, height: number) {
  const c = Camera();
  c.projectionMatrix.makeOrthographic(0, width, 0, height, 0, 10000);
  const eye = Vector3(20, 20, 20);
  c.matrix.elements[3] = eye.x;
  c.matrix.elements[7] = eye.y;
  c.matrix.elements[11] = eye.z;
  c.matrix.lookAt(eye, Vector3(0, 0, 0), Vector3(0, 1, 0));
  return c;
}

describe("<Skewed />", () => {
  it("renders an SVG scene and mounts <Html> children into a foreignObject", async () => {
    const viewport = { left: 0, top: 0, width: 400, height: 300 };
    const camera = makeCamera(viewport.width, viewport.height);

    const host = document.createElement("div");
    document.body.appendChild(host);

    const root = createRoot(host);

    await act(async () => {
      root.render(
        <Skewed camera={camera} viewport={viewport}>
          <AmbientLight color={Color(64, 64, 64)} />
          <DirectionalLight
            direction={Vector3(-0.25, -1, -0.25).normalize()}
            color={Color(255, 252, 255)}
          />
          <Box
            width={120}
            height={120}
            depth={120}
            fill={Color(255, 180, 0)}
            stroke={Color(0, 0, 0)}
            strokeWidth={2}
          />
          <Sphere
            position={Vector3(120, 60, 0)}
            radius={60}
            fill={Color(120, 190, 255)}
            stroke={Color(0, 0, 0)}
            strokeWidth={2}
          />
          <Html id="html-test" width={220} height={80} position={Vector3(0, 120, 0)}>
            <span id="html-inner">Hello</span>
          </Html>
        </Skewed>
      );
    });

    // Allow the Html subtree macrotask mount to run.
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    const svg = host.querySelector("svg#scene");
    expect(svg).toBeTruthy();

    const foreignObject = host.querySelector(
      'foreignObject[data-skewed-html-id="html-test"]'
    );
    expect(foreignObject).toBeTruthy();

    const inner = host.querySelector("#html-inner");
    expect(inner?.textContent).toBe("Hello");

    await act(async () => {
      root.unmount();
    });
  });
});


