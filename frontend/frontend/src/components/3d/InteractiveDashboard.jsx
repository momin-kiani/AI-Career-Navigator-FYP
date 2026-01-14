// components/3d/InteractiveDashboard.jsx
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import ErrorBoundary3D from './ErrorBoundary3D';

// Lazy load 3D components
let Canvas, useFrame, OrbitControls, Text, Box, THREE;

try {
  const r3f = require('@react-three/fiber');
  const drei = require('@react-three/drei');
  THREE = require('three');
  Canvas = r3f.Canvas;
  useFrame = r3f.useFrame;
  OrbitControls = drei.OrbitControls;
  Text = drei.Text;
  Box = drei.Box;
} catch (e) {
  console.warn('3D libraries not available:', e);
}

function StatCube3D({ value, label, position, color = '#4F46E5' }) {
  if (!useFrame || !Box || !Text) {
    return null;
  }

  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <Box args={[1, 1, 1]}>
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </Box>
      {Text && (
        <>
          <Text
            position={[0, 0, 0.6]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {value}
          </Text>
          <Text
            position={[0, -0.7, 0.6]}
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        </>
      )}
    </group>
  );
}

function InteractiveDashboard({ stats = [] }) {
  // Fallback 2D view if 3D is not available
  if (!Canvas || !OrbitControls || !Text) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full rounded-xl overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 p-8"
      >
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Dashboard Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center"
                style={{ borderColor: colors[index % colors.length] }}
              >
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <ErrorBoundary3D
      fallback={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full rounded-xl overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Dashboard Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      }
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900"
      >
        <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          {OrbitControls && <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />}

          {stats.map((stat, index) => {
            const angle = (index / stats.length) * Math.PI * 2;
            const radius = 3;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

            return (
              <StatCube3D
                key={index}
                value={stat.value}
                label={stat.label}
                position={[x, 0, z]}
                color={colors[index % colors.length]}
              />
            );
          })}

          {Text && (
            <Text
              position={[0, 3, 0]}
              fontSize={0.5}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              Dashboard Overview
            </Text>
          )}
        </Canvas>
      </motion.div>
    </ErrorBoundary3D>
  );
}

export default InteractiveDashboard;
