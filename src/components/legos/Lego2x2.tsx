import * as THREE from "three";

import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { Triplet } from "@react-three/cannon";
import { useDraggableBox } from "../../hooks/useDraggableBox";
type GLTFResult = GLTF & {
  nodes: {
    lego_2x2: THREE.Mesh;
  };
  materials: {
    ["lego_surface"]: THREE.MeshStandardMaterial;
  };
};

type LegoProps = JSX.IntrinsicElements["group"] & {
  color?: string | THREE.Color;
};

export function Lego2x2({ color }: LegoProps) {
  const { nodes, materials } = useGLTF("/lego_2x2.glb") as GLTFResult;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const proportions = [2, 1, 2] as Triplet;
  const { ref, bind } = useDraggableBox({
    proportions,
    mass: 0.1,
  });
  const clonedMaterial = materials["lego_surface"].clone();

  // Update the material's color if a color prop is provided
  if (color) {
    clonedMaterial.color.set(color);
  }

  return (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.lego_2x2.geometry}
      material={clonedMaterial}
      ref={ref as React.Ref<THREE.Mesh>}
      {...bind()}
    />
  );
}

useGLTF.preload("/lego_2x2.glb");
