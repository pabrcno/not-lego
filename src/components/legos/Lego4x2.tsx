import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { Triplet } from "@react-three/cannon";
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
  scale?: [number, number, number];
};

export function Lego4x2({ color, scale, ...props }: LegoProps) {
  const { nodes, materials } = useGLTF("/lego_4x2.glb") as GLTFResult;

  const baseProportions = [2, 1, 4];
  const adjustedProportions = scale
    ? (baseProportions.map((prop, idx) => prop * scale[idx]) as Triplet)
    : baseProportions;
  const { ref, bind } = useLego({
    proportions: adjustedProportions as Triplet,
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
      scale={scale}
      ref={ref as React.Ref<THREE.Mesh>}
      castShadow
      geometry={nodes.lego_4x2.geometry}
      material={clonedMaterial}
      position={props.position}
      {...(bind() as JSX.IntrinsicElements["mesh"])}
    />
  );
}

useGLTF.preload("/lego_4x2.glb");
