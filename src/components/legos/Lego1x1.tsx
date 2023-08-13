import * as THREE from "three";
import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { Triplet, useBox } from "@react-three/cannon";
type GLTFResult = GLTF & {
  nodes: {
    lego_1x1: THREE.Mesh;
  };
  materials: {
    ["lego_surface"]: THREE.MeshStandardMaterial;
  };
};

type LegoProps = JSX.IntrinsicElements["group"] & {
  color?: string | THREE.Color;
};

export function Lego1x1({ color, ...props }: LegoProps) {
  const { nodes, materials } = useGLTF("/lego_1x1.glb") as GLTFResult;

  const proportions: Triplet = [1, 1, 1];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const [ref] = useBox(
    () => ({
      args: proportions,
      mass: 0.025,
      friction: 100,
      restitution: 0,
      ...props,
    }),
    useRef<THREE.Mesh>(null)
  );
  const clonedMaterial = materials["lego_surface"].clone();

  // Update the material's color if a color prop is provided
  if (color) {
    clonedMaterial.color.set(color);
  }

  return (
    <mesh
      ref={ref as React.Ref<THREE.Mesh>}
      castShadow
      receiveShadow
      geometry={nodes.lego_1x1.geometry}
      material={clonedMaterial}
    />
  );
}

useGLTF.preload("/lego_2x2.glb");