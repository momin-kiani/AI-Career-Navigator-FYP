// components/3d/AnimatedStatCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { hoverScale, fadeIn } from '../../utils/animations';

function AnimatedStatCard({ icon, title, value, subtitle, gradient, delay = 0 }) {
  return (
    <motion.div
      {...fadeIn}
      transition={{ duration: 0.4, delay }}
      {...hoverScale}
      className={`bg-gradient-to-br ${gradient} rounded-xl shadow-lg p-6 text-white relative overflow-hidden`}
    >
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="absolute top-4 right-4 text-4xl opacity-20"
      >
        {icon}
      </motion.div>
      <div className="relative z-10">
        <h3 className="text-sm font-semibold mb-2 opacity-90">{title}</h3>
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: "spring" }}
          className="text-3xl font-bold mb-1"
        >
          {value}
        </motion.p>
        {subtitle && <p className="text-sm opacity-75">{subtitle}</p>}
      </div>
    </motion.div>
  );
}

export default AnimatedStatCard;
