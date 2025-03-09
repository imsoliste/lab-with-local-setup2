import React from 'react';
import { Brain, Heart, Activity, Sun, Apple, Coffee } from 'lucide-react';

const HealthRecommendations = () => {
  const recommendations = [
    {
      id: 1,
      title: 'Regular Health Checkup',
      description: 'Based on your age and health profile, schedule these tests:',
      icon: <Activity className="h-6 w-6 text-blue-600" />,
      items: [
        'Complete Blood Count - Every 6 months',
        'Lipid Profile - Annually',
        'Thyroid Function Test - Annually',
        'Vitamin D Test - Every 6 months'
      ]
    },
    {
      id: 2,
      title: 'Lifestyle Recommendations',
      description: 'Improve your health with these daily habits:',
      icon: <Heart className="h-6 w-6 text-red-600" />,
      items: [
        '30 minutes of moderate exercise',
        'Maintain a balanced diet',
        'Stay hydrated (8-10 glasses of water)',
        'Get 7-8 hours of sleep'
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="h-6 w-6 text-purple-600" />
        <h2 className="text-xl font-semibold">Smart Health Recommendations</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {recommendations.map(rec => (
          <div key={rec.id} className="border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              {rec.icon}
              <h3 className="font-medium">{rec.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
            <ul className="space-y-2">
              {rec.items.map((item, index) => (
                <li key={index} className="flex items-center space-x-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="border rounded-lg p-4 bg-blue-50">
          <div className="flex items-center space-x-2 mb-3">
            <Sun className="h-6 w-6 text-orange-500" />
            <h3 className="font-medium">Daily Health Tips</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Apple className="h-5 w-5 text-red-500" />
              <p className="text-sm">Include fruits and vegetables in every meal</p>
            </div>
            <div className="flex items-center space-x-2">
              <Coffee className="h-5 w-5 text-brown-500" />
              <p className="text-sm">Limit caffeine intake to 2 cups per day</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRecommendations;