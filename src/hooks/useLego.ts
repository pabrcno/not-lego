import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { useDraggableBox, UseDraggableBoxProps } from "./useDraggableBox";
import { debounce } from "lodash";
import { CollideEvent } from "@react-three/cannon";

type UseLegoProps = UseDraggableBoxProps & {
  soundOn?: boolean;
};

export const useLego = (props: UseLegoProps) => {
  const debouncedPlay = debounce(() => {
    sound.play().catch(console.error);
  }, 50);
  const playAudio = (e: CollideEvent) => {
    if (
      !props.soundOn ||
      e.body.name !== "lego" ||
      e.contact.impactVelocity <= 1.5
    )
      return;

    const localContactPoint = ref.current?.worldToLocal(
      new THREE.Vector3(...e.contact.contactPoint)
    );
    if (!localContactPoint) return;

    const isTopCollision =
      Math.abs(
        localContactPoint.y * (props.proportions?.[1] ?? 1) -
          (props.proportions?.[1] ?? 1) / 2
      ) < 0.1;

    if (isTopCollision) {
      debouncedPlay();
    }
  };
  const magneticForce = 10; // Define a constant for the strength of the magnetic attraction.

  const applyMagneticForce = (e: CollideEvent) => {
    if (!ref.current) return;
    const otherBox = e.body;

    const ourBoxPosition = ref.current.position.clone();
    const otherBoxPosition = otherBox.position.clone();

    const isAbove = ourBoxPosition.y > otherBoxPosition.y;

    // Check if the boxes are in proximity
    const distance = isAbove
      ? ourBoxPosition.y - (props.proportions?.[1] ?? 1) - otherBoxPosition.y
      : otherBoxPosition.y - (props.proportions?.[1] ?? 1) - ourBoxPosition.y;

    if (distance < 0.1) {
      // 0.1 is a threshold, adjust based on your requirements
      const forceMagnitude = magneticForce / (distance + 0.01); // Add a small value to avoid division by zero

      const forceDirection = new THREE.Vector3(0, isAbove ? -1 : 1, 0); // Up or down depending on position
      const force = forceDirection.multiplyScalar(forceMagnitude);

      // Apply the forces
      api.applyForce(force.toArray(), ourBoxPosition.toArray());
    }
  };

  const { ref, api, bind, isDragging } = useDraggableBox({
    ...props,
    onCollide: (e) => {
      playAudio(e);
      applyMagneticForce(e);
    },
  });

  useEffect(() => {
    if (!ref.current) return;
    ref.current.name = "lego";
  }, [ref]);

  const sound = useMemo(() => {
    const collisionSound = new Audio("/lego-click.wav");
    collisionSound.volume = 0.05;
    return collisionSound;
  }, []);

  return { ref, bind };
};
