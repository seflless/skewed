import Reconciler from "react-reconciler";
import type {
  Camera,
  Color,
  DirectionalLight,
  Scene,
  Shape,
  Viewport,
} from "../../core";
import {
  Box as CoreBox,
  Camera as CoreCamera,
  Cylinder as CoreCylinder,
  Color as CoreColor,
  DefaultBasicShapeProperties,
  DirectionalLight as CoreDirectionalLight,
  Html as CoreHtml,
  Grid as CoreGrid,
  Group as CoreGroup,
  render as coreRender,
  Sphere as CoreSphere,
  Text as CoreText,
  Vector3,
} from "../../core";
import { createRoot, Root as ReactDomRoot } from "react-dom/client";
import {
  TYPE_AMBIENT_LIGHT,
  TYPE_BOX,
  TYPE_CYLINDER,
  TYPE_DIRECTIONAL_LIGHT,
  TYPE_GRID,
  TYPE_GROUP,
  TYPE_HTML,
  TYPE_MESH,
  TYPE_SPHERE,
  TYPE_TEXT,
} from "../intrinsics";

type Props = Record<string, any>;

type InstanceNode = {
  type: string;
  props: Props;
  children: InstanceNode[];
  __internalId?: string;
  __domRoot?: ReactDomRoot;
};

let __htmlInstanceId = 0;

export type SkewedHostContainer = {
  dom: HTMLElement;
  camera: Camera;
  viewport: Viewport;
  children: InstanceNode[];
};

function defaultDirectionalLight(): DirectionalLight {
  return CoreDirectionalLight({
    direction: Vector3(-0.25, -1, -0.25).normalize(),
    color: CoreColor(255, 252, 255),
  });
}

function defaultAmbientLightColor(): Color {
  return CoreColor(64, 64, 64);
}

function buildScene(container: SkewedHostContainer): Scene {
  let directionalLight = defaultDirectionalLight();
  let ambientLightColor = defaultAmbientLightColor();
  const shapes: Shape[] = [];

  const visit = (node: InstanceNode): void => {
    switch (node.type) {
      case TYPE_DIRECTIONAL_LIGHT:
        directionalLight = CoreDirectionalLight(node.props);
        return;
      case TYPE_AMBIENT_LIGHT:
        ambientLightColor = node.props.color;
        return;
      default:
        break;
    }

    const shape = nodeToShape(node);
    if (shape) shapes.push(shape);
  };

  container.children.forEach(visit);

  return { directionalLight, ambientLightColor, shapes };
}

function nodeToShape(node: InstanceNode): Shape | null {
  // Groups and grids need children first.
  const childShapes: Shape[] = [];
  node.children.forEach((child) => {
    const s = nodeToShape(child);
    if (s) childShapes.push(s);
  });

  switch (node.type) {
    case TYPE_BOX:
      return CoreBox(node.props);
    case TYPE_SPHERE:
      return CoreSphere(node.props);
    case TYPE_CYLINDER:
      return CoreCylinder(node.props);
    case TYPE_TEXT:
      return CoreText(node.props);
    case TYPE_MESH:
      // Ensure mesh shapes always have full transform + material defaults.
      // Without this, missing props like `scale`/`position` can propagate as NaN
      // into the renderer.
      return {
        type: "mesh",
        ...DefaultBasicShapeProperties(),
        ...node.props,
      } as any;
    case TYPE_GROUP:
      return CoreGroup({ ...node.props, children: childShapes });
    case TYPE_GRID:
      return CoreGrid(node.props);
    case TYPE_HTML: {
      const id = node.props.id || node.__internalId || "";
      const props: any = { id };
      if (node.props.position) props.position = node.props.position;
      if (node.props.rotation) props.rotation = node.props.rotation;
      if (typeof node.props.scale === "number") props.scale = node.props.scale;
      if (typeof node.props.width === "number") props.width = node.props.width;
      if (typeof node.props.height === "number")
        props.height = node.props.height;
      return CoreHtml(props);
    }
    default:
      return null;
  }
}

function escapeAttrValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\"/g, '\\"');
}

function collectHtmlNodes(nodes: InstanceNode[], out: InstanceNode[] = []) {
  for (const n of nodes) {
    if (n.type === TYPE_HTML) out.push(n);
    if (n.children && n.children.length) collectHtmlNodes(n.children, out);
  }
  return out;
}

