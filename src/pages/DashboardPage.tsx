import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, FileText, Activity, Bell, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import HealthTrackerWidget from '../components/HealthTrackerWidget';
import MedicationReminder from '../components/MedicationReminder';

const DashboardPage = () => {
  // Sample data
  const upcomingAppointments = [
    {
      id: 1,
      testName: 'Complete Blood Count',
      labName: 'Pathkind Labs',
      date: '2025-05-15',
      time: '09:00 AM'
    }
  ];
  
  const recentTests = [
    {
      id: 1,
      testName: 'Thyroid Profile',
      labName: 'Dr. Lal PathLabs',
      date: '2025-04-10',
      status: 'Completed'
    }
  ];
  
  const healthInsights = [
    {
      id: 1,
      title: 'Vitamin D Levels',
      message: 'Your Vitamin D levels are below normal range. Consider supplements.',
      type: 'warning'
    },
    {
      id: 2,
      title: 'Exercise Reminder',
      message: 'Regular exercise can help improve your cholesterol levels.',
      type: 'tip'
    }
  ];
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Health Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
              <Link to="/bookings" className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No upcoming appointments</p>
                <Button className="mt-3" size="sm" onClick={() => window.location.href = '/search'}>
                  Book a Test
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <h3 className="font-medium">{appointment.testName}</h3>
                    <p className="text-sm text-gray-600">{appointment.labName}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button size="sm" variant="outline">Reschedule</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Tests */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Tests</h2>
              <Link to="/bookings" className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            {recentTests.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No recent tests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTests.map(test => (
                  <div key={test.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{test.testName}</h3>
                        <p className="text-sm text-gray-600">{test.labName}</p>
                        <div className="flex items-center mt-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{test.date}</span>
                        </div>
                      </div>
                      <div>
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {test.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm">View Report</Button>
                      <Button size="sm" variant="outline">Book Again</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Health Tracker */}
      <HealthTrackerWidget />
      
      {/* Medication Reminders */}
      <MedicationReminder />
      
      {/* Health Insights */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Health Insights</h2>
          </div>
          
          {healthInsights.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No health insights available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {healthInsights.map(insight => (
                <div 
                  key={insight.id} 
                  className={`p-4 rounded-lg flex items-start space-x-3 ${
                    insight.type === 'warning' ? 'bg-amber-50' : 'bg-blue-50'
                  }`}
                >
                  {insight.type === 'warning' ? (
                    <Bell className="h-5 w-5 text-amber-600 mt-0.5" />
                  ) : (
                    <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                  )}
                  <div>
                    <h3 className={`font-medium ${
                      insight.type === 'warning' ? 'text-amber-800' : 'text-blue-800'
                    }`}>
                      {insight.title}
                    </h3>
                    <p className={`text-sm ${
                      insight.type === 'warning' ? 'text-amber-700' : 'text-blue-700'
                    }`}>
                      {insight.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Recommended Tests */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recommended Health Packages</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium">Healthkind Complete</h3>
              <p className="text-sm text-gray-600 mb-2">81 Tests including Heart, Diabetes, Kidney, Bones, Thyroid</p>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-blue-600">₹2,969</span>
                <span className="text-sm line-through text-gray-400">₹3,299</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">10% OFF</span>
              </div>
              <Button size="sm" onClick={() => window.location.href = '/book/106'}>Book Now</Button>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium">Healthkind Active</h3>
              <p className="text-sm text-gray-600 mb-2">56 Tests including Heart, Diabetes, Kidney, Liver, Infection</p>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-blue-600">₹1,304</span>
                <span className="text-sm line-through text-gray-400">₹1,449</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">10% OFF</span>
              </div>
              <Button size="sm" onClick={() => window.location.href = '/book/103'}>Book Now</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;