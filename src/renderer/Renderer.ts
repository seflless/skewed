import {
  Camera,
  extractOrthographicDimensions,
  projectToScreenCoordinate,
} from "../cameras/Camera";
import { Scene } from "./Scene";
import { Vector3 } from "../math/Vector3";
import { Viewport, pointerToWorldStartDirection } from "./Viewport";
import { MeshShape, Shape, TransformProperties } from "../shapes/Shape";
import { Matrix4x4 } from "../math/Matrix4x4";
import { applyLighting } from "../lighting/LightingModel";
import { renderSphere } from "./renderSphere";
import { ColorToCSS } from "../colors/Color";
import { renderCylinder } from "./renderCylinder";
import { renderText } from "./renderText";
import { renderSvg } from "./renderSvg";
import { renderArrow } from "./renderArrow";

const CrackFillingStrokeWidth = 0.5;

export function render(
  container: HTMLElement,
  scene: Scene,
  viewport: Viewport,
  camera: Camera
) {
  const inverseCameraMatrix = camera.matrix.clone().invert();
  const inverseAndProjectionMatrix = camera.projectionMatrix
    .clone()
    .multiply(inverseCameraMatrix);
  const extractOrthographicDimensionsResult = extractOrthographicDimensions(
    camera.projectionMatrix
  );
  const cameraZoom = viewport.width / extractOrthographicDimensionsResult.width;

  // Generate the world transforms of all shapes, by walking the hierarchy, applying the transforms
  // recursively, and storying the result for each shape for use in sorting and rendering
  const worldTransforms = generateWorldTransforms(scene.shapes);

  // Clear the container of all children
  // TODO: Change API to make it so we reuse created elements
  container.innerHTML = "";

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.id = "scene";

  svg.setAttribute("width", viewport.width.toString());
  svg.setAttribute("height", viewport.height.toString());
  svg.setAttribute(
    "viewBox",
    `0 0 ${viewport.width.toString()} ${viewport.height.toString()}`
  );

  // Create the 'defs' element, which is where we'll put shared definitions, gradients, and etc.
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  svg.appendChild(defs);

  const cameraRotationMatrix = camera.matrix.extractRotation();
  const cameraDirection = Vector3(0, 0, 0);
  cameraRotationMatrix.extractBasis(
    Vector3(0, 0, 0),
    Vector3(0, 0, 0),
    cameraDirection
  );

  const allShapes = collectShapes(scene.shapes);

  const allShapePositions = allShapes.map((shape) => {
    return {
      shape,
      position:
        worldTransforms.get(shape.shape)?.getTranslation() || Vector3(0, 0, 0),
    };
  });

  // Sort shapes back to front

  allShapePositions.sort((positionA, positionB) => {
    const a =
      positionA.shape.sortCategory === "background"
        ? -1000
        : cameraDirection.dotProduct(positionA.position);
    const b =
      positionB.shape.sortCategory === "background"
        ? -1000
        : cameraDirection.dotProduct(positionB.position);

    return a - b;
  });

  // For each shape in the scene
  for (let shapePosition of allShapePositions) {
    const shape = shapePosition.shape.shape;
    const worldTransform = worldTransforms.get(shape);
    if (worldTransform === undefined) {
      throw new Error("World transform is undefined");
    }
    switch (shape.type) {
      case "mesh":
        renderMesh(
          scene,
          svg,
          shape,
          viewport,
          worldTransform,
          cameraZoom,
          inverseAndProjectionMatrix,
          camera
        );
        break;
      case "sphere":
        renderSphere(
          scene,
          svg,
          defs,
          shape,
          viewport,
          camera,
          worldTransform,
          cameraZoom,
          inverseCameraMatrix,
          inverseAndProjectionMatrix
        );
        break;
      case "cylinder":
        renderCylinder(
          scene,
          svg,
          defs,
          shape,
          viewport,
          camera,
          worldTransform,
          cameraZoom,
          cameraDirection,
          inverseCameraMatrix,
          inverseAndProjectionMatrix
        );
        break;
      case "text":
        renderText(
          scene,
          svg,
          defs,
          shape,
          viewport,
          camera,
          worldTransform,
          cameraZoom,
          cameraDirection,
          inverseCameraMatrix,
          inverseAndProjectionMatrix
        );
        break;
      case "svg":
        renderSvg(
          scene,
          svg,
          defs,
          shape,
          viewport,
          camera,
          worldTransform,
          cameraZoom,
          cameraDirection,
          inverseCameraMatrix,
          inverseAndProjectionMatrix
        );
        break;
      case "arrow":
        renderArrow(
          scene,
          svg,
          defs,
          shape,
          viewport,
          worldTransform,
          cameraZoom,
          cameraDirection,
          inverseCameraMatrix,
          inverseAndProjectionMatrix
        );
        break;
      default:
        throw new Error(`Unknown shape type: ${(shape as Shape).type}`);
    }
  }

  // @ts-ignore
  svg.debugQueue?.forEach((element) => {
    svg.appendChild(element);
  });

  container.appendChild(svg);
}

