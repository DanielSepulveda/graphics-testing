import * as React from "react";
import * as THREE from "three";

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
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

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial();
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

function Basic() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    ref.current?.appendChild(renderer.domElement);
    renderer.render(scene, camera);
  }, []);

  return <div ref={ref} />;
}

export default Basic;
