import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

import { useLego } from "../../hooks/useLego";
import { Triplet } from "@react-three/cannon";
import { AnimatedLegoWrapper } from "./AnimatedLegoWrapper";

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
  scale?: [number, number, number];
};

export function Lego1x1({ color, scale, ...props }: LegoProps) {
  const { nodes, materials } = useGLTF("/lego_1x1.glb") as GLTFResult;
  const baseProportions: [number, number, number] = [1, 1, 1];
  const adjustedProportions: [number, number, number] = scale
    ? (baseProportions.map((prop, idx) => prop * scale[idx]) as Triplet)
    : baseProportions;

  const { ref, bind } = useLego({
    proportions: adjustedProportions as Triplet,

    soundOn: true,
  });
  const clonedMaterial = materials["lego_surface"].clone();
  if (color) {
    clonedMaterial.color.set(color);
  }

  return (
    <AnimatedLegoWrapper>
      <mesh
        ref={ref as React.Ref<THREE.Mesh>}
        {...(bind() as JSX.IntrinsicElements["mesh"])}
        castShadow
        geometry={nodes.lego_1x1.geometry}
        material={clonedMaterial}
        position={props.position}
        scale={scale}
      />
    </AnimatedLegoWrapper>
  );
}
useGLTF.preload("/lego_1x1.glb");
