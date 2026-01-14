// components/common/StatCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { hoverScale, rotateHover } from '../../utils/animations';

function StatCard({ icon, title, value, subtitle, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <motion.div
      {...hoverScale}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <motion.div
        {...rotateHover}
        className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center text-2xl mb-4`}
      >
        {icon}
      </motion.div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <motion.p
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-3xl font-bold text-gray-800 mb-1"
      >
        {value}
      </motion.p>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </motion.div>
  );
}

export default StatCard;
