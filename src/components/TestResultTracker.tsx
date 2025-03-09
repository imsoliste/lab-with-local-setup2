import React, { useState } from 'react';
import { LineChart, Activity, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from './ui/button';

type TestResult = {
  id: number;
  testName: string;
  date: string;
  value: number;
  unit: string;
  normalRange: {
    min: number;
    max: number;
  };
  labName: string;
};

const TestResultTracker = () => {
  const [results, setResults] = useState<TestResult[]>([
    {
      id: 1,
      testName: 'Blood Glucose (Fasting)',
      date: '2025-03-15',
      value: 95,
      unit: 'mg/dL',
      normalRange: { min: 70, max: 100 },
      labName: 'Pathkind Labs'
    },
    {
      id: 2,
      testName: 'Blood Glucose (Fasting)',
      date: '2025-02-15',
      value: 102,
      unit: 'mg/dL',
      normalRange: { min: 70, max: 100 },
      labName: 'Dr. Lal PathLabs'
    }
  ]);

  const getStatusColor = (value: number, range: { min: number; max: number }) => {
    if (value < range.min) return 'text-blue-600';
    if (value > range.max) return 'text-red-600';
    return 'text-green-600';
  };

  const getStatusIcon = (value: number, range: { min: number; max: number }) => {
    if (value < range.min) return <TrendingDown className="h-5 w-5" />;
    if (value > range.max) return <TrendingUp className="h-5 w-5" />;
    return <CheckCircle className="h-5 w-5" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <LineChart className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Test Result Tracker</h2>
        </div>
        <Button size="sm">Add New Result</Button>
      </div>

      <div className="space-y-4">
        {results.map(result => (
          <div key={result.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{result.testName}</h3>
                <p className="text-sm text-gray-600">{result.labName} • {result.date}</p>
              </div>
              <div className={`flex items-center space-x-1 ${getStatusColor(result.value, result.normalRange)}`}>
                {getStatusIcon(result.value, result.normalRange)}
                <span className="font-bold">{result.value} {result.unit}</span>
              </div>
            </div>
            
            <div className="mt-2 text-sm">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  Normal Range: {result.normalRange.min}-{result.normalRange.max} {result.unit}
                </span>
              </div>
            </div>

            {result.value > result.normalRange.max && (
              <div className="mt-2 bg-red-50 text-red-700 p-2 rounded-md flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 mt-0.5" />
                <p className="text-sm">Value is above normal range. Consider scheduling a follow-up.</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestResultTracker;