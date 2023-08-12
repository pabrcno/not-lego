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

type GroundProps = Pick<MeshStandardMaterialProps, "color"> & PlaneProps;

function Ground({ color, ...props }: GroundProps): JSX.Element {
  const [ref] = usePlane(() => ({ ...props }), useRef<Mesh>(null));

  return (
    <Plane args={[1000, 1000]} ref={ref}>
      <meshStandardMaterial />
    </Plane>
  );
}

function Crate(props: BoxProps): JSX.Element {
  const proportions = [0.5, 0.5, 0.5];
  const [ref, api] = useBox(
    () => ({ args: proportions, mass: 0.1, ...props }),
    useRef<Mesh>(null)
  );

  return (
    <Box
      args={proportions}
      onClick={() => {
        api.applyTorque([0, 0, 10]);
      }}
      ref={ref}
    >
      <meshNormalMaterial />
    </Box>
  );
}

function Scene({ isPaused = false }): JSX.Element {
  const [blocks, setBlocks] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.code === "Space") {
        setBlocks([
          ...blocks,
          <Crate position={[0, 1.8, 0]} rotation={[0, 0, 0]} />,
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

      <Physics gravity={[0, -10, 0]} isPaused={isPaused}>
        <Debug color="black" scale={1}>
          <Ground
            color="grey"
            position={[0, -2, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          />

          {blocks.map((block, index) => (
            <React.Fragment key={index}>{block}</React.Fragment>
          ))}
        </Debug>
      </Physics>

      <ambientLight intensity={3} />
    </>
  );
}

export default function Paused() {
  const [isPaused, togglePaused] = useState(false);
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Canvas camera={{ fov: 70, position: [0, 0, 3] }}>
        <Scene isPaused={isPaused} />
      </Canvas>
    </div>
  );
}
