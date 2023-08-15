import { useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { CollideEvent, Triplet, useBox } from "@react-three/cannon";

export type UseDraggableBoxProps = {
  mass?: number;
  friction?: number;
  restitution?: number;
  proportions?: Triplet;
  onCollide?: (e: CollideEvent) => void;
};

export const useDraggableBox = (props: UseDraggableBoxProps) => {
  const {
    mass = 0.025,
    friction = 200,
    restitution = 0,
    proportions = [1, 1, 1],
  } = props;

  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const [isDragging, setIsDragging] = useState(false); // State to track if the object is being dragged
  const [ref, api] = useBox(() => ({
    args: proportions,
    mass,
    onCollide: props.onCollide,
    friction,
    restitution,
  }));
  const [[xd, yd, zd], setDragPosition] = useState<Triplet>([0, 0, 0]);
  const bind = useGesture({
    onDragStart: () => {
      setIsDragging(true); // Set drag state to true

      api.mass.set(0);
      api.rotation.set(0, ref.current?.rotation.y ?? 0, 0);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
    },
    onDrag: ({ offset: [x, y] }) => {
      api.position.set(
        ...[x / aspect, -y / aspect, ref.current?.position.z ?? 0]
      );
      console.log(x, y);
      setDragPosition([x / aspect, -y / aspect, ref.current?.position.z ?? 0]);
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
        case "w":
          api.position.set(xd, yd, (ref.current.position.z -= 0.1));

          break;

        case "s":
          api.position.set(xd, yd, (ref.current.position.z += 0.1));
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
