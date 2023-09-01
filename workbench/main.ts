import "./index.css";
import KitchenSink from "./scenes/KitchenSink";
import Transforms from "./scenes/Transforms";
import Octopus from "./scenes/Octopus";
import Spheres from "./scenes/Spheres";

// KitchenSink();
// Transforms();
Octopus();
// Spheres();

document
  .getElementById("copy-svg")
  ?.addEventListener("pointerdown", (event: PointerEvent) => {
    event.stopPropagation();
    const svg = document.querySelector("svg");
    navigator.clipboard.writeText(svg!.outerHTML);
  });
