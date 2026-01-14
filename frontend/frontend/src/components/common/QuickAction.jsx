// components/common/QuickAction.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { hoverScale, rotateHover } from '../../utils/animations';

function QuickAction({ icon, label, onClick }) {
  return (
    <motion.button
      {...hoverScale}
      onClick={onClick}
      className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer"
    >
      <motion.span
        {...rotateHover}
        className="text-3xl mb-2"
      >
        {icon}
      </motion.span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </motion.button>
  );
}

export default QuickAction;
