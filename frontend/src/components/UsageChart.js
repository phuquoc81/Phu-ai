import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CHART_COLORS = {
  primary: 'rgba(99, 102, 241, 1)',
  primaryLight: 'rgba(99, 102, 241, 0.15)',
  secondary: 'rgba(16, 185, 129, 1)',
  secondaryLight: 'rgba(16, 185, 129, 0.15)',
};

const baseOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: {
      display: !!title,
      text: title,
      font: { size: 13, weight: '600' },
      color: '#374151',
    },
    tooltip: {
      backgroundColor: '#1e1b4b',
      titleColor: '#e0e7ff',
      bodyColor: '#c7d2fe',
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#9ca3af', font: { size: 11 } },
    },
    y: {
      grid: { color: '#f3f4f6' },
      ticks: { color: '#9ca3af', font: { size: 11 } },
      beginAtZero: true,
    },
  },
});

/**
 * UsageChart — renders either a Bar or Line chart.
 *
 * Props:
 *   type      {'bar'|'line'}
 *   labels    {string[]}
 *   datasets  {{ label, data, color? }[]}
 *   title     {string}
 *   height    {number}   container height in px (default 220)
 */
export default function UsageChart({ type = 'bar', labels = [], datasets = [], title, height = 220 }) {
  const chartData = {
    labels,
    datasets: datasets.map((ds, i) => {
      const color = ds.color || (i === 0 ? CHART_COLORS.primary : CHART_COLORS.secondary);
      const lightColor = ds.color
        ? ds.color.replace('1)', '0.15)')
        : i === 0
        ? CHART_COLORS.primaryLight
        : CHART_COLORS.secondaryLight;

      return {
        label: ds.label,
        data: ds.data,
        backgroundColor: type === 'line' ? lightColor : color,
        borderColor: color,
        borderWidth: 2,
        borderRadius: type === 'bar' ? 6 : 0,
        fill: type === 'line',
        tension: 0.4,
        pointBackgroundColor: color,
        pointRadius: type === 'line' ? 4 : 0,
        pointHoverRadius: 6,
      };
    }),
  };

  const options = baseOptions(title);

  return (
    <div style={{ height }}>
      {type === 'line' ? (
        <Line data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
}
