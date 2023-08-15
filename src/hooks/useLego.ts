import * as THREE from "three";
import { useState, useEffect, useMemo } from "react";
import { useDraggableBox, UseDraggableBoxProps } from "./useDraggableBox";
import { useFrame } from "@react-three/fiber";
import { debounce } from "lodash";
import { CollideEvent } from "@react-three/cannon";

type UseLegoProps = UseDraggableBoxProps & {
  soundOn?: boolean;
};

export const useLego = (props: UseLegoProps) => {
  const [connected, setConnected] = useState(false);

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

  const magnetPoint = new THREE.Vector3(0, 5, 0);

  useFrame(() => {
    if (ref.current && !isDragging && props.proportions) {
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

      if (distance < 0.5 && !connected) {
        api.position.set(
          ref.current.position.x,
          magnetPoint.y - boxSizeY / 2,
          ref.current.position.z
        );
        setConnected(true); // Connect the bricks
      }

      // If bricks are connected, move them together
      if (connected) {
        api.position.set(
          ref.current.position.x,
          magnetPoint.y - boxSizeY / 2,
          ref.current.position.z
        );
      }

      if (isDragging && connected) {
        const distanceAfterDrag = topFaceCenter.distanceTo(magnetPoint);

        if (distanceAfterDrag > 0.7) {
          setConnected(false);
        }
      }
    }
  });

  return { ref, bind };
};
