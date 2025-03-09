import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

// Sample booking data
const sampleBookings = [
  {
    id: 'BK123456',
    testName: 'Complete Blood Count (CBC)',
    labName: 'Pathkind Labs',
    date: '2025-05-15',
    time: '9:00 AM - 10:00 AM',
    homeCollection: true,
    amount: 499,
    status: 'confirmed',
    reportReady: false
  },
  {
    id: 'BK789012',
    testName: 'Thyroid Profile',
    labName: 'Dr. Lal PathLabs',
    date: '2025-05-10',
    time: '8:00 AM - 9:00 AM',
    homeCollection: false,
    amount: 649,
    status: 'completed',
    reportReady: true
  }
];

const BookingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/');
      return;
    }
    
    // Fetch bookings (using sample data for now)
    const fetchBookings = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/bookings');
        // const data = await response.json();
        
        // Using sample data
        setBookings(sampleBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [user, navigate]);
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
          <Button onClick={() => navigate('/search')}>Find Tests</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{booking.testName}</h3>
                    <p className="text-sm text-gray-600">{booking.labName}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status === 'confirmed' ? 'Upcoming' : 'Completed'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Booking ID: {booking.id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-sm text-gray-600">{booking.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Time</p>
                      <p className="text-sm text-gray-600">{booking.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Collection</p>
                      <p className="text-sm text-gray-600">
                        {booking.homeCollection ? 'Home Collection' : 'Lab Visit'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Report</p>
                      <p className="text-sm text-gray-600">
                        {booking.reportReady ? 'Available' : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t mt-4">
                  <p className="font-medium">Amount Paid: <span className="text-blue-600">₹{booking.amount}</span></p>
                  {booking.reportReady ? (
                    <Button size="sm">Download Report</Button>
                  ) : booking.status === 'confirmed' ? (
                    <Button size="sm" variant="outline">Cancel Booking</Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>Completed</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;