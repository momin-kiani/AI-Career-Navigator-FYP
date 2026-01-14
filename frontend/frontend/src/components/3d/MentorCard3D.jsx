// components/3d/MentorCard3D.jsx
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

function MentorCard3D({ mentor, position, onClick }) {
  if (!useFrame || !THREE) {
    return null;
  }

  const meshRef = useRef();
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      if (hovered) {
        meshRef.current.rotation.y += 0.05;
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.rotation.y += 0.01;
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <mesh>
        <boxGeometry args={[1.5, 2, 0.2]} />
        <meshStandardMaterial
          color={hovered ? '#10B981' : '#4F46E5'}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

export default MentorCard3D;
