import {
  Box,
  Camera,
  Color,
  DirectionalLight,
  Html,
  Sphere,
  Vector3,
  renderToSvgString,
} from "../src";

function makeCamera(width: number, height: number) {
  const camera = Camera();
  camera.projectionMatrix.makeOrthographic(0, width, 0, height, 0, 10000);
  const eye = Vector3(20, 20, 20);
  camera.matrix.elements[3] = eye.x;
  camera.matrix.elements[7] = eye.y;
  camera.matrix.elements[11] = eye.z;
  camera.matrix.lookAt(eye, Vector3(0, 0, 0), Vector3(0, 1, 0));
  return camera;
}

describe("renderToSvgString", () => {
  it("renders core shapes and Html foreignObject deterministically", () => {
    const viewport = { left: 0, top: 0, width: 400, height: 300 };
    const camera = makeCamera(viewport.width, viewport.height);

    const scene = {
      directionalLight: DirectionalLight({
        direction: Vector3(-0.25, -1, -0.25).normalize(),
        color: Color(255, 252, 255),
      }),
      ambientLightColor: Color(64, 64, 64),
      shapes: [
        Box({
          id: "box",
          width: 120,
          height: 120,
          depth: 120,
          fill: Color(255, 180, 0),
          stroke: Color(0, 0, 0),
          strokeWidth: 2,
        }),
        Sphere({
          id: "sphere",
          position: Vector3(120, 60, 0),
          radius: 60,
          fill: Color(120, 190, 255),
          stroke: Color(0, 0, 0),
          strokeWidth: 2,
        }),
        Html({
          id: "html1",
          position: Vector3(0, 120, 0),
          width: 220,
          height: 80,
        }),
      ],
    };

    const svg = renderToSvgString(scene, viewport, camera);
    expect(svg).toContain("<svg");
    expect(svg).toContain('foreignObject');
    expect(svg).toContain('data-skewed-html-id="html1"');
    expect(svg).toMatchSnapshot();
  });
});