function generateWorldTransforms(
  shapes: Shape[],
  parentMatrix: Matrix4x4 | undefined = undefined,
  map: Map<Shape, Matrix4x4> | undefined = undefined
): Map<Shape, Matrix4x4> {
  map = map || new Map<Shape, Matrix4x4>();
  parentMatrix = parentMatrix || Matrix4x4();

  for (let shape of shapes) {
    const shapeMatrix = transformToMatrix(shape);
    // If it's a group, apply the parent's transform to it, and then recurse into its children
    if (shape.type === "group" || shape.type === "grid") {
      const worldMatrix = shapeMatrix.clone().premultiply(parentMatrix);
      // const worldMatrix = shapeMatrix.clone().multiply(parentMatrix);
      generateWorldTransforms(shape.children, worldMatrix, map);
    }
    // If it's a shape, apply the parent's transform to it
    else {
      const worldMatrix = shapeMatrix.clone().premultiply(parentMatrix);
      // const worldMatrix = shapeMatrix.clone().multiply(parentMatrix);
      map.set(shape, worldMatrix);
    }
  }

  return map;
}

function collectShapes(
  shapes: Shape[],
  list: { shape: Shape; sortCategory: "background" | "default" }[] = [],
  sortCategory: "background" | "default" = "default"
) {
  for (let shape of shapes) {
    const isBackground =
      sortCategory === "background" ||
      shape.id === "background" ||
      shape.type === "grid";
    if (shape.type === "group" || shape.type === "grid") {
      collectShapes(
        shape.children,
        list,
        isBackground ? "background" : "default"
      );
    } else {
      list.push({
        shape,
        sortCategory: isBackground ? "background" : "default",
      });
    }
  }

  return list;
}

function transformToMatrix(transform: TransformProperties) {
  const translateMatrix = Matrix4x4().makeTranslation(
    transform.position.x,
    transform.position.y,
    transform.position.z
  );
  const scaleMatrix = Matrix4x4().makeScale(
    transform.scale,
    transform.scale,
    transform.scale
  );
  const rotationXMatrix = Matrix4x4().makeRotationX(
    (transform.rotation.x / 180) * Math.PI
  );
  const rotationYMatrix = Matrix4x4().makeRotationY(
    (transform.rotation.y / 180) * Math.PI
  );
  const rotationZMatrix = Matrix4x4().makeRotationZ(
    (transform.rotation.z / 180) * Math.PI
  );

  const transformMatrix =
    // rotationYMatrix
    //   .premultiply(rotationXMatrix)
    //   .premultiply(rotationZMatrix)
    //   .premultiply(scaleMatrix)
    //   .premultiply(translateMatrix);
    translateMatrix
      .multiply(scaleMatrix)
      .multiply(rotationZMatrix)
      .multiply(rotationYMatrix)
      .multiply(rotationXMatrix);

  // const transformMatrix = rotationYMatrix
  //   .multiply(rotationXMatrix)
  //   .multiply(rotationZMatrix)
  //   .multiply(scaleMatrix)
  //   .multiply(translateMatrix);

  return transformMatrix;
}

