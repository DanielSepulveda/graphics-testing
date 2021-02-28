import * as React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import tweakpane from "tweakpane";
import { cloneDeep as _clone } from "lodash";
import { radiansToDegrees } from "../utils/helpers";
import { Layout } from "../components";

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const backgroundColor = { r: 0.2, g: 0.2, b: 0.35 };
renderer.setClearColor(
  new THREE.Color(backgroundColor.r, backgroundColor.g, backgroundColor.b)
);

const cameraConfig = {
  fov: 60,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 10_000,
};

const camera = new THREE.PerspectiveCamera(
  cameraConfig.fov,
  cameraConfig.aspect,
  cameraConfig.near,
  cameraConfig.far
);
const initCameraPos = { x: 0, y: 0, z: 3 };
camera.position.set(initCameraPos.x, initCameraPos.y, initCameraPos.z);
const cameraControls = new OrbitControls(camera, renderer.domElement);

// const box = new THREE.BoxGeometry();
const sphere = new THREE.SphereBufferGeometry(1);
const material = new THREE.MeshBasicMaterial({
  color: "white",
  wireframe: true,
});
const mesh = new THREE.Mesh(sphere, material);

scene.add(mesh);

const stats = Stats();
stats.showPanel(0);
stats.domElement.style.cssText =
  "position:fixed;top:5rem;left:16px;cursor:pointer;opacity:0.9;z-index:10000";

const renderLoop = () => {
  stats.begin();
  renderer.render(scene, camera);
  updateScene();
  stats.end();
  stats.update();
  requestAnimationFrame(renderLoop);
};

const updateScene = () => {
  cameraControls.update();
};

const handleResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

const scaleRGB = (
  rgb: { r: number; g: number; b: number },
  scale: "up" | "down" = "up"
) => {
  if (scale === "up") {
    return {
      r: rgb.r * 255,
      g: rgb.g * 255,
      b: rgb.b * 255,
    };
  }
  return {
    r: rgb.r / 255,
    g: rgb.g / 255,
    b: rgb.b / 255,
  };
};

const initialGuiData = {
  xPosition: mesh.position.x,
  yRotation: radiansToDegrees(mesh.rotation.y),
  wireframe: (mesh.material as THREE.MeshBasicMaterial).wireframe,
  showStats: false,
  backgroundColor: scaleRGB(backgroundColor),
  camera: initCameraPos,
};

function DatGuiDemo() {
  const refCanvas = React.useRef<HTMLDivElement>(null);
  const refStats = React.useRef<HTMLDivElement>(null);

  /**
   * Canvas
   */

  // Render Canvas
  React.useEffect(() => {
    const canvasNode = refCanvas.current;

    canvasNode?.appendChild(renderer.domElement);
    renderer.render(scene, camera);

    return () => {
      canvasNode?.removeChild(renderer.domElement);
    };
  }, []);

  // Resize Canvas
  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update Canvas
  React.useEffect(() => {
    renderLoop();
  }, []);

  /**
   * GUI Handlers
   */

  React.useEffect(() => {
    const PARAMS = _clone(initialGuiData);
    const pane = new tweakpane();

    pane.addInput(PARAMS, "wireframe").on("change", (value) => {
      material.wireframe = value;
    });

    const statsNode = refStats.current;
    pane.addInput(PARAMS, "showStats").on("change", (value) => {
      if (value) {
        statsNode?.appendChild(stats.dom);
      } else {
        statsNode?.removeChild(stats.dom);
      }
    });

    pane.addInput(PARAMS, "backgroundColor").on("change", (value) => {
      const newRGB = scaleRGB(value, "down");
      renderer.setClearColor(new THREE.Color(newRGB.r, newRGB.g, newRGB.b));
    });

    const movementFolder = pane.addFolder({
      title: "Movement",
    });
    movementFolder
      .addInput(PARAMS, "xPosition", {
        min: -5,
        max: 5,
      })
      .on("change", (value) => {
        mesh.position.x = value;
      });
    movementFolder
      .addInput(PARAMS, "yRotation", {
        min: -180,
        max: 180,
      })
      .on("change", (value) => {
        mesh.rotation.y = value;
      });

    pane.addSeparator();
    pane
      .addButton({
        title: "Reset",
      })
      .on("click", () => {
        pane.importPreset(_clone(initialGuiData));
      });

    return () => {
      pane.dispose();
      if (PARAMS.showStats) {
        statsNode?.removeChild(stats.dom);
      }
    };
  }, []);

  return (
    <Layout>
      <div id="threejs-stats" ref={refStats} />
      <div id="threejs-canvas" ref={refCanvas} />
    </Layout>
  );
}

export default DatGuiDemo;
