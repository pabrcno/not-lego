import { useState, useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { CollideEvent, Triplet, useBox } from "@react-three/cannon";

interface UseDraggableBoxProps {
  mass?: number;
  friction?: number;
  restitution?: number;
  proportions?: Triplet;
  soundOn?: boolean;
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
  const sound = useMemo(() => {
    const collisionSound = new Audio("/lego-click.wav");
    collisionSound.volume = 0.2;
    return collisionSound;
  }, []);
  const playAudio = (e: CollideEvent) => {
    props.soundOn &&
      e.body.name === "lego" &&
      e.contact.impactVelocity > 1.5 &&
      sound.play().catch(console.error);
  };
  const [isDragging, setIsDragging] = useState(false); // State to track if the object is being dragged
  const [ref, api] = useBox(() => ({
    args: proportions,
    mass,

    friction,
    restitution,
    onCollide: playAudio,
  }));

  useEffect(() => {
    if (!ref.current) return;
    ref.current.name = "lego";
  }, [ref]);

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