function renderMesh(
  scene: Scene,
  svg: SVGElement,
  shape: MeshShape,
  viewport: Viewport,
  worldTransform: Matrix4x4,
  cameraZoom: number,
  inverseAndProjectionMatrix: Matrix4x4,
  camera: Camera
) {
  const xAxis = Vector3(0, 0, 0);
  const yAxis = Vector3(0, 0, 0);
  const zAxis = Vector3(0, 0, 0);
  camera.matrix.extractBasis(xAxis, yAxis, zAxis);
  const shapeInverseRotationMatrix = worldTransform.extractRotation().invert();

  const cameraDirectionInShapeSpaceAndInverted = zAxis.clone();
  shapeInverseRotationMatrix.applyToVector3(
    cameraDirectionInShapeSpaceAndInverted
  );

  const directionalLightInShapeSpaceAndInverted =
    scene.directionalLight.direction.clone().multiply(-1);
  shapeInverseRotationMatrix.applyToVector3(
    directionalLightInShapeSpaceAndInverted
  );

  // Transform the shape's mesh's points to screen space
  const vertices = shape.mesh.vertices.map((vertex) => {
    vertex = vertex.clone();
    worldTransform.applyToVector3(vertex);
    // return point3DToIsometric(vertex.x, vertex.y, vertex.z, viewport);

    return projectToScreenCoordinate(
      vertex,
      inverseAndProjectionMatrix,
      viewport
    );
  });

  // Figure out bounding box and wrap shape in a group
  let left = Infinity;
  let right = -Infinity;
  let top = -Infinity;
  let bottom = -Infinity;

  vertices.forEach((vertex) => {
    left = Math.min(left, vertex.x);
    right = Math.max(right, vertex.x);
    top = Math.max(top, vertex.y);
    bottom = Math.min(bottom, vertex.y);
  });

  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${left},${top})`);
  g.id = shape.id;

  if (shape.onPointerDown) {
    g.addEventListener("pointerdown", (event) => {
      const { start, direction } = pointerToWorldStartDirection(
        viewport,
        camera,
        event.clientX,
        event.clientY
      );

      shape.onPointerDown?.(shape, event, start, direction);
    });
  }

  if (shape.onPointerMove) {
    g.addEventListener("pointermove", (event) => {
      const { start, direction } = pointerToWorldStartDirection(
        viewport,
        camera,
        event.clientX,
        event.clientY
      );
      shape.onPointerMove?.(shape, event, start, direction);
    });
  }

  if (shape.onPointerUp) {
    g.addEventListener("pointerup", (event) => {
      if (shape.onPointerUp) {
        shape.onPointerUp(shape, event);
      }
    });
  }

  const shapeSpaceCameraDirection = zAxis.clone();

  worldTransform.clone().invert().applyToVector3(shapeSpaceCameraDirection);

  // Render each face of the shape
  // TODO: Add in backface culling
  for (let face of shape.mesh.faces) {
    const cameraFaceDot = cameraDirectionInShapeSpaceAndInverted.dotProduct(
      face.normal
    );
    if (cameraFaceDot < 0) continue;

    let points = "";
    // A face
    face.indices.forEach((index) => {
      points += `${vertices[index].x - left},${vertices[index].y - top} `;
    });

    const polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );

    polygon.setAttribute("points", points);

    const brightness = directionalLightInShapeSpaceAndInverted.dotProduct(
      face.normal
    );

    const fill = ColorToCSS(
      applyLighting(
        scene.directionalLight.color,
        shape.fill,
        scene.ambientLightColor,
        brightness
      )
    );

    polygon.setAttribute("fill", fill);

    // polygon.setAttribute("stroke-linecap", "round");
    polygon.setAttribute("stroke-linejoin", "round");

    if (shape.strokeWidth > 0 && shape.stroke.a > 0) {
      polygon.setAttribute("stroke", ColorToCSS(shape.stroke));
      polygon.setAttribute(
        "stroke-width",
        (shape.strokeWidth * cameraZoom).toString()
      );
    } else {
      polygon.setAttribute("stroke", fill);
      polygon.setAttribute(
        "stroke-width",
        (CrackFillingStrokeWidth * cameraZoom).toString()
      );
    }

    //   console.log(face.normal);
    //   console.log(brightness);

    //   svg.style.filter = `brightness(${brightness})`;

    g.appendChild(polygon);
    svg.appendChild(g);
  }
}
