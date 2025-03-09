import React, { useState } from 'react';
import { Activity, TrendingUp, Heart, Droplet, Scale } from 'lucide-react';

type HealthMetric = {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  icon: React.ReactNode;
  history: { date: string; value: number }[];
};

const HealthTrackerWidget = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([
    {
      id: 'glucose',
      name: 'Blood Glucose',
      value: 95,
      unit: 'mg/dL',
      status: 'normal',
      icon: <Droplet className="h-5 w-5 text-blue-500" />,
      history: [
        { date: '2025-01-15', value: 98 },
        { date: '2025-02-15', value: 102 },
        { date: '2025-03-15', value: 97 },
        { date: '2025-04-15', value: 95 }
      ]
    },
    {
      id: 'bp',
      name: 'Blood Pressure',
      value: 120,
      unit: 'mmHg',
      status: 'normal',
      icon: <Activity className="h-5 w-5 text-red-500" />,
      history: [
        { date: '2025-01-15', value: 125 },
        { date: '2025-02-15', value: 128 },
        { date: '2025-03-15', value: 122 },
        { date: '2025-04-15', value: 120 }
      ]
    },
    {
      id: 'cholesterol',
      name: 'Cholesterol',
      value: 180,
      unit: 'mg/dL',
      status: 'normal',
      icon: <Heart className="h-5 w-5 text-purple-500" />,
      history: [
        { date: '2025-01-15', value: 195 },
        { date: '2025-02-15', value: 190 },
        { date: '2025-03-15', value: 185 },
        { date: '2025-04-15', value: 180 }
      ]
    },
    {
      id: 'weight',
      name: 'Weight',
      value: 72,
      unit: 'kg',
      status: 'normal',
      icon: <Scale className="h-5 w-5 text-green-500" />,
      history: [
        { date: '2025-01-15', value: 75 },
        { date: '2025-02-15', value: 74 },
        { date: '2025-03-15', value: 73 },
        { date: '2025-04-15', value: 72 }
      ]
    }
  ]);

  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [showAddMetric, setShowAddMetric] = useState(false);
  const [newMetricValue, setNewMetricValue] = useState('');

  const handleAddMetricValue = (metricId: string) => {
    if (!newMetricValue) return;
    
    const value = parseFloat(newMetricValue);
    if (isNaN(value)) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    setMetrics(metrics.map(metric => {
      if (metric.id === metricId) {
        // Determine status based on metric type and value
        let status: 'normal' | 'warning' | 'critical' = 'normal';
        
        if (metricId === 'glucose') {
          if (value > 125) status = 'critical';
          else if (value > 100) status = 'warning';
        } else if (metricId === 'bp') {
          if (value > 140) status = 'critical';
          else if (value > 130) status = 'warning';
        } else if (metricId === 'cholesterol') {
          if (value > 240) status = 'critical';
          else if (value > 200) status = 'warning';
        }
        
        return {
          ...metric,
          value,
          status,
          history: [...metric.history, { date: today, value }]
        };
      }
      return metric;
    }));
    
    setNewMetricValue('');
    setSelectedMetric(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Health Tracker</h2>
          <button 
            className="text-blue-600 text-sm font-medium hover:text-blue-800"
            onClick={() => setShowAddMetric(!showAddMetric)}
          >
            {showAddMetric ? 'Cancel' : 'Add Measurement'}
          </button>
        </div>
        
        {showAddMetric && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-blue-800 mb-2">Add New Measurement</h3>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <select 
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedMetric || ''}
                onChange={(e) => setSelectedMetric(e.target.value)}
              >
                <option value="">Select metric</option>
                {metrics.map(metric => (
                  <option key={metric.id} value={metric.id}>{metric.name}</option>
                ))}
              </select>
              <div className="flex">
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter value"
                  value={newMetricValue}
                  onChange={(e) => setNewMetricValue(e.target.value)}
                />
                <span className="inline-flex items-center px-3 border border-l-0 rounded-r-md bg-gray-50 text-gray-500">
                  {selectedMetric ? metrics.find(m => m.id === selectedMetric)?.unit : 'unit'}
                </span>
              </div>
            </div>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={!selectedMetric || !newMetricValue}
              onClick={() => selectedMetric && handleAddMetricValue(selectedMetric)}
            >
              Add Measurement
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(metric => (
            <div key={metric.id} className="border rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                {metric.icon}
                <h3 className="font-medium">{metric.name}</h3>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-gray-500">{metric.unit}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(metric.status)}`}>
                  {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                </span>
              </div>
              <div className="mt-2 flex items-center text-xs text-gray-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>
                  {metric.history.length > 1 
                    ? `${(((metric.value - metric.history[metric.history.length - 2].value) / metric.history[metric.history.length - 2].value) * 100).toFixed(1)}%` 
                    : '0%'} 
                  from last reading
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthTrackerWidget;