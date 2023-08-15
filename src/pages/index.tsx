import { Physics } from "@react-three/cannon";
import { Canvas } from "@react-three/fiber";
import React from "react";

import { useLegos } from "../hooks/useLegos";
import { Ground } from "../components/Ground";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Scene({ isPaused = false }): JSX.Element {
  const { legos } = useLegos();

  return (
    <>
      <Physics gravity={[0, -9.81, 0]} isPaused={isPaused}>
        <directionalLight
          castShadow
          intensity={2}
          position={[0, 20, 0]}
          rotation={[0, 0, 0.2]}
          shadow-mapSize-width={2048} // Increase resolution of the shadow
          shadow-mapSize-height={2048} // Increase resolution of the shadow
          shadow-camera-left={-500} // Adjust the boundaries of the shadow frustum
          shadow-camera-right={500} // Adjust the boundaries of the shadow frustum
          shadow-camera-top={500} // Adjust the boundaries of the shadow frustum
          shadow-camera-bottom={-500} // Adjust the boundaries of the shadow frustum
        />
        {/* <Debug color="black" scale={1}> */}
        <Ground
          position={[0, -5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          color="#101010"
        />

        {legos.map((lego, index) => (
          <React.Fragment key={index}>{lego}</React.Fragment>
        ))}
        {/* </Debug> */}
      </Physics>

      <ambientLight intensity={1} />
      <OrbitControls
        enableRotate={true}
        mouseButtons={{
          MIDDLE: THREE.MOUSE.PAN,
          RIGHT: THREE.MOUSE.ROTATE,
        }}
      />
    </>
  );
}

export default function MainScreen() {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Canvas camera={{ fov: 70, position: [0, 0, 15] }} shadows>
        <Scene />
      </Canvas>
    </div>
  );
}
