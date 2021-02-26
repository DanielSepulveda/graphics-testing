import * as React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import DatGui, {
  DatBoolean,
  DatNumber,
  DatButton,
} from "@tim-soft/react-dat-gui";

// import Stats from "three/examples/jsm/libs/stats.module";

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

// const stats = Stats();
// stats.showPanel(0);
// document.body.appendChild(stats.dom);

const renderLoop = () => {
  // stats.begin();
  renderer.render(scene, camera);
  updateScene();
  // stats.end();
  // stats.update();
  requestAnimationFrame(renderLoop);
};

const updateScene = () => {
  // mesh.rotation.y = mesh.rotation.y + (1 * Math.PI) / 180;
  cameraControls.update();
};

const handleResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

const radiansToDegrees = (radians: number) => {
  return (radians * 180) / Math.PI;
};

const degreesToRadians = (degrees: number) => {
  return (degrees * Math.PI) / 180;
};

const initialGuiData = {
  xPosition: mesh.position.x,
  yRotation: radiansToDegrees(mesh.rotation.y),
  wireframe: (mesh.material as THREE.MeshBasicMaterial).wireframe,
};

function DatGuiDemo() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [guiData, setGuiData] = React.useState(initialGuiData);

  React.useEffect(() => {
    ref.current?.appendChild(renderer.domElement);
    renderer.render(scene, camera);
  }, []);

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    renderLoop();
  }, []);

  React.useEffect(() => {
    material.wireframe = guiData.wireframe;
  }, [guiData.wireframe]);

  React.useEffect(() => {
    mesh.position.x = guiData.xPosition;
  }, [guiData.xPosition]);

  React.useEffect(() => {
    mesh.rotation.y = degreesToRadians(guiData.yRotation);
  }, [guiData.yRotation]);

  const handleGuiUpdate = React.useCallback((newData) => {
    setGuiData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  }, []);

  const handleHomeOnClick = React.useCallback(() => {
    setGuiData(initialGuiData);
  }, []);

  return (
    <div>
      <DatGui data={guiData} onUpdate={handleGuiUpdate}>
        <DatNumber path="xPosition" label="X" min={-5} max={5} step={0.5} />
        <DatNumber path="yRotation" label="Y" min={-180} max={180} step={5} />
        <DatBoolean path="wireframe" label="Wireframe" />
        <DatButton label="Home" onClick={handleHomeOnClick} />
      </DatGui>
      <div ref={ref} />
    </div>
  );
}

export default DatGuiDemo;
