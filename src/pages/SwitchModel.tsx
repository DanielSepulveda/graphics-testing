import * as React from "react";
import * as THREE from "three";
import type { Mesh } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Box,
  Wrap,
  WrapItem,
  CheckboxGroup,
  useCheckboxGroupContext,
  useCheckbox,
  chakra,
} from "@chakra-ui/react";
import {
  Sphere,
  OrbitControls,
  Box as ThreeBox,
  Cone,
  Stats as DStats,
} from "@react-three/drei";
import {
  SphereBufferGeometry,
  BoxBufferGeometry,
  ConeBufferGeometry,
  MeshBasicMaterial,
} from "three";
import tweakpane from "tweakpane";
import { cloneDeep as _clone } from "lodash";
import { degreesToRadians, scaleRGB } from "../utils/helpers";
import { CanvasLayout } from "../components";

const Stats = chakra(DStats);

type PossibleModels = "sphere" | "box" | "cone";

type MulitModalProps = {
  currentModels: PossibleModels[];
};

const initialGuiData = {
  xPosition: 0,
  yPosition: 0,
  zPosition: 0,
  xRotation: 0,
  yRotation: 0,
  zRotation: 0,
  wireframe: true,
  showStats: false,
  color: { r: 255, b: 255, g: 255 },
};

const MultiModel = (props: MulitModalProps) => {
  const sphereMesh = React.useRef<Mesh>();
  const boxMesh = React.useRef<Mesh>();
  const coneMesh = React.useRef<Mesh>();

  const [state, setState] = React.useState({
    showStats: initialGuiData.showStats,
    wireframe: initialGuiData.wireframe,
    color: initialGuiData.color,
  });

  const sphere = React.useMemo(() => new SphereBufferGeometry(), []);
  const box = React.useMemo(() => new BoxBufferGeometry(), []);
  const cone = React.useMemo(() => new ConeBufferGeometry(), []);

  React.useEffect(() => {
    const PARAMS = _clone(initialGuiData);
    const pane = new tweakpane();

    pane.addInput(PARAMS, "wireframe").on("change", (value) => {
      setState((prevState) => ({
        ...prevState,
        wireframe: value,
      }));
    });

    pane.addInput(PARAMS, "showStats").on("change", (value) => {
      setState((prevState) => ({
        ...prevState,
        showStats: value,
      }));
    });

    pane.addInput(PARAMS, "color").on("change", (value) => {
      setState((prevState) => ({
        ...prevState,
        color: value,
      }));
    });

    const positionFolder = pane.addFolder({
      title: "Posicion",
    });
    positionFolder
      .addInput(PARAMS, "xPosition", {
        min: -5,
        max: 5,
        label: "x",
      })
      .on("change", (value) => {
        if (sphereMesh.current) {
          sphereMesh.current.position.x = value - 3;
        }
        if (boxMesh.current) {
          boxMesh.current.position.x = value;
        }
        if (coneMesh.current) {
          coneMesh.current.position.x = value + 3;
        }
      });
    positionFolder
      .addInput(PARAMS, "yPosition", {
        min: -5,
        max: 5,
        label: "y",
      })
      .on("change", (value) => {
        if (sphereMesh.current) {
          sphereMesh.current.position.y = value;
        }
        if (boxMesh.current) {
          boxMesh.current.position.y = value;
        }
        if (coneMesh.current) {
          coneMesh.current.position.y = value;
        }
      });
    positionFolder
      .addInput(PARAMS, "zPosition", {
        min: -5,
        max: 5,
        label: "z",
      })
      .on("change", (value) => {
        if (sphereMesh.current) {
          sphereMesh.current.position.z = value;
        }
        if (boxMesh.current) {
          boxMesh.current.position.z = value;
        }
        if (coneMesh.current) {
          coneMesh.current.position.z = value;
        }
      });

    const rotationFolder = pane.addFolder({
      title: "Rotacion",
    });
    rotationFolder
      .addInput(PARAMS, "xRotation", {
        min: -180,
        max: 180,
        label: "x",
      })
      .on("change", (value) => {
        if (sphereMesh.current) {
          sphereMesh.current.rotation.x = degreesToRadians(value);
        }
        if (boxMesh.current) {
          boxMesh.current.rotation.x = degreesToRadians(value);
        }
        if (coneMesh.current) {
          coneMesh.current.rotation.x = degreesToRadians(value);
        }
      });
    rotationFolder
      .addInput(PARAMS, "yRotation", {
        min: -180,
        max: 180,
        label: "y",
      })
      .on("change", (value) => {
        if (sphereMesh.current) {
          sphereMesh.current.rotation.y = degreesToRadians(value);
        }
        if (boxMesh.current) {
          boxMesh.current.rotation.y = degreesToRadians(value);
        }
        if (coneMesh.current) {
          coneMesh.current.rotation.y = degreesToRadians(value);
        }
      });
    rotationFolder
      .addInput(PARAMS, "zRotation", {
        min: -180,
        max: 180,
        label: "z",
      })
      .on("change", (value) => {
        if (sphereMesh.current) {
          sphereMesh.current.rotation.z = degreesToRadians(value);
        }
        if (boxMesh.current) {
          boxMesh.current.rotation.z = degreesToRadians(value);
        }
        if (coneMesh.current) {
          coneMesh.current.rotation.z = degreesToRadians(value);
        }
      });

    pane.addSeparator();
    pane
      .addButton({
        title: "Reset",
      })
      .on("click", () => {
        pane.importPreset(_clone(initialGuiData));
        setState({
          wireframe: initialGuiData.wireframe,
          color: initialGuiData.color,
          showStats: initialGuiData.showStats,
        });
      });

    return () => {
      pane.dispose();
    };
  }, []);

  const newColor = scaleRGB(state.color, "down");
  const color = new THREE.Color(newColor.r, newColor.g, newColor.b);
  const material = new MeshBasicMaterial({ color, wireframe: state.wireframe });

  return (
    <>
      <Canvas
        camera={{
          fov: 60,
          position: [0, 0, 5],
        }}
      >
        <OrbitControls />
        {props.currentModels.includes("sphere") && (
          <mesh
            ref={sphereMesh}
            geometry={sphere}
            position={[-3, 0, 0]}
            material={material}
          ></mesh>
        )}
        {props.currentModels.includes("box") && (
          <mesh ref={boxMesh} geometry={box} material={material}></mesh>
        )}
        {props.currentModels.includes("cone") && (
          <mesh
            ref={coneMesh}
            geometry={cone}
            position={[3, 0, 0]}
            material={material}
          ></mesh>
        )}
      </Canvas>
      {state.showStats && (
        <Stats top="5rem !important" left="16px !important" />
      )}
    </>
  );
};

