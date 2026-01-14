// components/3d/CareerPath3D.jsx
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import ErrorBoundary3D from './ErrorBoundary3D';

// Lazy load 3D components
let useFrame, Text, Line, THREE, Canvas;

// Create a no-op useFrame that can always be called
const noOpUseFrame = () => {};

try {
  const r3f = require('@react-three/fiber');
  const drei = require('@react-three/drei');
  THREE = require('three');
  useFrame = r3f.useFrame;
  Canvas = r3f.Canvas;
  Text = drei.Text;
  Line = drei.Line;
} catch (e) {
  console.warn('3D libraries not available:', e);
  useFrame = noOpUseFrame;
}

function CareerNode3D({ career, position, index, total }) {
  // Hooks must be called unconditionally at the top level
  const meshRef = useRef();

  // Always call useFrame (it's a no-op if libraries aren't available)
  useFrame((state) => {
    if (meshRef.current && state) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.2;
    }
  });

  // Early return after all hooks
  if (!Text) {
    return null;
  }

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={index === 0 ? '#10B981' : '#4F46E5'}
          emissive={index === 0 ? '#10B981' : '#4F46E5'}
          emissiveIntensity={0.5}
        />
      </mesh>
      {Text && (
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {career.title}
        </Text>
      )}
    </group>
  );
}

function CareerPath3D({ careers = [] }) {
  // Fallback 2D view if 3D is not available
  if (!Canvas || !Line) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Career Path</h3>
        <div className="space-y-3">
          {careers.map((career, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                index === 0 ? 'bg-green-500' : 'bg-blue-500'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">{career.title || career}</h4>
                {career.description && (
                  <p className="text-sm text-gray-600">{career.description}</p>
                )}
              </div>
              {index < careers.length - 1 && (
                <div className="text-gray-400">↓</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const points = careers.map((_, index) => {
    const angle = (index / Math.max(careers.length - 1, 1)) * Math.PI;
    const radius = 3;
    return [
      Math.cos(angle) * radius,
      index * 0.5,
      Math.sin(angle) * radius
    ];
  });

  return (
    <ErrorBoundary3D
      fallback={
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Career Path</h3>
          <div className="space-y-3">
            {careers.map((career, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-green-500' : 'bg-blue-500'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{career.title || career}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <group>
          {careers.map((career, index) => (
            <CareerNode3D
              key={index}
              career={career}
              position={points[index]}
              index={index}
              total={careers.length}
            />
          ))}
          {points.length > 1 && Line && (
            <Line
              points={points}
              color="#4F46E5"
              lineWidth={2}
            />
          )}
        </group>
      </Canvas>
    </ErrorBoundary3D>
  );
}

export default CareerPath3D;
