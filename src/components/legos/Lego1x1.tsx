import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

import { useDraggableBox } from "../../hooks/useDraggableBox";

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

export function Lego1x1({ color }: LegoProps) {
  const { nodes, materials } = useGLTF("/lego_1x1.glb") as GLTFResult;

  const { ref, bind } = useDraggableBox({ soundOn: true });
  const clonedMaterial = materials["lego_surface"].clone();
  if (color) {
    clonedMaterial.color.set(color);
  }

  return (
    <mesh
      ref={ref as React.Ref<THREE.Mesh>}
      {...bind()}
      castShadow
      receiveShadow
      geometry={nodes.lego_1x1.geometry}
      material={clonedMaterial}
      position={[0, 0, 0.1]}
    />
  );
}
useGLTF.preload("/lego_1x1.glb");
