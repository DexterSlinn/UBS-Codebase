import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Metric Card Component
const MetricCard = React.memo(({ title, value, subtitle, trend, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  const trendIcon = trend > 0 ? '↗' : trend < 0 ? '↘' : '→';
  const trendColor = trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500';

  return (
    <div className={`p-6 rounded-lg border-2 ${colorClasses[color]} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon && <div className="text-2xl">{icon}</div>}
          <div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center space-x-1 ${trendColor}`}>
            <span className="text-lg">{trendIcon}</span>
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );
});

// Real-time Chart Component
const RealTimeChart = React.memo(({ data, title, type = 'line', height = 300 }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: type === 'line' ? {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    } : {},
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    }
  };

  const ChartComponent = type === 'line' ? Line : type === 'bar' ? Bar : Doughnut;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div style={{ height }}>
        <ChartComponent data={data} options={chartOptions} />
      </div>
    </div>
  );
});

// System Health Indicator
const SystemHealthIndicator = React.memo(({ health }) => {
  const getHealthColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getHealthText = (status) => {
    switch (status) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'warning': return 'Warning';
      case 'critical': return 'Critical';
      default: return 'Unknown';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
      <div className="flex items-center space-x-4">
        <div className={`w-4 h-4 rounded-full ${getHealthColor(health.overall)} animate-pulse`}></div>
        <div>
          <p className="text-xl font-bold text-gray-900">{getHealthText(health.overall)}</p>
          <p className="text-sm text-gray-500">Overall system status</p>
        </div>
      </div>
      
      <div className="mt-6 space-y-3">
        {Object.entries(health.components || {}).map(([component, status]) => (
          <div key={component} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 capitalize">{component}</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getHealthColor(status)}`}></div>
              <span className="text-sm text-gray-600">{getHealthText(status)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// Alert Component
const AlertPanel = React.memo(({ alerts }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      default: return '📢';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      case 'success': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">✨</div>
          <p className="text-gray-500">No alerts - system running smoothly</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {alerts.map((alert, index) => (
          <div key={index} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
            <div className="flex items-start space-x-3">
              <span className="text-lg">{getAlertIcon(alert.type)}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{alert.title}</p>
                <p className="text-sm text-gray-600">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// Main Performance Dashboard Component
const PerformanceDashboard = ({ isVisible, onClose }) => {
  const [metrics, setMetrics] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  // Fetch current metrics
  const fetchMetrics = useCallback(async () => {
    if (!isVisible) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
        
        // Add to historical data
        setHistoricalData(prev => {
          const newData = [...prev, {
            timestamp: new Date().toLocaleTimeString(),
            responseTime: data.averageResponseTime,
            requests: data.totalRequests,
            errors: data.errorCount
          }];
          // Keep only last 20 data points
          return newData.slice(-20);
        });
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  }, [isVisible]);

  // Auto-refresh effect
  useEffect(() => {
    if (isVisible && autoRefresh) {
      fetchMetrics();
      const interval = setInterval(fetchMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [isVisible, autoRefresh, refreshInterval, fetchMetrics]);

  // Chart data preparation
  const responseTimeChartData = useMemo(() => ({
    labels: historicalData.map(d => d.timestamp),
    datasets: [
      {
        label: 'Response Time (ms)',
        data: historicalData.map(d => d.responseTime),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }), [historicalData]);

  const requestsChartData = useMemo(() => ({
    labels: historicalData.map(d => d.timestamp),
    datasets: [
      {
        label: 'Total Requests',
        data: historicalData.map(d => d.requests),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  }), [historicalData]);

  const systemHealthData = useMemo(() => {
    if (!metrics) return { overall: 'unknown', components: {} };
    
    const errorRate = parseFloat(metrics.errorRate) || 0;
    const responseTime = metrics.averageResponseTime || 0;
    
    let overall = 'excellent';
    if (errorRate > 5 || responseTime > 2000) overall = 'critical';
    else if (errorRate > 2 || responseTime > 1000) overall = 'warning';
    else if (errorRate > 0 || responseTime > 500) overall = 'good';
    
    return {
      overall,
      components: {
        'api': errorRate < 1 ? 'excellent' : errorRate < 5 ? 'good' : 'warning',
        'database': responseTime < 500 ? 'excellent' : responseTime < 1000 ? 'good' : 'warning',
        'search': metrics.searchRequests > 0 ? 'excellent' : 'good',
        'memory': metrics.system?.memoryUsage ? 'good' : 'unknown'
      }
    };
  }, [metrics]);

  const mockAlerts = useMemo(() => {
    if (!metrics) return [];
    
    const alerts = [];
    const errorRate = parseFloat(metrics.errorRate) || 0;
    
    if (errorRate > 5) {
      alerts.push({
        type: 'error',
        title: 'High Error Rate',
        message: `Error rate is ${metrics.errorRate}, which exceeds the 5% threshold`,
        timestamp: new Date().toLocaleString()
      });
    }
    
    if (metrics.averageResponseTime > 1000) {
      alerts.push({
        type: 'warning',
        title: 'Slow Response Time',
        message: `Average response time is ${metrics.averageResponseTime}ms`,
        timestamp: new Date().toLocaleString()
      });
    }
    
    return alerts;
  }, [metrics]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-lg w-full max-w-7xl h-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Performance Dashboard</h2>
            <p className="text-gray-600">Real-time system monitoring and analytics</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Auto-refresh:</label>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  autoRefresh 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {autoRefresh ? 'ON' : 'OFF'}
              </button>
            </div>
            
            <button
              onClick={fetchMetrics}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && !metrics ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : metrics ? (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Requests"
                  value={metrics.totalRequests.toLocaleString()}
                  icon="📊"
                  color="blue"
                />
                <MetricCard
                  title="Search Requests"
                  value={metrics.searchRequests.toLocaleString()}
                  subtitle={`${((metrics.searchRequests / metrics.totalRequests) * 100).toFixed(1)}% of total`}
                  icon="🔍"
                  color="green"
                />
                <MetricCard
                  title="Avg Response Time"
                  value={`${metrics.averageResponseTime}ms`}
                  icon="⚡"
                  color="yellow"
                />
                <MetricCard
                  title="Error Rate"
                  value={metrics.errorRate}
                  subtitle={`${metrics.errorCount} errors`}
                  icon="🚨"
                  color="red"
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RealTimeChart
                  data={responseTimeChartData}
                  title="Response Time Trend"
                  type="line"
                />
                <RealTimeChart
                  data={requestsChartData}
                  title="Request Volume"
                  type="bar"
                />
              </div>

              {/* System Health and Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SystemHealthIndicator health={systemHealthData} />
                <AlertPanel alerts={mockAlerts} />
              </div>

              {/* System Information */}
              {metrics.system && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{metrics.system.uptime}</div>
                      <div className="text-sm text-gray-600">Uptime</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{metrics.system.memoryUsage.heapUsed}</div>
                      <div className="text-sm text-gray-600">Memory Used</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{metrics.system.nodeVersion}</div>
                      <div className="text-sm text-gray-600">Node Version</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 capitalize">{metrics.system.platform}</div>
                      <div className="text-sm text-gray-600">Platform</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-600 mb-4">Unable to fetch performance metrics</p>
              <button
                onClick={fetchMetrics}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
export { MetricCard, RealTimeChart, SystemHealthIndicator, AlertPanel };