type ModelCardProps = {
  model: string;
  children: (state: { isChecked: boolean }) => React.ReactNode;
};
const ModelCard: React.FC<ModelCardProps> = ({ children, model }) => {
  const group = useCheckboxGroupContext();

  const isChecked = group.value.includes(model);
  const onChange = group.onChange;

  const { state, getInputProps, getCheckboxProps } = useCheckbox({
    name: model,
    value: model,
    isChecked,
    onChange,
  });

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        borderRadius="lg"
        backgroundColor="white"
        height="150px"
        width="125px"
        _hover={{
          cursor: "pointer",
        }}
        _checked={{
          backgroundColor: "#333359",
          border: "1px solid white",
        }}
      >
        <Canvas
          camera={{
            fov: 60,
            position: [0, 0, 3],
          }}
        >
          {children(state)}
        </Canvas>
      </Box>
    </Box>
  );
};

type ModelProps = {
  component: React.ElementType<any>;
  isChecked: boolean;
};

const Model: React.FC<ModelProps> = ({ component: Component, isChecked }) => {
  const mesh = React.useRef<Mesh>();

  useFrame(() => {
    if (mesh.current) mesh.current.rotation.y += 0.01;
  });

  return (
    <Component ref={mesh}>
      <meshBasicMaterial color={isChecked ? "white" : "black"} wireframe />
    </Component>
  );
};

const Demo = () => {
  const [value, setValue] = React.useState<PossibleModels[]>(["box"]);

  const handleChange = (newValue: PossibleModels[]) => {
    setValue(newValue);
  };

  return (
    <CanvasLayout>
      <Box backgroundColor="#333359">
        <Box h="calc(100vh - 4.5rem)" position="relative">
          <MultiModel currentModels={value} />
        </Box>
        <Box position="absolute" bottom="0" left="0" right="0">
          <Box paddingBottom="6" display="flex" justifyContent="center">
            <CheckboxGroup value={value} onChange={handleChange}>
              <Wrap spacing="4">
                <WrapItem>
                  <ModelCard model="sphere">
                    {({ isChecked }) => (
                      <Model component={Sphere} isChecked={isChecked} />
                    )}
                  </ModelCard>
                </WrapItem>
                <WrapItem>
                  <ModelCard model="box">
                    {({ isChecked }) => (
                      <Model component={ThreeBox} isChecked={isChecked} />
                    )}
                  </ModelCard>
                </WrapItem>
                <WrapItem>
                  <ModelCard model="cone">
                    {({ isChecked }) => (
                      <Model component={Cone} isChecked={isChecked} />
                    )}
                  </ModelCard>
                </WrapItem>
              </Wrap>
            </CheckboxGroup>
          </Box>
        </Box>
      </Box>
    </CanvasLayout>
  );
};

export default Demo;
