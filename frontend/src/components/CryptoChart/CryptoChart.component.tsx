import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns'; 

// Register the necessary components
ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Component
interface CryptoChartProps {
  rawData: {
    Data: {
      time: number;
      close: number;
    }[];
  };
}

export const CryptoChart: React.FC<CryptoChartProps> = ({ rawData }) => {
  // Safeguard for undefined or missing `rawData.Data`
  const dataEntries = rawData?.Data || [];

  const chartData = {
    labels: dataEntries.map((entry) => new Date(entry.time * 1000)), // Convert UNIX to JS Date
    datasets: [
      {
        label: 'Close Price',
        data: dataEntries.map((entry) => entry.close), // Use 'close' values
        borderColor: 'rgba(75, 192, 192, 1)', // Customize line color
        fill: true,
      },
    ],
  };

  const options: any = {
    responsive: true,
    scales: {
      x: {
        type: 'time' as const, // Ensure the type matches what Chart.js expects
        time: {
          unit: 'day', // Or 'hour', 'minute', etc., depending on your data
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

