import * as THREE from "three";
import { UseDraggableBoxProps, useDraggableBox } from "./useDraggableBox";
import { useEffect, useMemo } from "react";
import { CollideEvent } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";

type UseLegoProps = UseDraggableBoxProps & {
  soundOn?: boolean;
};

export const useLego = (props: UseLegoProps) => {
  const playAudio = (e: CollideEvent) => {
    if (
      !props.soundOn ||
      e.body.name !== "lego" ||
      e.contact.impactVelocity <= 1.5
    )
      return;

    // Get the local contact point
    const localContactPoint = ref.current?.worldToLocal(
      new THREE.Vector3(...e.contact.contactPoint)
    );
    if (!localContactPoint) return;
    // Check if the contact point's y-value is approximately equal to half the height (the top of the box)
    const isTopCollision =
      Math.abs(localContactPoint.y - (props.proportions?.[1] ?? 1) / 2) < 0.1; // Use a small threshold value (0.1 in this case)

    // Play the sound if it's a top collision
    if (isTopCollision) {
      sound.play().catch(console.error);
    }
  };

  const { ref, api, bind, isDragging } = useDraggableBox({
    ...props,
    onCollide: playAudio,
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

  const magnetPoint = new THREE.Vector3(0, 5, 0); // Arbitrary magnet center
  const MAGNETIC_STRENGTH = 5;

  useFrame(() => {
    if (ref.current && !isDragging && props.proportions) {
      // Calculate the center of the top face of the box
      const boxSizeY = props.proportions[1];
      const topFaceCenter = new THREE.Vector3(
        ref.current.position.x,
        ref.current.position.y + boxSizeY / 2,
        ref.current.position.z
      );

      const direction = new THREE.Vector3().subVectors(
        magnetPoint,
        topFaceCenter
      );
      const distance = direction.length();

      if (distance < 0.5) {
        // Only apply the magnetic effect within a certain radius
        const forceMagnitude = MAGNETIC_STRENGTH / (distance * distance); // Inverse square law
        const force = direction.normalize().multiplyScalar(forceMagnitude);

        api.applyForce(force.toArray(), ref.current.position.toArray());
      }
    }
  });
  return { ref, bind };
};
