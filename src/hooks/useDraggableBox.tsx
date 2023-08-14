import { useState, useEffect } from "react";
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

export const useDraggableBox = (props: UseDraggableBoxProps) => {
  const {
    mass = 0.025,
    friction = 100,
    restitution = 0,
    proportions = [1, 1, 1],
  } = props;

  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const [position, setPosition] = useState<Triplet>([0, 0, 0]); // State to track the position of the object

  const [isDragging, setIsDragging] = useState(false); // State to track if the object is being dragged
  const [ref, api] = useBox(() => ({
    args: proportions,
    mass,
    friction,
    restitution,
  }));

  const bind = useGesture({
    onDragStart: () => {
      setIsDragging(true); // Set drag state to true
      api.mass.set(0);
      api.rotation.set(0, ref.current?.rotation.y ?? 0, 0);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
    },
    onDrag: ({ offset: [x, y] }) => {
      api.position.set(...[x / aspect, -y / aspect, 0]);
    },
    onDragEnd: () => {
      setIsDragging(false); // Set drag state to false
      api.mass.set(mass);
    },
  });

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (!ref.current || !isDragging) return; // Check if the object is being dragged

      switch (event.key.toLowerCase()) {
        case "a":
          api.rotation.set(0, (ref.current.rotation.y -= 0.1), 0);
          break;
        case "d":
          api.rotation.set(0, (ref.current.rotation.y += 0.1), 0);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      // Cleanup event listener on component unmount
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [ref, isDragging]); // Add isDragging as a dependency

  return { ref, bind };
};
