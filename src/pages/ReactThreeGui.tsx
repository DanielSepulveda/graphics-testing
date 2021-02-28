import React from "react";
import { Canvas as RtfCanvas } from "react-three-fiber";
import * as Three from "three";
import { Box, chakra } from "@chakra-ui/react";
import { Sphere, OrbitControls, Stats as DStats } from "@react-three/drei";
import { withControls, useControl, Controls } from "react-three-gui";
import { degreesToRadians } from "../utils/helpers";

import { CanvasLayout } from "../components";

const Canvas = withControls(RtfCanvas) as typeof RtfCanvas;
const Stats = chakra(DStats);

const MySphere = () => {
  const xPosition = useControl("X Position", {
    type: "number",
    value: 0,
    min: -5,
    max: 5,
  });
  const yRotation = useControl("Y Rotation", {
    type: "number",
    value: 0,
    min: -180,
    max: 180,
  });
  const withWireframe = useControl("Wireframe", {
    type: "boolean",
    value: true,
  });
  const withStats = useControl("Stats", {
    type: "boolean",
    value: false,
  });

  const yRotationRadians = React.useMemo(() => degreesToRadians(yRotation), [
    yRotation,
  ]);

  return (
    <>
      <Sphere position-x={xPosition} rotation-y={yRotationRadians}>
        <meshBasicMaterial color="white" wireframe={withWireframe} />
      </Sphere>
      {withStats && <Stats top="5rem !important" left="16px !important" />}
    </>
  );
};

const Demo = () => {
  return (
    <CanvasLayout>
      <Box h="calc(100vh - 4.5rem)">
        <Controls.Provider>
          <Canvas
            onCreated={({ scene }) => {
              scene.background = new Three.Color(0.2, 0.2, 0.35);
            }}
            camera={{
              fov: 60,
              position: [0, 0, 3],
            }}
          >
            <OrbitControls />
            <MySphere />
          </Canvas>
          <Controls anchor="bottom_right" />
        </Controls.Provider>
      </Box>
    </CanvasLayout>
  );
};

export default Demo;
