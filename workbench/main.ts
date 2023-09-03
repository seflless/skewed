import "./index.css";
import KitchenSink from "./scenes/KitchenSink";
import Transforms from "./scenes/Transforms";
import Octopus from "./scenes/Octopus";
import Spheres from "./scenes/Spheres";
import Worm from "./scenes/Worm";
import { getPaused, setPaused } from "./Settings";

// KitchenSink();
// Transforms();
Octopus();
// Spheres();
// Worm();

document
  .getElementById("copy-svg")
  ?.addEventListener("pointerdown", (event: PointerEvent) => {
    event.stopPropagation();
    const svg = document.querySelector("svg");
    navigator.clipboard.writeText(svg!.outerHTML);
  });

const pausePlayButton = document.getElementById("play-pause")!;
document
  .getElementById("play-pause")
  ?.addEventListener("pointerdown", (event: PointerEvent) => {
    event.stopPropagation();

    togglePlayState();
  });

syncPausePlayUIState();

function togglePlayState() {
  setPaused(!getPaused());
  syncPausePlayUIState();
}
function syncPausePlayUIState() {
  pausePlayButton.innerHTML = getPaused() ? "▶︎" : "‖";
}

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    togglePlayState();
  }
});
