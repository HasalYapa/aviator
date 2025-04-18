'use client';

import { useState } from 'react';
import Link from 'next/link';
import SessionCheck from '../../components/SessionCheck';

interface PredictionParameter {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  description: string;
}

export default function Admin() {
  const [parameters, setParameters] = useState<PredictionParameter[]>([
    {
      id: 'movingAvgWindow',
      name: 'Moving Average Window',
      value: 10,
      min: 5,
      max: 50,
      step: 1,
      description: 'Number of recent games to include in the moving average calculation'
    },
    {
      id: 'lowThreshold',
      name: 'Low Multiplier Threshold',
      value: 1.5,
      min: 1.1,
      max: 3.0,
      step: 0.1,
      description: 'Threshold for considering a multiplier as "low" for streak detection'
    },
    {
      id: 'highThreshold',
      name: 'High Multiplier Threshold',
      value: 3.0,
      min: 2.0,
      max: 10.0,
      step: 0.1,
      description: 'Threshold for considering a multiplier as "high" for streak detection'
    },
    {
      id: 'decayFactor',
      name: 'Weighted Average Decay Factor',
      value: 0.9,
      min: 0.5,
      max: 0.99,
      step: 0.01,
      description: 'Decay factor for weighted recent average (higher values give more weight to recent games)'
    },
    {
      id: 'confidenceBase',
      name: 'Base Confidence Level',
      value: 70,
      min: 50,
      max: 90,
      step: 1,
      description: 'Base confidence level for predictions before adjustments'
    }
  ]);

  const [userStats] = useState({
    totalUsers: 1245,
    activeUsers: 876,
    premiumUsers: 342,
    newUsersToday: 28
  });

  const [systemStats] = useState({
    totalPredictions: 45678,
    accurateHits: 34256,
    accuracy: 75,
    avgResponseTime: 0.8
  });

  const handleParameterChange = (id: string, value: number) => {
    setParameters(prevParams =>
      prevParams.map(param =>
        param.id === id ? { ...param, value } : param
      )
    );
  };

  const handleSaveParameters = () => {
    // In a real app, this would save to a database
    alert('Parameters saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <SessionCheck />
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Main Dashboard
            </Link>
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="lg:col-span-1 space-y-8">
            {/* User Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">User Statistics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Users</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{userStats.totalUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Active Users</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{userStats.activeUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Premium Users</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{userStats.premiumUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">New Users Today</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{userStats.newUsersToday}</span>
                </div>
              </div>
            </div>

            {/* System Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">System Performance</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Predictions</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{systemStats.totalPredictions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Accurate Hits</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{systemStats.accurateHits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Accuracy Rate</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{systemStats.accuracy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Avg. Response Time</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{systemStats.avgResponseTime}s</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300">
                  Send System Notification
                </button>
                <button className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300">
                  Export User Data
                </button>
                <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-300">
                  View System Logs
                </button>
                <button className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-300">
                  Reset Prediction Engine
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Prediction Parameters */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Prediction Engine Parameters</h2>

              <div className="space-y-6">
                {parameters.map(param => (
                  <div key={param.id} className="space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor={param.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {param.name}
                      </label>
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {param.value}
                      </span>
                    </div>
                    <input
                      id={param.id}
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={param.value}
                      onChange={(e) => handleParameterChange(param.id, parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {param.description}
                    </p>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleSaveParameters}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
                  >
                    Save Parameters
                  </button>
                </div>
              </div>
            </div>

            {/* Data Upload Section */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Upload Training Data</h2>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      CSV, JSON up to 10MB
                    </p>
                  </div>
                </div>

                <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300">
                  Process Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
