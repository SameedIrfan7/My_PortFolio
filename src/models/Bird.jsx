import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";

import birdScene from "../assets/3d/bird.glb";

// 3D Model from: https://sketchfab.com/3d-models/phoenix-bird-844ba0cf144a413ea92c779f18912042
export function Bird({
  scale = [0.003, 0.003, 0.003],
  position = [-6, 2, 0],
  speed = 1.2,
  minX = -9,
  maxX = 9,
  ...props
}) {
  const birdRef = useRef();

  const { scene, animations } = useGLTF(birdScene);
  const { actions } = useAnimations(animations, birdRef);

  useEffect(() => {
    if (actions && actions["Take 001"]) {
      actions["Take 001"].play();
    }
  }, [actions]);

  useFrame(({ clock, camera }, delta) => {
    if (!birdRef.current) return;

    birdRef.current.position.y = Math.sin(clock.elapsedTime * 1.8) * 0.35 + position[1];

    const boundMax = camera.position.x + maxX;
    const boundMin = camera.position.x + minX;

    birdRef.current.position.x += speed * delta;
    if (birdRef.current.position.x > boundMax) {
      birdRef.current.position.x = boundMin;
    }
  });

  return (
    <mesh ref={birdRef} position={position} scale={scale} {...props}>
      <primitive object={scene} />
    </mesh>
  );
}

export default Bird;
