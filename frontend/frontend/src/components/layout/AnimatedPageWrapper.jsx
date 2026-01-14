// components/layout/AnimatedPageWrapper.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function AnimatedPageWrapper({ children }) {
  return (
    <motion.div
      {...pageTransition}
      className="flex-1 overflow-auto"
    >
      {children}
    </motion.div>
  );
}

export default AnimatedPageWrapper;
