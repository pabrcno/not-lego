import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { Triplet } from "@react-three/cannon";
import { useDraggableBox } from "../../hooks/useDraggableBox";
import { useLego } from "../../hooks/useLego";
type GLTFResult = GLTF & {
  nodes: {
    lego_4x2: THREE.Mesh;
  };
  materials: {
    ["lego_surface"]: THREE.MeshStandardMaterial;
  };
};

type LegoProps = JSX.IntrinsicElements["group"] & {
  color?: string | THREE.Color;
};

export function Lego4x2({ color }: LegoProps) {
  const { nodes, materials } = useGLTF("/lego_4x2.glb") as GLTFResult;

  const proportions: Triplet = [2, 1, 4];
  const { ref, bind } = useLego({
    proportions,
    mass: 0.2,
    soundOn: true,
  });
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
      geometry={nodes.lego_4x2.geometry}
      material={clonedMaterial}
      {...bind()}
    />
  );
}

useGLTF.preload("/lego_4x2.glb");
