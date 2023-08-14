/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { CollideEvent, PlaneProps } from "@react-three/cannon";
import { Debug, Physics, usePlane } from "@react-three/cannon";
import { Plane } from "@react-three/drei";
import type { MeshStandardMaterialProps } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import React, { useMemo } from "react";
import { useEffect, useState } from "react";

import { Lego1x1, Lego2x2, Lego4x2 } from "../components/legos";
import { Mesh } from "three";

type GroundProps = Pick<MeshStandardMaterialProps, "color"> & PlaneProps;

function Ground({ color, ...props }: GroundProps): JSX.Element {
  const sound = useMemo(() => {
    const collisionSound = new Audio("/lego-fall.wav");
    collisionSound.volume = 0.1;
    return collisionSound;
  }, []);
  const playAudio = (e: CollideEvent) => {
    e.contact.impactVelocity > 2 && sound.play().catch(console.error);
  };

  const [ref] = usePlane(() => ({ ...props, onCollide: playAudio }));

  return (
    <Plane args={[1000, 1000]} ref={ref as React.Ref<Mesh>} receiveShadow>
      <meshStandardMaterial color={color} />
    </Plane>
  );
}
function Scene({ isPaused = false }): JSX.Element {
  const [blocks, setBlocks] = useState<JSX.Element[]>([]);
  const colors = [
    "#B40000",
    "#FCAC00",
    "#00852B",
    "#1E5AA8",
    "#069D9F",
    "#D05098",
  ];
  const legos = [Lego1x1, Lego2x2, Lego4x2];

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      switch (e.code) {
        case "Digit1":
          setBlocks([
            ...blocks,
            React.createElement(legos[0], {
              key: blocks.length,

              color: colors[Math.floor(Math.random() * colors.length)],
            }),
          ]);
          break;
        case "Digit2":
          setBlocks([
            ...blocks,
            React.createElement(legos[1], {
              key: blocks.length,

              color: colors[Math.floor(Math.random() * colors.length)],
            }),
          ]);
          break;
        case "Digit3":
          setBlocks([
            ...blocks,
            React.createElement(legos[2], {
              key: blocks.length,

              color: colors[Math.floor(Math.random() * colors.length)],
            }),
          ]);
          break;

        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [blocks]);

  return (
    <>
      <Physics gravity={[0, -9.81, 0]} isPaused={isPaused}>
        {/* <Debug color="black" scale={1}> */}
        <Ground
          position={[0, -3, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          color="#101010"
        />

        {blocks.map((block, index) => (
          <React.Fragment key={index}>{block}</React.Fragment>
        ))}
        {/* </Debug> */}
      </Physics>

      <ambientLight intensity={1} />
    </>
  );
}

export default function MainScreen() {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Canvas camera={{ fov: 70, position: [0, 2, 10] }} shadows>
        <directionalLight
          castShadow
          intensity={2}
          position={[0, 10, 0]}
          rotation={[0, 0, 0.2]}
        />
        <Scene />
      </Canvas>
    </div>
  );
}
