import { useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { PublicApi, Triplet, useBox } from "@react-three/cannon";
import { Object3D } from "three";

interface UseDraggableBoxProps {
  mass?: number;
  friction?: number;
  restitution?: number;
  proportions?: Triplet;
}

export const useDraggableBox = ({
  mass = 0.025,
  friction = 100,
  restitution = 0,
  proportions = [1, 1, 1],
}: UseDraggableBoxProps) => {
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const [ref, api] = useBox(() => ({
    args: proportions,
    mass,
    friction,
    restitution,
  }));

  const bind = useGesture({
    onDragStart: () => {
      api.mass.set(0);
      api.rotation.set(0, 0, 0);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
    },
    onDrag: ({ offset: [x, y] }) => {
      const position: Triplet = [
        x / aspect,
        -y / aspect,
        ref.current?.position.z ?? 0,
      ];
      api.position.set(...position);
    },
    onDragEnd: () => {
      api.mass.set(mass);
    },
  });

  return { ref, bind };
};
