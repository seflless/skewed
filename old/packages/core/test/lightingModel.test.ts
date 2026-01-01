import { applyLighting } from "../src/lighting/LightingModel";
import { Color } from "../src/colors/Color";

describe("applyLighting", () => {
  it("produces darker colors when brightness is low", () => {
    const light = Color(255, 255, 255);
    const base = Color(200, 100, 50);
    const ambient = Color(0, 0, 0);

    const dark = applyLighting(light, base, ambient, 0.0);
    const bright = applyLighting(light, base, ambient, 1.0);

    expect(dark).not.toEqual(bright);
  });
});


