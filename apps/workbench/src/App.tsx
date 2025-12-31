import * as React from "react";
import { Skewed } from "@skewed/react";
import { useIsometricCamera } from "./hooks/useIsometricCamera";
import { useViewport } from "./hooks/useViewport";
import { Environment, Lighting } from "./scenes/SceneShared";
import { KitchenSinkScene } from "./scenes/KitchenSink";
import { CylindersScene } from "./scenes/Cylinders";
import { SpheresScene } from "./scenes/Spheres";
import { SingleSphereScene } from "./scenes/SingleSphere";
import { SingleCylinderScene } from "./scenes/SingleCylinder";
import { SingleTextScene } from "./scenes/SingleText";
import { TransformsScene } from "./scenes/Transforms";
import { OctopusScene } from "./scenes/Octopus";
import { WormScene } from "./scenes/Worm";

export function App() {
  const viewport = useViewport();
  const [paused, setPaused] = React.useState(true);
  const [now, setNow] = React.useState(0);
  const { camera, updateCamera } = useIsometricCamera(viewport, 1);

  React.useEffect(() => {
    if (paused) return;
    let raf = 0;
    let lastMs: number | null = null;
    const loop = (tMs: number) => {
      raf = requestAnimationFrame(loop);
      if (lastMs == null) lastMs = tMs;
      const dt = (tMs - lastMs) / 1000;
      lastMs = tMs;
      setNow((n) => n + dt);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  React.useEffect(() => {
    updateCamera(now * 0.1 * 360 + 45, 20);
  }, [now, updateCamera]);

  const [scene, setScene] = React.useState<
    | "kitchenSink"
    | "transforms"
    | "octopus"
    | "worm"
    | "spheres"
    | "cylinders"
    | "singleSphere"
    | "singleCylinder"
    | "singleText"
  >("singleText");

  const onCopySvg = React.useCallback(() => {
    const svg = document.querySelector("svg#scene");
    if (!svg) return;
    void navigator.clipboard.writeText(svg.outerHTML);
  }, []);

  const onStep = React.useCallback(() => {
    // Deterministic step: 60 FPS
    setNow((n) => n + 1 / 60);
  }, []);

  const onReset = React.useCallback(() => {
    setNow(0);
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Skewed Workbench</h1>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <label>
          Scene{" "}
          <select value={scene} onChange={(e) => setScene(e.target.value as any)}>
            <option value="kitchenSink">KitchenSink</option>
            <option value="transforms">Transforms</option>
            <option value="spheres">Spheres</option>
            <option value="cylinders">Cylinders</option>
            <option value="singleText">SingleText</option>
            <option value="singleSphere">SingleSphere</option>
            <option value="singleCylinder">SingleCylinder</option>
            <option value="octopus">Octopus</option>
            <option value="worm">Worm</option>
          </select>
        </label>
        <button onClick={() => setPaused((p) => !p)}>{paused ? "Play" : "Pause"}</button>
        <button onClick={onStep} disabled={!paused}>
          Step
        </button>
        <button onClick={onReset}>Reset</button>
        <button onClick={onCopySvg}>Copy SVG</button>
      </div>

      <Skewed camera={camera} viewport={viewport} style={{ width: viewport.width, height: viewport.height }}>
        <Environment choice="grid" />
        <Lighting choice="reference" />
        {scene === "kitchenSink" && <KitchenSinkScene now={now} />}
        {scene === "transforms" && <TransformsScene now={now} />}
        {scene === "spheres" && <SpheresScene now={now} />}
        {scene === "cylinders" && <CylindersScene now={now} />}
        {scene === "singleSphere" && <SingleSphereScene now={now} />}
        {scene === "singleCylinder" && <SingleCylinderScene now={now} />}
        {scene === "singleText" && <SingleTextScene now={now} />}
        {scene === "octopus" && <OctopusScene now={now} />}
        {scene === "worm" && <WormScene now={now} />}
      </Skewed>
    </div>
  );
}


