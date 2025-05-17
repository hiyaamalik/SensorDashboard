import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  const [chartType, setChartType] = useState('line'); // 'line', 'bar', or 'area'

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
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Sensor Data Dashboard</h1>
      </header>
      
      {/* Main content */}
      <main className="dashboard-main">
        {/* Mode selector */}
        <div className="mode-selector">
          <div className="mode-selector-container">
            <button 
              className={`mode-button ${mode === 'realtime' ? 'active' : ''}`}
              onClick={() => handleModeChange('realtime')}
            >
              <Clock className="icon" />
              Real-time Monitoring
            </button>
            <button 
              className={`mode-button ${mode === 'history' ? 'active' : ''}`}
              onClick={() => handleModeChange('history')}
            >
              <BarChart2 className="icon" />
              Historical Reports
            </button>
          </div>
        </div>
        
        {/* Dashboard content */}
        <div className="dashboard-content">
          <div className="control-panel">
            <div className="control-group">
              <h2 className="dashboard-section-title">
                {mode === 'realtime' ? 'Real-time Sensor Data' : 'Historical Sensor Data'}
              </h2>
              {mode === 'realtime' && (
                <div className="realtime-indicator">
                  <span className="realtime-indicator-dot"></span>
                  Live
                </div>
              )}
            </div>
            
            <div className="control-group">
              {/* Sensor selector */}
              <select 
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
                  <div className="date-range-selector">
                    <Calendar className="icon" />
                    <input 
                      type="date" 
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                    />
                    <span>to</span>
                    <input 
                      type="date" 
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                    />
                  </div>
                  <button 
                    className={`button button-primary ${isGeneratingReport ? 'loading' : ''}`}
                    onClick={handleGenerateReport}
                    disabled={isGeneratingReport}
                  >
                    {isGeneratingReport ? (
                      <>
                        <span className="loading-spinner"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="icon" />
                        Download Report
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Chart type selector */}
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
          
          {/* Chart area */}
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
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
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              ) : chartType === 'bar' ? (
                <BarChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey={selectedSensor} 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              ) : (
                <AreaChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey={selectedSensor} 
                    stroke="#3B82F6" 
                    fill="#3B82F6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
          
          {/* Metrics overview */}
          <div className="metrics-grid">
            <div className="metric-card temperature-card">
              <h3 className="metric-title">Temperature</h3>
              <p className="metric-value">
                {currentData.length ? currentData[currentData.length - 1]?.temperature.toFixed(1) : '--'}
              </p>
              <p className="metric-unit">°C</p>
            </div>
            <div className="metric-card humidity-card">
              <h3 className="metric-title">Humidity</h3>
              <p className="metric-value">
                {currentData.length ? currentData[currentData.length - 1]?.humidity.toFixed(1) : '--'}
              </p>
              <p className="metric-unit">%</p>
            </div>
            <div className="metric-card pressure-card">
              <h3 className="metric-title">Pressure</h3>
              <p className="metric-value">
                {currentData.length ? currentData[currentData.length - 1]?.pressure.toFixed(1) : '--'}
              </p>
              <p className="metric-unit">hPa</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="dashboard-footer">
        <p>Sensor Dashboard - Demo Version</p>
      </footer>
    </div>
  );
}