import * as React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import DatGui, { DatBoolean, DatNumber, DatButton } from "react-dat-gui";
import { chakra } from "@chakra-ui/react";
import "react-dat-gui/dist/index.css";
import { degreesToRadians, radiansToDegrees } from "../utils/helpers";
import { CanvasLayout } from "../components";

const ChakraDatGui = chakra(DatGui);

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
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
const cameraControls = new OrbitControls(camera, renderer.domElement);

// const box = new THREE.BoxGeometry();
const sphere = new THREE.SphereGeometry(1);
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

const initialGuiData = {
  xPosition: mesh.position.x,
  yRotation: radiansToDegrees(mesh.rotation.y),
  wireframe: (mesh.material as THREE.MeshBasicMaterial).wireframe,
  showStats: false,
};

type GuiData = typeof initialGuiData;

function DatGuiDemo() {
  const refCanvas = React.useRef<HTMLDivElement>(null);
  const refStats = React.useRef<HTMLDivElement>(null);
  const prevShowStats = React.useRef(initialGuiData.showStats);

  const [guiData, setGuiData] = React.useState(initialGuiData);

  /**
   * Initial Listeners
   */

  React.useEffect(() => {
    const canvasNode = refCanvas.current;

    canvasNode?.appendChild(renderer.domElement);
    renderer.render(scene, camera);

    return () => {
      canvasNode?.removeChild(renderer.domElement);
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

  React.useEffect(() => {
    material.wireframe = guiData.wireframe;
  }, [guiData.wireframe]);

  React.useEffect(() => {
    mesh.position.x = guiData.xPosition;
  }, [guiData.xPosition]);

  React.useEffect(() => {
    mesh.rotation.y = degreesToRadians(guiData.yRotation);
  }, [guiData.yRotation]);

  React.useEffect(() => {
    const prevValue = prevShowStats.current;
    const statsNode = refStats.current;
    // Check that value was toggled
    if (guiData.showStats !== prevValue) {
      if (guiData.showStats) {
        statsNode?.appendChild(stats.dom);
      } else {
        statsNode?.removeChild(stats.dom);
      }
      prevShowStats.current = guiData.showStats;
    }
  }, [guiData.showStats]);

  const handleGuiUpdate = React.useCallback((newData: GuiData) => {
    setGuiData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  }, []);

  const handleReset = React.useCallback(() => {
    setGuiData(initialGuiData);
  }, []);

  return (
    <CanvasLayout>
      <ChakraDatGui data={guiData} onUpdate={handleGuiUpdate} top="5rem">
        <DatNumber path="xPosition" label="X" min={-5} max={5} step={0.5} />
        <DatNumber path="yRotation" label="Y" min={-180} max={180} step={5} />
        <DatBoolean path="wireframe" label="Wireframe" />
        <DatBoolean path="showStats" label="Stats" />
        <DatButton label="Reset" onClick={handleReset} />
      </ChakraDatGui>
      <div id="threejs-stats" ref={refStats} />
      <div id="threejs-canvas" ref={refCanvas} />
    </CanvasLayout>
  );
}

export default DatGuiDemo;
