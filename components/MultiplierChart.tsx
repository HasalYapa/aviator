'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { GameData, roundsToGameData } from '../lib/predictionEngine';
import { getRoundsForPeriod, subscribeToRounds } from '../lib/services/roundsService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MultiplierChartProps {
  period: '5m' | '15m' | '1h' | '24h';
}

export default function MultiplierChart({ period }: MultiplierChartProps) {
  const [chartData, setChartData] = useState<GameData[]>([]);

  useEffect(() => {
    // Get data for the selected time period
    const fetchData = async () => {
      const rounds = await getRoundsForPeriod(period);
      const gameData = roundsToGameData(rounds);
      setChartData(gameData);
    };

    fetchData();

    // Subscribe to new rounds
    const subscription = subscribeToRounds((_payload) => {
      // When a new round is added, refresh the data
      fetchData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [period]);

  // Format the data for Chart.js
  const data = {
    labels: chartData.map(game => {
      const date = new Date(typeof game.timestamp === 'string' ? game.timestamp : game.timestamp);
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }),
    datasets: [
      {
        label: 'Multiplier',
        data: chartData.map(game => game.multiplier),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Multiplier History (${period})`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return value + 'x';
          }
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
}
