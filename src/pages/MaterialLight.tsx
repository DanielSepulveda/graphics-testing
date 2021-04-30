import * as React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import tweakpane from "tweakpane";
import "react-dat-gui/dist/index.css";
import { cloneDeep as _clone } from "lodash";
import { CanvasLayout } from "../components";
import { scaleRGB } from "../utils/helpers";

class Floor extends THREE.Mesh {
  constructor() {
    super();
    this.geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
    this.material = new THREE.MeshBasicMaterial();
    this.rotation.x = -0.5 * Math.PI;
    (this as any).wireframeHelper = new THREE.LineSegments(
      new THREE.WireframeGeometry(this.geometry)
    );
    (this as any).wireframeHelper.material.color = new THREE.Color(
      0.2,
      0.2,
      0.2
    );
    this.add((this as any).wireframeHelper);
    this.visible = false;
  }
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x444444);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setClearColor(new THREE.Color(0.2, 0.2, 0.35));

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
camera.position.set(2, 2, 5);
const cameraControls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry(1);
// const geometry = new THREE.TorusKnotGeometry(10, 3, 200, 32).toNonIndexed();
const material = new THREE.MeshPhysicalMaterial({ color: 0x049ef4 });
const box = new THREE.Mesh(geometry, material);
box.position.set(0, 0.5, 0);

/* -------------------------------------------------------------------------- */
/*                                 Point Light                                */
/* -------------------------------------------------------------------------- */

let pointLightColor = "white";
let intensity = 1;
let distance = 0;
let decay = 1;
let pointLight = new THREE.PointLight(
  pointLightColor,
  intensity,
  distance,
  decay
);
pointLight.position.set(0, 2, 0);
let pointLightHelper = new THREE.PointLightHelper(pointLight, 0.1);

let floor = new Floor();

scene.add(box);
scene.add(floor);
scene.add(pointLight);
scene.add(pointLightHelper);

const renderLoop = () => {
  renderer.render(scene, camera);
  updateScene();
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
  boxPositionX: box.position.x,
  boxPositionY: box.position.y,
  boxPositionZ: box.position.z,
  boxColor: { r: 4, g: 158, b: 244 },
  lightPositionX: pointLight.position.x,
  lightPositionY: pointLight.position.y,
  lightPositionZ: pointLight.position.z,
  lightColor: { r: 255, g: 255, b: 255 },
  showFloor: false,
  roughness: 0,
  clearcoat: 0,
  clearcoatRoughness: 0,
  reflectivity: 0,
};

function MaterialLight() {
  const refCanvas = React.useRef<HTMLDivElement>(null);

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
    const PARAMS = _clone(initialGuiData);
    const pane = new tweakpane();

    const boxFolder = pane.addFolder({
      title: "Box",
    });
    boxFolder
      .addInput(PARAMS, "boxPositionX", {
        min: -5,
        max: 5,
        label: "x",
      })
      .on("change", (value) => {
        box.position.x = value;
      });
    boxFolder
      .addInput(PARAMS, "boxPositionY", {
        min: -5,
        max: 5,
        label: "y",
      })
      .on("change", (value) => {
        box.position.y = value;
      });
    boxFolder
      .addInput(PARAMS, "boxPositionZ", {
        min: -5,
        max: 5,
        label: "z",
      })
      .on("change", (value) => {
        box.position.z = value;
      });
    boxFolder
      .addInput(PARAMS, "boxColor", {
        label: "color",
      })
      .on("change", (value) => {
        const newRGB = scaleRGB(value as any, "down");
        material.color = new THREE.Color(newRGB.r, newRGB.g, newRGB.b);
      });
    const materialFolder = pane.addFolder({
      title: "Material",
    });
    materialFolder
      .addInput(PARAMS, "roughness", {
        min: 0,
        max: 1,
      })
      .on("change", (value) => {
        material.roughness = value;
      });
    materialFolder
      .addInput(PARAMS, "clearcoat", {
        min: 0,
        max: 1,
      })
      .on("change", (value) => {
        material.clearcoat = value;
      });
    materialFolder
      .addInput(PARAMS, "clearcoatRoughness", {
        min: 0,
        max: 1,
      })
      .on("change", (value) => {
        material.clearcoatRoughness = value;
      });
    materialFolder
      .addInput(PARAMS, "reflectivity", {
        min: 0,
        max: 1,
      })
      .on("change", (value) => {
        material.reflectivity = value;
      });

    const lightFolder = pane.addFolder({
      title: "Light",
    });
    lightFolder
      .addInput(PARAMS, "lightPositionX", {
        min: -5,
        max: 5,
        label: "x",
      })
      .on("change", (value) => {
        pointLight.position.x = value;
      });
    lightFolder
      .addInput(PARAMS, "lightPositionY", {
        min: -5,
        max: 5,
        label: "y",
      })
      .on("change", (value) => {
        pointLight.position.y = value;
      });
    lightFolder
      .addInput(PARAMS, "lightPositionZ", {
        min: -5,
        max: 5,
        label: "z",
      })
      .on("change", (value) => {
        pointLight.position.z = value;
      });
    lightFolder
      .addInput(PARAMS, "lightColor", { label: "color" })
      .on("change", (value) => {
        const newRGB = scaleRGB(value as any, "down");
        pointLight.color = new THREE.Color(newRGB.r, newRGB.g, newRGB.b);
      });

    pane.addInput(PARAMS, "showFloor").on("change", (value) => {
      floor.visible = value;
    });

    return () => {
      pane.dispose();
    };
  }, []);

  return (
    <CanvasLayout>
      {/* <ChakraDatGui data={guiData} onUpdate={handleGuiUpdate} top="5rem">
        <DatNumber path="xPosition" label="X" min={-5} max={5} step={0.5} />
      </ChakraDatGui> */}
      <div id="threejs-canvas" ref={refCanvas} />
    </CanvasLayout>
  );
}

export default MaterialLight;
