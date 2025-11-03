import type { CollideEvent, PlaneProps } from "@react-three/cannon";
import { usePlane } from "@react-three/cannon";
import { Plane } from "@react-three/drei";
import type { MeshStandardMaterialProps } from "@react-three/fiber";
import React, { useMemo } from "react";

import { Mesh } from "three";

type GroundProps = Pick<MeshStandardMaterialProps, "color"> & PlaneProps;

export const Ground = ({ color, ...props }: GroundProps): JSX.Element => {
  const sound = useMemo(() => {
    const collisionSound = new Audio("/lego-fall.wav");
    collisionSound.volume = 0.005;
    return collisionSound;
  }, []);
  const playAudio = (e: CollideEvent) => {
    e.contact.impactVelocity > 2 && sound.play().catch(console.error);
  };

  const [ref] = usePlane(() => ({ ...props, onCollide: playAudio }));

  return (
    <Plane args={[1000, 1000]} ref={ref as React.Ref<Mesh>} receiveShadow>
      <meshPhysicalMaterial 
        color={color ?? "#A3B9FF"} 
        metalness={0.25} 
        roughness={0.2} 
        clearcoat={0.8} 
        clearcoatRoughness={0.1} 
        envMapIntensity={1.2}
      />
    </Plane>
  );
};
