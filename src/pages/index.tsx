import type { CollideEvent, PlaneProps } from "@react-three/cannon";
import { Physics, usePlane } from "@react-three/cannon";
import { Plane } from "@react-three/drei";
import type { MeshStandardMaterialProps } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import React, { useMemo } from "react";

import { Mesh } from "three";
import { useLegos } from "../hooks/useLegos";

type GroundProps = Pick<MeshStandardMaterialProps, "color"> & PlaneProps;

function Ground({ color, ...props }: GroundProps): JSX.Element {
  const sound = useMemo(() => {
    const collisionSound = new Audio("/lego-fall.wav");
    collisionSound.volume = 0.01;
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
  const { legos } = useLegos();

  return (
    <>
      <Physics gravity={[0, -9.81, 0]} isPaused={isPaused}>
        {/* <Debug color="black" scale={1}> */}
        <Ground
          position={[0, -3, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          color="#101010"
        />

        {legos.map((lego, index) => (
          <React.Fragment key={index}>{lego}</React.Fragment>
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