const hostConfig: any = {
  now: Date.now,
  supportsMutation: true,
  isPrimaryRenderer: true,
  detachDeletedInstance(instance: InstanceNode) {
    // Important: unmounting nested ReactDOM roots synchronously during the custom
    // renderer commit can trigger React re-entrancy warnings. Always defer.
    if (instance.type === TYPE_HTML && instance.__domRoot) {
      const root = instance.__domRoot;
      instance.__domRoot = undefined;
      setTimeout(() => {
        try {
          root.unmount();
        } catch {
          // ignore
        }
      }, 0);
    }
  },

  getRootHostContext() {
    return null;
  },
  getChildHostContext() {
    return null;
  },

  createInstance(type: string, props: Props) {
    const node: InstanceNode = { type, props, children: [] };
    if (type === TYPE_HTML) {
      __htmlInstanceId += 1;
      node.__internalId = `sk-html-${__htmlInstanceId}`;
    }
    return node;
  },

  createTextInstance(text: string) {
    return { type: "text", props: { text }, children: [] } as InstanceNode;
  },

  appendInitialChild(parent: InstanceNode, child: InstanceNode) {
    parent.children.push(child);
  },

  appendChild(parent: InstanceNode, child: InstanceNode) {
    parent.children.push(child);
  },

  appendChildToContainer(container: SkewedHostContainer, child: InstanceNode) {
    container.children.push(child);
  },

  insertBefore(
    parent: InstanceNode,
    child: InstanceNode,
    beforeChild: InstanceNode,
  ) {
    const beforeIndex = parent.children.indexOf(beforeChild);
    if (beforeIndex === -1) {
      parent.children.push(child);
      return;
    }
    parent.children.splice(beforeIndex, 0, child);
  },

  insertInContainerBefore(
    container: SkewedHostContainer,
    child: InstanceNode,
    beforeChild: InstanceNode,
  ) {
    const beforeIndex = container.children.indexOf(beforeChild);
    if (beforeIndex === -1) {
      container.children.push(child);
      return;
    }
    container.children.splice(beforeIndex, 0, child);
  },

  removeChild(parent: InstanceNode, child: InstanceNode) {
    const idx = parent.children.indexOf(child);
    if (idx >= 0) parent.children.splice(idx, 1);
  },

  removeChildFromContainer(
    container: SkewedHostContainer,
    child: InstanceNode,
  ) {
    const idx = container.children.indexOf(child);
    if (idx >= 0) container.children.splice(idx, 1);
  },

  finalizeInitialChildren() {
    return false;
  },

  prepareUpdate() {
    return true;
  },

  commitUpdate(
    instance: InstanceNode,
    _updatePayload: any,
    _type: string,
    _oldProps: Props,
    newProps: Props,
  ) {
    instance.props = newProps;
  },

  commitTextUpdate(
    textInstance: InstanceNode,
    _oldText: string,
    newText: string,
  ) {
    textInstance.props.text = newText;
  },

  shouldSetTextContent() {
    return false;
  },

  clearContainer(container: SkewedHostContainer) {
    container.children = [];
  },

  prepareForCommit() {
    return null;
  },

  resetAfterCommit(container: SkewedHostContainer) {
    const scene = buildScene(container);
    coreRender(container.dom, scene, container.viewport, container.camera);

    // Render nested React DOM subtrees into <foreignObject> containers.
    // This MUST be scheduled asynchronously; rendering a ReactDOM subtree
    // synchronously from within the custom renderer commit can trigger
    // React re-entrancy errors ("Should not already be working.").
    const htmlNodes = collectHtmlNodes(container.children);
    if (!htmlNodes.length) return;

    setTimeout(() => {
      const svg = container.dom.querySelector("svg#scene");
      if (!svg) return;

      for (const n of htmlNodes) {
        const id = n.props.id || n.__internalId;
        if (!id) continue;
        const fo = svg.querySelector(
          `foreignObject[data-skewed-html-id="${escapeAttrValue(id)}"]`,
        ) as SVGForeignObjectElement | null;
        if (!fo) continue;
        const mount = fo.querySelector(
          `[data-skewed-html-container="true"]`,
        ) as HTMLElement | null;
        if (!mount) continue;

        if (!n.__domRoot) {
          n.__domRoot = createRoot(mount);
        }
        n.__domRoot.render(n.props.__htmlChildren || null);
      }
    }, 0);
  },

  getPublicInstance(instance: InstanceNode) {
    return instance;
  },
};

const SkewedReconciler = Reconciler(hostConfig);

export type SkewedReconcilerRoot = ReturnType<
  typeof SkewedReconciler.createContainer
>;

export function createSkewedContainer(
  dom: HTMLElement,
  camera?: Camera,
  viewport?: Viewport,
) {
  const hostContainer: SkewedHostContainer = {
    dom,
    camera: camera || CoreCamera(),
    viewport: viewport || { left: 0, top: 0, width: 800, height: 600 },
    children: [],
  };

  const root = SkewedReconciler.createContainer(
    hostContainer,
    0, // LegacyRoot
    null, // hydrationCallbacks
    false, // isStrictMode
    null, // concurrentUpdatesByDefaultOverride
    "", // identifierPrefix
    (error: unknown) => {
      // Keep default behavior simple; consumers can wrap errors at the component level.
      console.error(error);
    },
    null, // transitionCallbacks
  );
  return { root, hostContainer, reconciler: SkewedReconciler };
}
