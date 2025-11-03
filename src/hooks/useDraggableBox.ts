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
  onStick?: () => void; // optional callback for LEGO click sound
};

// LEGO grid settings
const GRID = 0.8; // adjust to your LEGO stud spacing

const alignToGrid = (v: number) => Math.round(v / GRID) * GRID;

const snapRotation = (r: number) => {
  const step = Math.PI / 2; // 90°
  return Math.round(r / step) * step;
};

export const useDraggableBox = (props: UseDraggableBoxProps) => {
  const {
    mass = 0.025,
    friction = 10,
    restitution = 0,
    proportions = [1, 1, 1],
  } = props;

  const { size, viewport, camera } = useThree();
  const aspect = size.width / viewport.width;

  const [isDragging, setIsDragging] = useState(false);
  const [ref, api] = useBox(() => ({
    args: proportions,
    mass,
    friction,
    restitution,
    onCollide: (e) => {
      props.onCollide?.(e);
      handleStick(e);
    }
  }));

  const [[xd, yd], setDragPosition] = useState<[number, number]>([0, 0]);

  const handleStick = (e: CollideEvent) => {
    if (!ref.current) return;
    if (isDragging) return; // no sticking while dragging

    const impact = e.contact.impactVelocity ?? 0;
    if (impact > 1.5) return; // only gentle landings stick

    // check top-bottom collision (normal points mostly vertical)
    const normalY = Math.abs(e.contact.ni[1]);
    if (normalY < 0.8) return;

    const self = ref.current.position;
    const otherPos = e.body.position;
    if (!otherPos) return;

    // check vertical stacking
    const selfHalfY = proportions[1] / 2;
    const otherHalfY = e.body.shapes?.[0]?.halfExtents?.y ?? selfHalfY;
    const targetY = otherPos.y + otherHalfY + selfHalfY;

    // Snap X/Z to grid & rotation to 90°
    const snappedX = alignToGrid(self.x);
    const snappedZ = alignToGrid(self.z);
    const snappedRot = snapRotation(ref.current.rotation.y);

    // Freeze brick on spot
    api.position.set(snappedX, targetY, snappedZ);
    api.rotation.set(0, snappedRot, 0);
    api.velocity.set(0, 0, 0);
    api.angularVelocity.set(0, 0, 0);
    api.mass.set(0); // now it sticks (becomes static)

    props.onStick?.(); // play click sound or whatever
  };

  const bind = useGesture({
    onDragStart: () => {
      setIsDragging(true);
      api.mass.set(0); // temporarily static while dragging
      api.rotation.set(0, ref.current?.rotation.y ?? 0, 0);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
    },

    onDrag: ({ offset: [x, y] }) => {
      if (!ref.current || !isDragging) return;

      const forward = new Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
      const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

      const dragOffset = new Vector3()
        .add(forward.multiplyScalar(-y / aspect))
        .add(right.multiplyScalar(x / aspect));

      api.position.set(
        ref.current.position.x + dragOffset.x,
        ref.current.position.y + dragOffset.y,
        ref.current.position.z + dragOffset.z
      );

      setDragPosition([ref.current.position.x, ref.current.position.y]);
    },

    onDragEnd: () => {
      setIsDragging(false);
      api.mass.set(mass); // enable physics again unless it sticks
    },
  });

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (!ref.current || !isDragging) return;

      switch (event.key.toLowerCase()) {
        case "a":
          api.rotation.set(0, (ref.current.rotation.y -= 0.1), 0);
          break;
        case "d":
          api.rotation.set(0, (ref.current.rotation.y += 0.1), 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [ref, isDragging, xd, yd]);

  return { ref, api, bind, isDragging };
};
