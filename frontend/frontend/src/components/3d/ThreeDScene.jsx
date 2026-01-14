// components/3d/ThreeDScene.jsx
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import ErrorBoundary3D from './ErrorBoundary3D';

// Lazy load 3D components
let Canvas, OrbitControls, PerspectiveCamera, Environment;

try {
  const r3f = require('@react-three/fiber');
  const drei = require('@react-three/drei');
  Canvas = r3f.Canvas;
  OrbitControls = drei.OrbitControls;
  PerspectiveCamera = drei.PerspectiveCamera;
  Environment = drei.Environment;
} catch (e) {
  console.warn('3D libraries not available:', e);
}

function ThreeDScene({ children, cameraPosition = [0, 0, 5] }) {
  if (!Canvas) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg"
      >
        <div className="text-center text-gray-600">
          <p>3D visualization unavailable</p>
          <p className="text-sm mt-2">Using 2D fallback</p>
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
          transition={{ duration: 0.5 }}
          className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg"
        >
          <div className="text-center text-gray-600">
            <p>3D visualization unavailable</p>
            <p className="text-sm mt-2">Using 2D fallback</p>
          </div>
        </motion.div>
      }
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        <Canvas>
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading 3D...</div>}>
            {PerspectiveCamera && <PerspectiveCamera makeDefault position={cameraPosition} />}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} />
            {OrbitControls && <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />}
            {Environment && <Environment preset="sunset" />}
            {children}
          </Suspense>
        </Canvas>
      </motion.div>
    </ErrorBoundary3D>
  );
}

export default ThreeDScene;
