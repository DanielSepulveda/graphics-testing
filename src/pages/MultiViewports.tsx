import * as React from "react";
import * as THREE from "three";
import { CanvasLayout } from "../components";

const scene = new THREE.Scene();
let multiviewState: "1" | "4" = "1";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0.2, 0.2, 0.35));
renderer.setScissorTest(true);

// camera 1
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
camera.position.set(1, 1, 3);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// camera 2
const camera2Aspect = window.innerWidth / 2 / window.innerHeight / 2;
const camera2 = new THREE.PerspectiveCamera(
  cameraConfig.fov,
  camera2Aspect,
  cameraConfig.near,
  cameraConfig.far
);
camera2.position.set(0, 3, 0);
camera2.lookAt(new THREE.Vector3(0, 0, 0));
camera2.up.set(0, 0, 1);

// camera 3
const camera3Aspect = window.innerWidth / 2 / window.innerHeight / 2;
const camera3 = new THREE.PerspectiveCamera(
  cameraConfig.fov,
  camera3Aspect,
  cameraConfig.near,
  cameraConfig.far
);
camera3.position.set(0, 0, 3);
camera3.lookAt(new THREE.Vector3(0, 0, 0));
camera3.up.set(0, 1, 0);

// camera 4
const camera4Aspect = window.innerWidth / 2 / window.innerHeight / 2;
const camera4 = new THREE.PerspectiveCamera(
  cameraConfig.fov,
  camera4Aspect,
  cameraConfig.near,
  cameraConfig.far
);
camera4.position.set(3, 0, 0);
camera4.lookAt(new THREE.Vector3(0, 0, 0));
camera4.up.set(0, 1, 0);

const sphere = new THREE.ConeBufferGeometry();
const material = new THREE.MeshBasicMaterial({
  color: "white",
  wireframe: true,
});
const mesh = new THREE.Mesh(sphere, material);

scene.add(mesh);

const renderLoop = () => {
  if (multiviewState === "1") {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  } else {
    // camera 1
    camera.aspect = window.innerWidth / 2 / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setViewport(
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    renderer.setScissor(
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    renderer.render(scene, camera);

    // camera 2
    camera2.aspect = window.innerWidth / 2 / window.innerHeight;
    camera2.updateProjectionMatrix();
    renderer.setViewport(
      0,
      window.innerHeight / 2,
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    renderer.setScissor(
      0,
      window.innerHeight / 2,
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    renderer.render(scene, camera2);

    // camera 3
    camera3.aspect = window.innerWidth / 2 / window.innerHeight;
    camera3.updateProjectionMatrix();
    renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight / 2);
    renderer.setScissor(0, 0, window.innerWidth / 2, window.innerHeight / 2);
    renderer.render(scene, camera3);

    // camera 4
    camera4.aspect = window.innerWidth / 2 / window.innerHeight;
    camera4.updateProjectionMatrix();
    renderer.setViewport(
      window.innerWidth / 2,
      0,
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    renderer.setScissor(
      window.innerWidth / 2,
      0,
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    renderer.render(scene, camera4);
  }

  requestAnimationFrame(renderLoop);
};

const handleResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

const handleKeyDown = (ev: KeyboardEvent) => {
  if (ev.key === " ") {
    if (multiviewState === "1") multiviewState = "4";
    else multiviewState = "1";
  }
};

function Basic() {
  const ref = React.useRef<HTMLDivElement>(null);

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
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <CanvasLayout>
      <div ref={ref} />
    </CanvasLayout>
  );
}

export default Basic;
