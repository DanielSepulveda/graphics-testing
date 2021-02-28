import React, { useRef, useState } from "react";
import { Canvas, MeshProps, useFrame } from "react-three-fiber";
import type { Mesh } from "three";
import { Box } from "@chakra-ui/react";
import { CanvasLayout } from "../components";

const Sphere: React.FC<MeshProps> = (props) => {
  const mesh = useRef<Mesh>();

  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame(() => {
    if (mesh.current) mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <sphereBufferGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};

const Cylinder: React.FC<MeshProps> = (props) => {
  const mesh = useRef<Mesh>();

  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame(() => {
    if (mesh.current) mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <cylinderBufferGeometry args={[1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};

const Demo = () => {
  return (
    <CanvasLayout>
      <Box h="calc(100vh - 4.5rem)">
        <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Sphere position={[-2.2, 0, 0]} />
          <Cylinder position={[2.2, 0, 0]} />
        </Canvas>
      </Box>
    </CanvasLayout>
  );
};

export default Demo;
