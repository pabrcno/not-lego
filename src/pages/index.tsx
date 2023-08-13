/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { PlaneProps } from "@react-three/cannon";
import { Debug, Physics, usePlane } from "@react-three/cannon";
import { OrbitControls, Plane } from "@react-three/drei";
import type { MeshStandardMaterialProps } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { type Mesh } from "three";

import { Lego1x1, Lego2x2, Lego4x2 } from "../components/legos";

type GroundProps = Pick<MeshStandardMaterialProps, "color"> & PlaneProps;

function Ground({ color, ...props }: GroundProps): JSX.Element {
  const [ref] = usePlane(() => ({ ...props }), useRef<Mesh>(null));

  return (
    <Plane args={[1000, 1000]} ref={ref} receiveShadow>
      <meshStandardMaterial color={color} />
    </Plane>
  );
}

function Scene({ isPaused = false }): JSX.Element {
  const [blocks, setBlocks] = useState<JSX.Element[]>([]);
  const colors = ["#690000", "#a37800", "#00490A", "#002C6C", "#200060"];
  const legos = [Lego1x1, Lego2x2, Lego4x2];
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.code === "Space") {
        setBlocks([
          ...blocks,
          React.createElement(legos[Math.floor(Math.random() * legos.length)], {
            key: blocks.length,
            position: [0, 10, 0],
            color: colors[Math.floor(Math.random() * colors.length)],
          }),
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

      <Physics gravity={[0, -9.81, 0]} isPaused={isPaused}>
        {/* <Debug color="black" scale={1}> */}
        <Ground
          position={[0, -2, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          color="#202020"
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

export default function MainScreen() {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Canvas camera={{ fov: 70, position: [0, 0, 3] }} shadows>
        <directionalLight
          castShadow
          intensity={1}
          position={[0, 10, 0]}
          rotation={[0, 0, 0.2]}
        />
        <Scene />
      </Canvas>
    </div>
  );
}
