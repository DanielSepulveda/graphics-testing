import * as React from "react";
import * as THREE from "three";
import type { Mesh } from "three";
import { Canvas, useFrame } from "react-three-fiber";
import {
  Box,
  Wrap,
  WrapItem,
  useRadio,
  useRadioGroup,
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
} from "three";
import tweakpane from "tweakpane";
import { cloneDeep as _clone } from "lodash";
import { degreesToRadians, scaleRGB } from "../utils/helpers";
import { CanvasLayout } from "../components";

const Stats = chakra(DStats);

type PossibleModels = "sphere" | "box" | "cone";

type MulitModalProps = {
  currentModel: PossibleModels;
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
  const mesh = React.useRef<Mesh>();
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
        if (mesh.current) {
          mesh.current.position.x = value;
        }
      });
    positionFolder
      .addInput(PARAMS, "yPosition", {
        min: -5,
        max: 5,
        label: "y",
      })
      .on("change", (value) => {
        if (mesh.current) {
          mesh.current.position.y = value;
        }
      });
    positionFolder
      .addInput(PARAMS, "zPosition", {
        min: -5,
        max: 5,
        label: "z",
      })
      .on("change", (value) => {
        if (mesh.current) {
          mesh.current.position.z = value;
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
        if (mesh.current) {
          mesh.current.rotation.x = degreesToRadians(value);
        }
      });
    rotationFolder
      .addInput(PARAMS, "yRotation", {
        min: -180,
        max: 180,
        label: "y",
      })
      .on("change", (value) => {
        if (mesh.current) {
          mesh.current.rotation.y = degreesToRadians(value);
        }
      });
    rotationFolder
      .addInput(PARAMS, "zRotation", {
        min: -180,
        max: 180,
        label: "z",
      })
      .on("change", (value) => {
        if (mesh.current) {
          mesh.current.rotation.z = degreesToRadians(value);
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
  }, []);

  const geometry = React.useMemo(() => {
    if (props.currentModel === "sphere") return sphere;
    if (props.currentModel === "box") return box;
    if (props.currentModel === "cone") return cone;
  }, [box, cone, props.currentModel, sphere]);

  const newColor = scaleRGB(state.color, "down");
  const color = new THREE.Color(newColor.r, newColor.g, newColor.b);

  console.log(color);

  return (
    <>
      <Canvas
        camera={{
          fov: 60,
          position: [0, 0, 5],
        }}
      >
        <OrbitControls />
        <mesh ref={mesh} geometry={geometry}>
          <meshBasicMaterial color={color} wireframe={state.wireframe} />
        </mesh>
      </Canvas>
      {state.showStats && (
        <Stats top="5rem !important" left="16px !important" />
      )}
    </>
  );
};

type ModelCardProps = {
  children: (state: { isChecked: boolean }) => React.ReactNode;
};
const ModelCard: React.FC<ModelCardProps> = ({ children, ...radioProps }) => {
  const { getInputProps, getCheckboxProps, state } = useRadio(radioProps);

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
  const { getRootProps, getRadioProps, value } = useRadioGroup({
    name: "model",
    defaultValue: "sphere",
  });

  const group = getRootProps();

  return (
    <CanvasLayout>
      <Box backgroundColor="#333359">
        <Box h="calc(100vh - 4.5rem)" position="relative">
          <MultiModel currentModel={value as PossibleModels} />
        </Box>
        <Box position="absolute" bottom="0" left="0" right="0">
          <Box paddingBottom="6" display="flex" justifyContent="center">
            <Wrap spacing="4" {...group}>
              <WrapItem>
                <ModelCard {...getRadioProps({ value: "sphere" })}>
                  {({ isChecked }) => (
                    <Model component={Sphere} isChecked={isChecked} />
                  )}
                </ModelCard>
              </WrapItem>
              <WrapItem>
                <ModelCard {...getRadioProps({ value: "box" })}>
                  {({ isChecked }) => (
                    <Model component={ThreeBox} isChecked={isChecked} />
                  )}
                </ModelCard>
              </WrapItem>
              <WrapItem>
                <ModelCard {...getRadioProps({ value: "cone" })}>
                  {({ isChecked }) => (
                    <Model component={Cone} isChecked={isChecked} />
                  )}
                </ModelCard>
              </WrapItem>
            </Wrap>
          </Box>
        </Box>
      </Box>
    </CanvasLayout>
  );
};

export default Demo;
