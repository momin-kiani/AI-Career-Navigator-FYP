// components/charts/ProgressChart.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedPieChart, AnimatedBarChart } from './AnimatedChart';

function ProgressChart({ progressData }) {
  const chartData = progressData.map(module => ({
    name: module.moduleName,
    value: module.progressPercentage
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AnimatedPieChart
        data={chartData}
        dataKey="value"
        nameKey="name"
        title="Module Progress Distribution"
      />
      <AnimatedBarChart
        data={chartData}
        dataKey="value"
        nameKey="name"
        title="Progress by Module"
      />
    </div>
  );
}

export default ProgressChart;
