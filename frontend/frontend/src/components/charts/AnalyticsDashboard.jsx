// components/charts/AnalyticsDashboard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedLineChart, AnimatedBarChart, AnimatedPieChart } from './AnimatedChart';
import { staggerContainer } from '../../utils/animations';

function AnalyticsDashboard({ data }) {
  return (
    <motion.div
      {...staggerContainer}
      className="space-y-6"
    >
      {data.lineChart && (
        <AnimatedLineChart
          data={data.lineChart.data}
          dataKey={data.lineChart.dataKey}
          nameKey={data.lineChart.nameKey}
          title={data.lineChart.title}
          strokeColor={data.lineChart.color}
        />
      )}
      {data.barChart && (
        <AnimatedBarChart
          data={data.barChart.data}
          dataKey={data.barChart.dataKey}
          nameKey={data.barChart.nameKey}
          title={data.barChart.title}
        />
      )}
      {data.pieChart && (
        <AnimatedPieChart
          data={data.pieChart.data}
          dataKey={data.pieChart.dataKey}
          nameKey={data.pieChart.nameKey}
          title={data.pieChart.title}
        />
      )}
    </motion.div>
  );
}

export default AnalyticsDashboard;
