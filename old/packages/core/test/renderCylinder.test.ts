import {
  Camera,
  Color,
  Cylinder,
  DirectionalLight,
  Vector3,
  renderToSvgString,
} from "../src";

describe("cylinder rendering", () => {
  it("renders a cylinder with gradient defs", () => {
    const viewport = { left: 0, top: 0, width: 400, height: 300 };
    const camera = Camera();
    camera.projectionMatrix.makeOrthographic(0, viewport.width, 0, viewport.height, 0, 10000);
    const eye = Vector3(20, 20, 20);
    camera.matrix.elements[3] = eye.x;
    camera.matrix.elements[7] = eye.y;
    camera.matrix.elements[11] = eye.z;
    camera.matrix.lookAt(eye, Vector3(0, 0, 0), Vector3(0, 1, 0));

    const scene = {
      directionalLight: DirectionalLight({
        direction: Vector3(-0.25, -1, -0.25).normalize(),
        color: Color(255, 252, 255),
      }),
      ambientLightColor: Color(64, 64, 64),
      shapes: [
        Cylinder({
          id: "cyl",
          radius: 50,
          height: 120,
          fill: Color(120, 190, 255),
          stroke: Color(0, 0, 0),
          strokeWidth: 2,
        }),
      ],
    };

    const svg = renderToSvgString(scene, viewport, camera);
    expect(svg).toContain("<linearGradient");
    expect(svg).toContain("cylinder-tube");
  });
});


