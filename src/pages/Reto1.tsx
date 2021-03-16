import * as React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import tweakpane from "tweakpane";
import { cloneDeep as _clone } from "lodash";
import { degreesToRadians, scaleRGB } from "../utils/helpers";
import { CanvasLayout } from "../components";
import primitiveModels, { PrimitiveModelType } from "../models/primitiveModels";

/* -------------------------------------------------------------------------- */
/*                          Create scene and renderer                         */
/* -------------------------------------------------------------------------- */

let sceneModelsIds: string[] = [];

const removeAllModels = () => {
  sceneModelsIds.forEach((id) => {
    const mesh = scene.getObjectByProperty("uuid", id) as
      | THREE.Mesh
      | undefined;
    if (mesh) {
      (mesh.material as THREE.MeshBasicMaterial).dispose();
      mesh.geometry.dispose();
      scene.remove(mesh);
    }
  });
  sceneModelsIds = [];
};

  let normal = new THREE.Vector3(0, 1, 0);
  let distanceToPlane = 0.;
  let plane = new THREE.Plane(normal, distanceToPlane);
  let size = 10;
  let color = 808080;
  let planeHelper = new THREE.PlaneHelper(plane, size, color);

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0.2, 0.2, 0.35));

/* -------------------------------------------------------------------------- */
/*                                Camara config                               */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                               Raycast config                               */
/* -------------------------------------------------------------------------- */

let activeMesh: THREE.Mesh | null = null;
let activeMeshCopy: THREE.Mesh | null = null;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const onMouseDown = (event: MouseEvent) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    // Get clicked mesh
    const obj = intersects[0].object;
    const clickedMesh = scene.getObjectByProperty("uuid", obj.uuid) as
      | THREE.Mesh
      | undefined;

    // Assert clicked mesh exists
    if (clickedMesh) {
      const clickedNewMesh =
        activeMesh == null || clickedMesh.uuid !== activeMesh.uuid;
      const clickedSameMesh =
        activeMesh != null && activeMesh.uuid === clickedMesh.uuid;

      // Check that clicked on new mesh
      if (clickedNewMesh) {
        // Update active mesh
        activeMesh = clickedMesh;
        activeMeshCopy = activeMesh.clone() as THREE.Mesh;

        // Remove active status if clicks same mesh
      } else if (clickedSameMesh) {
        activeMesh = null;
        activeMeshCopy = null;
      }
    }
  }
};

/* -------------------------------------------------------------------------- */
/*                            Create initial model                            */
/* -------------------------------------------------------------------------- */

const addInitialModel = () => {
  const initModel = primitiveModels.cubo;
  const initGeometry = new THREE.BufferGeometry();
  initGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(initModel.vertices, 3)
  );
  initGeometry.setIndex(initModel.indices);

  const initMaterial = new THREE.MeshBasicMaterial({
    color: "white",
    wireframe: true,
    side: THREE.DoubleSide,
    transparent: true,
  });
  const initMesh = new THREE.Mesh(initGeometry, initMaterial);
  initMesh.name = "Cubo";

  scene.add(initMesh);
  sceneModelsIds.push(initMesh.uuid);
};
addInitialModel();

/* -------------------------------------------------------------------------- */
/*                                Config stats                                */
/* -------------------------------------------------------------------------- */

const stats = Stats();
stats.showPanel(0);
stats.domElement.style.cssText =
  "position:fixed;top:5rem;left:16px;cursor:pointer;opacity:0.9;z-index:10000";

/* -------------------------------------------------------------------------- */
/*                                 Render loop                                */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                                Initial State                               */
/* -------------------------------------------------------------------------- */

type RGB = {
  r: number;
  g: number;
  b: number;
};

type GuiData = {
  model: PrimitiveModelType;
  globalWireframe: boolean;
  globalShowStats: boolean;
  globalPlane: boolean
  globalColor: RGB;
  selectedPosX: number;
  selectedPosY: number;
  selectedPosZ: number;
  selectedRotX: number;
  selectedRotY: number;
  selectedRotZ: number;
  selectedColor: RGB;
  selectedOpacity: number;
};

