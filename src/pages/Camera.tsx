import * as React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import DatGui, { DatButton } from "react-dat-gui";
import { chakra } from "@chakra-ui/react";
import "react-dat-gui/dist/index.css";
import { CanvasLayout } from "../components";

const ChakraDatGui = chakra(DatGui);

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

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

// MODELS
const geometry = new THREE.ConeGeometry();
const material = new THREE.MeshBasicMaterial({
  color: "yellow",
  wireframe: false,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.name = "Cube";
mesh.position.set(0, 0.5, 0);

// WORLD AXES
const worldAxes = new THREE.AxesHelper(10);

scene.add(mesh);
scene.add(worldAxes);

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
  frontView: true,
  topView: false,
  sideView: false,
};

type GuiData = typeof initialGuiData;

function Camera() {
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

  const onFrontView = React.useCallback(() => {
    camera.position.set(0, 0, 3);
    camera.up = new THREE.Vector3(0, 1, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }, []);

  const onTopView = React.useCallback(() => {
    camera.position.set(0, 3, 0);
    camera.up = new THREE.Vector3(1, 0, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }, []);

  const onSideView = React.useCallback(() => {
    camera.position.set(3, 0, 0);
    camera.up = new THREE.Vector3(0, 1, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }, []);

  return (
    <CanvasLayout>
      <ChakraDatGui data={guiData} onUpdate={handleGuiUpdate} top="5rem">
        <DatButton label="FrontView" onClick={onFrontView} />
        <DatButton label="TopView" onClick={onTopView} />
        <DatButton label="SideView" onClick={onSideView} />
      </ChakraDatGui>
      <div id="threejs-stats" ref={refStats} />
      <div id="threejs-canvas" ref={refCanvas} />
    </CanvasLayout>
  );
}

export default Camera;
