import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400">
          Aviator Signal Prediction
        </h1>
        
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 text-center">
          Advanced pattern recognition for Aviator game signals
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-300">
              Prediction Engine
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our advanced algorithm analyzes patterns using moving averages, streak detection, 
              volatility analysis, and weighted recent averages to predict the next likely crash point.
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-300">
              Real-time Dashboard
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              View live signals, historical data, and prediction confidence levels. 
              Filter by time periods and customize your view for optimal decision making.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/login" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 text-center"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 text-center"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