const initialGuiData: GuiData = {
  model: "cubo",
  globalPlane: false,
  globalWireframe: true,
  globalShowStats: false,
  globalColor: scaleRGB({ r: 0.2, g: 0.2, b: 0.35 }),
  selectedPosX: 0,
  selectedPosY: 0,
  selectedPosZ: 0,
  selectedRotX: 0,
  selectedRotY: 0,
  selectedRotZ: 0,
  selectedColor: { r: 0, g: 0, b: 0 },
  selectedOpacity: 1,
};

const _modelSelectValues: PrimitiveModelType[] = [
  "casa",
  "cubo",
  "doblePiramide",
  "estrella",
  "piramide",
  "piramideTrapezoidal",
  "rectangulo",
  "romboide",
  "trapezoide",
  "triangulo",
];
const modelSelectValues = _modelSelectValues.reduce((obj, val) => {
  const newObj = { ...obj, [val]: val };
  return newObj;
}, {} as Record<PrimitiveModelType, PrimitiveModelType>);

function Reto1() {
  const refCanvas = React.useRef<HTMLDivElement>(null);
  const refStats = React.useRef<HTMLDivElement>(null);

  /**
   * Initial Listeners
   */

  React.useEffect(() => {
    const canvasNode = refCanvas.current;

    canvasNode?.appendChild(renderer.domElement);
    renderer.render(scene, camera);

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointerdown", onMouseDown, false);

    renderLoop();

    return () => {
      canvasNode?.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  /**
   * GUI Handlers
   */

  React.useEffect(() => {
    const PARAMS = _clone(initialGuiData);
    const pane = new tweakpane();

    /**
     * Model Folder
     */
    const modelFolder = pane.addFolder({
      title: "Agregar Modelo",
    });
    modelFolder.addInput(PARAMS, "model", {
      options: {
        ...modelSelectValues,
      },
    });
    modelFolder
      .addButton({
        title: "Agregar",
      })
      .on("click", () => {
        const modelToAdd = primitiveModels[PARAMS.model];

        const newGeometry = new THREE.BufferGeometry();
        newGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(modelToAdd.vertices, 3)
        );
        newGeometry.setIndex(modelToAdd.indices);

        const newMaterial = new THREE.MeshBasicMaterial({
          color: "white",
          wireframe: true,
          side: THREE.DoubleSide,
        });
        const newMesh = new THREE.Mesh(newGeometry, newMaterial);
        newMesh.name = PARAMS.model;

        // Add new mesh infront of the camera
        const dir = camera.position;
        scene.add(newMesh);
        sceneModelsIds.push(newMesh.uuid);
        newMesh.position.set(dir.x, dir.y, dir.z - 3);
      });

    /**
     * Global configurations
     */
    const globalFolder = pane.addFolder({
      title: "Globals",
    });
    globalFolder
      .addInput(PARAMS, "globalWireframe", { label: "wireframe" })
      .on("change", (value) => {
        sceneModelsIds.forEach((id) => {
          const mesh = scene.getObjectByProperty("uuid", id) as
            | THREE.Mesh
            | undefined;
          if (mesh) {
            (mesh.material as THREE.MeshBasicMaterial).wireframe = value;
          }
        });
      });
    globalFolder
      .addInput(PARAMS, "globalColor", { label: "color" })
      .on("change", (value) => {
        const newRendererColor = scaleRGB(value, "down");
        renderer.setClearColor(
          new THREE.Color(
            newRendererColor.r,
            newRendererColor.g,
            newRendererColor.b
          )
        );
      });

      globalFolder
      .addInput(PARAMS, "globalPlane", { label: "Plane" })
      .on("change", (value) => {
        if (value) {
          scene.add(planeHelper);
        } else {
          scene.remove(planeHelper);
        }
      });


    const statsNode = refStats.current;
    globalFolder
      .addInput(PARAMS, "globalShowStats", { label: "stats" })
      .on("change", (value) => {
        if (value) {
          statsNode?.appendChild(stats.dom);
        } else {
          statsNode?.removeChild(stats.dom);
        }
      });

    const selectedModelFolder = pane.addFolder({
      title: "Modelo seleccionado",
    });
    selectedModelFolder
      .addInput(PARAMS, "selectedPosX", {
        min: -5,
        max: 5,
        label: "posX",
      })
      .on("change", (value) => {
        if (activeMesh != null && activeMeshCopy != null) {
          activeMesh.position.x = activeMeshCopy.position.x + value;
        }
      });
    selectedModelFolder
      .addInput(PARAMS, "selectedPosY", {
        min: -5,
        max: 5,
        label: "posY",
      })
      .on("change", (value) => {
        if (activeMesh != null && activeMeshCopy != null) {
          activeMesh.position.y = activeMeshCopy.position.y + value;
        }
      });
    selectedModelFolder
      .addInput(PARAMS, "selectedPosZ", {
        min: -5,
        max: 5,
        label: "posZ",
      })
      .on("change", (value) => {
        if (activeMesh != null && activeMeshCopy != null) {
          activeMesh.position.z = activeMeshCopy.position.z + value;
        }
      });
    selectedModelFolder
      .addInput(PARAMS, "selectedRotX", {
        min: -180,
        max: 180,
        label: "rotX",
      })
      .on("change", (value) => {
        if (activeMesh != null && activeMeshCopy != null) {
          activeMesh.rotation.x =
            activeMeshCopy.rotation.x + degreesToRadians(value);
        }
      });
    selectedModelFolder
      .addInput(PARAMS, "selectedRotY", {
        min: -180,
        max: 180,
        label: "rotY",
      })
      .on("change", (value) => {
        if (activeMesh != null && activeMeshCopy != null) {
          activeMesh.rotation.y =
            activeMeshCopy.rotation.y + degreesToRadians(value);
        }
      });
    selectedModelFolder
      .addInput(PARAMS, "selectedRotZ", {
        min: -180,
        max: 180,
        label: "rotZ",
      })
      .on("change", (value) => {
        if (activeMesh != null && activeMeshCopy != null) {
          activeMesh.rotation.z =
            activeMeshCopy.rotation.z + degreesToRadians(value);
        }
      });
    selectedModelFolder
      .addInput(PARAMS, "selectedColor", {
        label: "color",
      })
      .on("change", (value) => {
        if (activeMesh != null) {
          const newMeshColor = scaleRGB(value, "down");
          (activeMesh.material as THREE.MeshBasicMaterial).color.set(
            new THREE.Color(newMeshColor.r, newMeshColor.g, newMeshColor.b)
          );
        }
      });
    selectedModelFolder
      .addInput(PARAMS, "selectedOpacity", {
        label: "opacity",
        min: 0,
        max: 1,
      })
      .on("change", (value) => {
        if (activeMesh != null) {
          (activeMesh.material as THREE.MeshBasicMaterial).opacity = value;
        }
      });
    selectedModelFolder
      .addButton({ title: "Toggle wireframe" })
      .on("click", () => {
        if (activeMesh != null) {
          (activeMesh.material as THREE.MeshBasicMaterial).wireframe = !(activeMesh.material as THREE.MeshBasicMaterial)
            .wireframe;
        }
      });

    pane.addSeparator();
    pane
      .addButton({
        title: "Reset",
      })
      .on("click", () => {
        removeAllModels();
        addInitialModel();
        pane.importPreset(_clone(initialGuiData));
      });

    return () => {
      pane.dispose();
      if (PARAMS.globalShowStats) {
        statsNode?.removeChild(stats.dom);
      }
    };
  }, []);

  return (
    <CanvasLayout>
      <div id="threejs-stats" ref={refStats} />
      <div id="threejs-canvas" ref={refCanvas} />
    </CanvasLayout>
  );
}

export default Reto1;
