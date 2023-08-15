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

  const { ref, bind } = useDraggableBox({
    ...props,
    onCollide: (e) => {
      playAudio(e);
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
