// components/3d/AnimatedCard.jsx
import React, { useRef } from 'react';
import { motion } from 'framer-motion';

// Lazy load 3D components
let useFrame, THREE;

try {
  const r3f = require('@react-three/fiber');
  THREE = require('three');
  useFrame = r3f.useFrame;
} catch (e) {
  console.warn('3D libraries not available:', e);
}

function AnimatedCard3D({ position, rotation, children, hover = true }) {
  if (!useFrame || !THREE) {
    return null;
  }

  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current && hover) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <boxGeometry args={[2, 2, 0.2]} />
      <meshStandardMaterial color="#4F46E5" metalness={0.5} roughness={0.3} />
      {children}
    </mesh>
  );
}

export default AnimatedCard3D;
