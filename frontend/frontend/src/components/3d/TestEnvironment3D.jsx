// components/3d/TestEnvironment3D.jsx
import React, { useRef, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import ErrorBoundary3D from './ErrorBoundary3D';

// Lazy load 3D components to handle React 19 compatibility
let Canvas, useFrame, OrbitControls, Text, Box, Sphere, THREE;

// Create a no-op useFrame that can always be called
const noOpUseFrame = () => {};

try {
  const r3f = require('@react-three/fiber');
  const drei = require('@react-three/drei');
  THREE = require('three');
  Canvas = r3f.Canvas;
  useFrame = r3f.useFrame;
  OrbitControls = drei.OrbitControls;
  Text = drei.Text;
  Box = drei.Box;
  Sphere = drei.Sphere;
} catch (e) {
  console.warn('3D libraries not available:', e);
  useFrame = noOpUseFrame;
}

function QuestionCard3D({ questionNumber, totalQuestions, position }) {
  // Hooks must be called unconditionally at the top level
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Always call useFrame (it's a no-op if libraries aren't available)
  useFrame((state) => {
    if (meshRef.current && THREE && state) {
      meshRef.current.rotation.y += 0.01;
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  // Early return after all hooks
  if (!Box || !Text || !Sphere || !THREE) {
    return null;
  }

  const progress = questionNumber / totalQuestions;

  return (
    <group ref={meshRef} position={position}>
      <Box
        args={[2, 1, 0.2]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? '#10B981' : '#4F46E5'}
          metalness={0.5}
          roughness={0.3}
        />
      </Box>
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Q{questionNumber}
      </Text>
      <Sphere args={[0.1, 16, 16]} position={[0, -0.6, 0]}>
        <meshStandardMaterial
          color={progress > 0.5 ? '#10B981' : '#F59E0B'}
          emissive={progress > 0.5 ? '#10B981' : '#F59E0B'}
          emissiveIntensity={0.5}
        />
      </Sphere>
    </group>
  );
}

function Timer3D({ timeRemaining, position }) {
  // Hooks must be called unconditionally at the top level
  const meshRef = useRef();
  const [color, setColor] = useState('#4F46E5');

  // Always call useFrame (it's a no-op if libraries aren't available)
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      if (timeRemaining < 300) {
        setColor('#EF4444');
      } else if (timeRemaining < 600) {
        setColor('#F59E0B');
      }
    }
  });

  // Early return after all hooks
  if (!Sphere || !Text) {
    return null;
  }

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <group ref={meshRef} position={position}>
      <Sphere args={[0.5, 32, 32]}>
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </Sphere>
      <Text
        position={[0, 0, 0.6]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {minutes}:{seconds.toString().padStart(2, '0')}
      </Text>
    </group>
  );
}

function TestEnvironment3D({ questions = [], currentQuestion = 0, timeRemaining = null }) {
  // Fallback 2D view if 3D is not available
  if (!Canvas || !OrbitControls || !Text) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-purple-900 to-blue-900 p-8"
      >
        <div className="flex flex-col items-center justify-center h-full text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Test Progress</h3>
            <p className="text-lg opacity-75">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          
          <div className="w-full max-w-md mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
                className="bg-white h-4 rounded-full"
              />
            </div>
          </div>

          {timeRemaining !== null && (
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                timeRemaining < 300 ? 'text-red-300' : timeRemaining < 600 ? 'text-yellow-300' : 'text-white'
              }`}>
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
              <p className="text-sm opacity-75">Time Remaining</p>
            </div>
          )}

          <div className="mt-8 flex gap-2 flex-wrap justify-center">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition ${
                  index === currentQuestion
                    ? 'bg-white text-purple-900 scale-110'
                    : index < currentQuestion
                    ? 'bg-green-500 text-white'
                    : 'bg-white/20 text-white'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // 3D view if available
  return (
    <ErrorBoundary3D
      fallback={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-purple-900 to-blue-900 p-8"
        >
          <div className="flex flex-col items-center justify-center h-full text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Test Progress</h3>
              <p className="text-lg opacity-75">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
            {timeRemaining !== null && (
              <div className="text-4xl font-bold">
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>
        </motion.div>
      }
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-purple-900 to-blue-900"
      >
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading 3D...</div>}>
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} />
            {OrbitControls && <OrbitControls enableZoom={false} enablePan={false} />}

            {questions.map((_, index) => {
              const angle = (index / questions.length) * Math.PI * 2;
              const radius = 3;
              const x = Math.cos(angle) * radius;
              const z = Math.sin(angle) * radius;
              const y = (index - currentQuestion) * 0.5;

              return (
                <QuestionCard3D
                  key={index}
                  questionNumber={index + 1}
                  totalQuestions={questions.length}
                  position={[x, y, z]}
                />
              );
            })}

            {timeRemaining !== null && (
              <Timer3D timeRemaining={timeRemaining} position={[0, 3, 0]} />
            )}

            {Text && (
              <Text
                position={[0, -3, 0]}
                fontSize={0.4}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                Progress: {currentQuestion + 1}/{questions.length}
              </Text>
            )}
          </Canvas>
        </Suspense>
      </motion.div>
    </ErrorBoundary3D>
  );
}

export default TestEnvironment3D;
