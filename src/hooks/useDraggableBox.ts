import { useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { CollideEvent, Triplet, useBox } from "@react-three/cannon";
import { Vector3 } from "three";

export type UseDraggableBoxProps = {
  mass?: number;
  friction?: number;
  restitution?: number;
  proportions?: Triplet;
  onCollide?: (e: CollideEvent) => void;
};

export const useDraggableBox = (props: UseDraggableBoxProps) => {
  const {
    mass = 0.125,
    friction = 1000,
    restitution = 0,
    proportions = [1, 1, 1],
  } = props;

  const { size, viewport, camera } = useThree();
  const aspect = size.width / viewport.width;

  const [isDragging, setIsDragging] = useState(false); // State to track if the object is being dragged
  const [ref, api] = useBox(() => ({
    args: proportions,
    mass,
    onCollide: props.onCollide,
    friction,
    restitution,
  }));
  const [[xd, yd], setDragPosition] = useState<[number, number]>([0, 0]);
  const bind = useGesture({
    onDragStart: () => {
      setIsDragging(true); // Set drag state to true

      api.mass.set(0);
      api.rotation.set(0, ref.current?.rotation.y ?? 0, 0);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
    },
    onDrag: ({ offset: [x, y] }) => {
      if (!ref.current || !isDragging) return; // Check if the object is being dragged
      const forward = new Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
      const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

      // Use the vectors to determine the drag direction in 3D space
      const dragOffset = new Vector3()
        .add(forward.multiplyScalar(-y / aspect))
        .add(right.multiplyScalar(x / aspect));

      // Adjust the position
      api.position.set(
        ref.current.position.x + dragOffset.x,
        ref.current.position.y + dragOffset.y,
        ref.current.position.z + dragOffset.z
      );

      setDragPosition([ref.current.position.x, ref.current.position.y]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, isDragging, xd, yd]);

  return { ref, api, bind, isDragging };
};
