import * as React from "react";
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import DatGui, { DatButton } from "react-dat-gui";
import { chakra } from "@chakra-ui/react";
import "react-dat-gui/dist/index.css";
import { CanvasLayout } from "../components";
import { degreesToRadians } from "../utils/helpers";

const ChakraDatGui = chakra(DatGui);

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0.2, 0.2, 0.35));

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
camera.position.set(0, 0, 3);

// MODELS
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
  color: "white",
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);

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

let currentAngle = 0;
let canRotate = false;

const updateScene = () => {
  if (canRotate) {
    currentAngle += 0.5;

    if (currentAngle === 360) currentAngle = 0;

    const x = 3 * Math.sin(degreesToRadians(currentAngle));
    const z = 3 * Math.cos(degreesToRadians(currentAngle));

    camera.position.set(x, 0, z);
    camera.lookAt(mesh.position);
  }
};

const handleResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

const initialGuiData = {
  frontView: true,
  topView: false,
  sideView: false,
};

type GuiData = typeof initialGuiData;

function OrbitCamera() {
  const refCanvas = React.useRef<HTMLDivElement>(null);
  const refStats = React.useRef<HTMLDivElement>(null);

  const [guiData, setGuiData] = React.useState(initialGuiData);

  /**
   * Initial Listeners
   */

  React.useEffect(() => {
    const canvasNode = refCanvas.current;
    const statsNode = refStats.current;

    canvasNode?.appendChild(renderer.domElement);
    statsNode?.appendChild(stats.dom);
    renderer.render(scene, camera);

    return () => {
      canvasNode?.removeChild(renderer.domElement);
      statsNode?.removeChild(stats.dom);
    };
  }, []);

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    renderLoop();
  }, []);

  /**
   * GUI Handlers
   */

  const handleGuiUpdate = React.useCallback((newData: GuiData) => {
    setGuiData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  }, []);

  const onPlay = React.useCallback(() => {
    canRotate = true;
  }, []);

  const onStop = React.useCallback(() => {
    canRotate = false;
  }, []);

  const onReset = React.useCallback(() => {
    canRotate = false;
    currentAngle = 0;
    camera.position.set(0, 0, 3);
    camera.lookAt(mesh.position);
  }, []);

  return (
    <CanvasLayout>
      <ChakraDatGui data={guiData} onUpdate={handleGuiUpdate} top="5rem">
        <DatButton label="Play" onClick={onPlay} />
        <DatButton label="Stop" onClick={onStop} />
        <DatButton label="Reset" onClick={onReset} />
      </ChakraDatGui>
      <div id="threejs-stats" ref={refStats} />
      <div id="threejs-canvas" ref={refCanvas} />
    </CanvasLayout>
  );
}

export default OrbitCamera;
