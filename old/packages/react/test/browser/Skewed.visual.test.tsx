import * as React from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { Camera, Color, Vector3 } from "@skewed/core";
import { AmbientLight, Box, DirectionalLight, Html, Skewed, Sphere } from "../../src";

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

describe("visual", () => {
  it("basic scene screenshot", async () => {
    const viewport = { left: 0, top: 0, width: 900, height: 600 };
    const camera = makeCamera(viewport.width, viewport.height);

    document.body.style.margin = "0";
    const host = document.createElement("div");
    document.body.appendChild(host);

    createRoot(host).render(
      <Skewed camera={camera} viewport={viewport} style={{ width: viewport.width, height: viewport.height }}>
        <AmbientLight color={Color(64, 64, 64)} />
        <DirectionalLight direction={Vector3(-0.25, -1, -0.25).normalize()} color={Color(255, 252, 255)} />
        <Box width={160} height={120} depth={80} fill={Color(255, 180, 0)} stroke={Color(0, 0, 0)} strokeWidth={2} />
        <Sphere position={Vector3(220, 80, 0)} radius={90} fill={Color(120, 190, 255)} stroke={Color(0, 0, 0)} strokeWidth={2} />
        <Html id="html-visual" position={Vector3(0, 120, 0)} width={260} height={110}>
          <div style={{ background: "white", border: "2px solid black", padding: 12 }}>
            <strong>Html</strong>
            <div style={{ fontSize: 12 }}>foreignObject</div>
          </div>
        </Html>
      </Skewed>
    );

    // Wait a bit for React effects and the Html subtree mount.
    await new Promise((r) => setTimeout(r, 50));

    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot("skewed-basic.png");
  });
});


