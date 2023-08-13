/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { BoxProps, PlaneProps } from "@react-three/cannon";
import { Debug, Physics, useBox, usePlane } from "@react-three/cannon";
import { Box, Cone, OrbitControls, Plane, Sphere } from "@react-three/drei";
import type { MeshStandardMaterialProps } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { Camera, type Mesh } from "three";
import { Lego2x2 } from "../../components/legos/Lego2x2";
import { color } from "three/examples/jsm/nodes/Nodes.js";

type GroundProps = Pick<MeshStandardMaterialProps, "color"> & PlaneProps;

function Ground({ color, ...props }: GroundProps): JSX.Element {
  const [ref] = usePlane(() => ({ ...props }), useRef<Mesh>(null));

  return (
    <Plane args={[1000, 1000]} ref={ref} receiveShadow>
      <meshStandardMaterial color={color} />
    </Plane>
  );
}

function Crate(props: BoxProps & { color: string }): JSX.Element {
  const proportions = [3, 1.25, 2.1];
  const [ref, api] = useBox(
    () => ({ args: proportions, mass: 1, ...props }),
    useRef<Mesh>(null)
  );

  return (
    <mesh ref={ref}>
      <Lego2x2 position={[-0.5, -0.5, 0.5]} color={props.color} />
    </mesh>
  );
}

function Scene({ isPaused = false }): JSX.Element {
  const [blocks, setBlocks] = useState<JSX.Element[]>([]);
  const colors = ["#7A0000", "#B47800", "#00591A", "#102C6C", "#600060"];
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.code === "Space") {
        setBlocks([
          ...blocks,
          <Crate
            position={[Math.random(), 20, -5]}
            rotation={[0, 0, 0]}
            color={colors[Math.floor(Math.random() * colors.length)]}
          />,
        ]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [blocks]);

  return (
    <>
      <OrbitControls />

      <Physics gravity={[0, -8, 0]} isPaused={isPaused}>
        {/* <Debug color="black" scale={1}> */}
        <Ground
          position={[0, -2, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          color="#101010"
        />

        {blocks.map((block, index) => (
          <React.Fragment key={index}>{block}</React.Fragment>
        ))}
        {/* </Debug> */}
      </Physics>

      <ambientLight intensity={3} />
    </>
  );
}

export default function Paused() {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Canvas camera={{ fov: 70, position: [0, 0, 3] }} shadows>
        <directionalLight
          castShadow
          intensity={0.7}
          position={[5, 10, 0]}
          rotation={[0, 0, 0.2]}
        />
        <Scene />
      </Canvas>
    </div>
  );
}
