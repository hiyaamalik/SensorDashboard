import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Download, Clock, BarChart2, Calendar } from 'lucide-react';
import './Dashboard.css';

// Mock sensor data for demonstration
const generateMockData = () => {
  const now = new Date();
  return {
    timestamp: now.toLocaleTimeString(),
    temperature: Math.random() * 10 + 20, // 20-30°C
    humidity: Math.random() * 30 + 50, // 50-80%
    pressure: Math.random() * 10 + 1010, // 1010-1020 hPa
  };
};

export default function SensorDashboard() {
  const [mode, setMode] = useState('realtime'); // 'realtime' or 'history'
  const [realtimeData, setRealtimeData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState('temperature');
  const [dateRange, setDateRange] = useState({
    startDate: '2025-05-01',
    endDate: '2025-05-07'
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [chartType, setChartType] = useState('line');

  // Simulate real-time data updates
  useEffect(() => {
    if (mode === 'realtime') {
      const interval = setInterval(() => {
        const newData = generateMockData();
        setRealtimeData(prevData => {
          const newDataArray = [...prevData, newData];
          // Keep only the last 20 data points for real-time view
          return newDataArray.length > 20 ? newDataArray.slice(-20) : newDataArray;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [mode]);

  // Simulate fetching historical data
  useEffect(() => {
    if (mode === 'history') {
      // In a real app, this would be an API call with dateRange parameters
      const mockHistoricalData = Array(24).fill().map((_, i) => {
        const hour = i.toString().padStart(2, '0');
        return {
          timestamp: `${dateRange.startDate} ${hour}:00`,
          temperature: Math.random() * 10 + 20,
          humidity: Math.random() * 30 + 50,
          pressure: Math.random() * 10 + 1010,
        };
      });
      
      setHistoryData(mockHistoricalData);
    }
  }, [mode, dateRange]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    
    // Simulate report generation delay
    setTimeout(() => {
      setIsGeneratingReport(false);
      
      // In a real app, this would call an API endpoint to generate and download the report
      alert(`Downloaded report for ${selectedSensor} from ${dateRange.startDate} to ${dateRange.endDate}`);
    }, 1500);
  };

  const currentData = mode === 'realtime' ? realtimeData : historyData;
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Sensor Data Dashboard</h1>
      </header>
      
      {/* Main content */}
      <main className="flex flex-col flex-grow p-4">
        {/* Mode selector */}
        <div className="flex bg-white rounded-lg shadow mb-6">
          <button 
            className={`flex items-center p-4 ${mode === 'realtime' ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-600'}`}
            onClick={() => handleModeChange('realtime')}
          >
            <Clock className="mr-2 h-5 w-5" />
            Real-time Monitoring
          </button>
          <button 
            className={`flex items-center p-4 ${mode === 'history' ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-600'}`}
            onClick={() => handleModeChange('history')}
          >
            <BarChart2 className="mr-2 h-5 w-5" />
            Historical Reports
          </button>
        </div>
        
        {/* Dashboard content based on mode */}
        <div className="bg-white rounded-lg shadow p-6 flex-grow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {mode === 'realtime' ? 'Real-time Sensor Data' : 'Historical Sensor Data'}
            </h2>
            
            {/* Controls based on mode */}
            <div className="flex items-center">
              {/* Sensor selector - shown in both modes */}
              <select 
                className="mr-4 p-2 border rounded"
                value={selectedSensor}
                onChange={(e) => setSelectedSensor(e.target.value)}
              >
                <option value="temperature">Temperature</option>
                <option value="humidity">Humidity</option>
                <option value="pressure">Pressure</option>
              </select>
              
              {/* Mode-specific controls */}
              {mode === 'history' && (
                <>
                  <div className="flex items-center mr-4">
                    <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                    <input 
                      type="date" 
                      className="p-2 border rounded"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                    />
                    <span className="mx-2">to</span>
                    <input 
                      type="date" 
                      className="p-2 border rounded"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                    />
                  </div>
                  <button 
                    className={`flex items-center bg-blue-600 text-white px-4 py-2 rounded ${isGeneratingReport ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={handleGenerateReport}
                    disabled={isGeneratingReport}
                  >
                    {isGeneratingReport ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-5 w-5" />
                        Download Report
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Chart type selector for history mode */}
          {mode === 'history' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type:</label>
              <div className="flex space-x-4">
                <button
                  className={`px-4 py-2 rounded ${chartType === 'line' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                  onClick={() => setChartType('line')}
                >
                  Line Chart
                </button>
                <button
                  className={`px-4 py-2 rounded ${chartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                  onClick={() => setChartType('bar')}
                >
                  Bar Chart
                </button>
              </div>
            </div>
          )}
          
          {/* Chart area */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {(mode === 'realtime' || chartType === 'line') ? (
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={selectedSensor} 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </LineChart>
              ) : (
                <BarChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey={selectedSensor} 
                    fill="#3B82F6" 
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          
          {/* Metrics overview */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 uppercase">Temperature</h3>
              <p className="text-2xl font-semibold">
                {currentData.length ? currentData[currentData.length - 1]?.temperature.toFixed(1) : '--'} °C
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 uppercase">Humidity</h3>
              <p className="text-2xl font-semibold">
                {currentData.length ? currentData[currentData.length - 1]?.humidity.toFixed(1) : '--'} %
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 uppercase">Pressure</h3>
              <p className="text-2xl font-semibold">
                {currentData.length ? currentData[currentData.length - 1]?.pressure.toFixed(1) : '--'} hPa
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>Sensor Dashboard - Demo Version</p>
      </footer>
    </div>
  );
}

{mode === 'realtime' && (
  <div className="realtime-indicator">
    <span className="realtime-indicator-dot"></span>
    Live
  </div>
)}
{/* Chart type selector - shown in both modes */}
<div className="chart-type-selector">
  <button
    className={`chart-type-button ${chartType === 'line' ? 'active' : ''}`}
    onClick={() => setChartType('line')}
  >
    Line Chart
  </button>
  <button
    className={`chart-type-button ${chartType === 'bar' ? 'active' : ''}`}
    onClick={() => setChartType('bar')}
  >
    Bar Chart
  </button>
  <button
    className={`chart-type-button ${chartType === 'area' ? 'active' : ''}`}
    onClick={() => setChartType('area')}
  >
    Area Chart
  </button>
</div>
