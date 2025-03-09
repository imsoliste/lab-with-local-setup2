import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, Tag, Percent, Plus, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import PaymentModal from '../components/PaymentModal';

// Sample test data
const testData = [
  {
    id: 1,
    name: 'Complete Blood Count (CBC)',
    description: 'A complete blood count (CBC) is a blood test used to evaluate your overall health and screen for various disorders.',
    parameters: ['Red Blood Cell Count', 'White Blood Cell Count', 'Hemoglobin', 'Platelets', 'Hematocrit'],
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 399, discountedPrice: 359, turnaround: '24 hours' },
      { id: 102, name: 'Dr. Lal PathLabs', price: 449, discountedPrice: 404, turnaround: '12 hours' },
      { id: 103, name: 'SRL Diagnostics', price: 499, discountedPrice: 449, turnaround: '8 hours' }
    ]
  },
  {
    id: 2,
    name: 'Thyroid Profile',
    description: 'The thyroid profile test measures the levels of thyroid hormones in your blood to evaluate thyroid function.',
    parameters: ['T3 (Triiodothyronine)', 'T4 (Thyroxine)', 'TSH (Thyroid Stimulating Hormone)'],
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 599, discountedPrice: 539, turnaround: '24 hours' },
      { id: 102, name: 'Dr. Lal PathLabs', price: 649, discountedPrice: 584, turnaround: '12 hours' },
      { id: 104, name: 'Metropolis', price: 699, discountedPrice: 629, turnaround: '6 hours' }
    ]
  }
];

// Health packages data
const healthPackages = [
  {
    id: 101,
    name: "Healthkind Screen (21 Tests)",
    description: "Basic health screening package covering heart, diabetes, kidney, thyroid, liver, and infection markers.",
    parameters: [
      'Heart: Total Cholesterol, Triglycerides',
      'Diabetes: FBS',
      'Kidney: Urea, BUN, Creatinine, BUN/Creatinine Ratio',
      'Thyroid: TSH',
      'Liver: SGOT, SGPT, AST/ALT Ratio',
      'Infection: Hb, TLC, Platelets'
    ],
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 899, discountedPrice: 809, actualPrice: 2055, turnaround: '24 hours' }
    ]
  }
];

// Combine both arrays
const allTests = [...testData, ...healthPackages];

// Additional tests that can be bundled
const additionalTests = [
  { id: 'vit_d', name: 'Vitamin D Test', price: 899, discountedPrice: 809 },
  { id: 'b12', name: 'Vitamin B12 Test', price: 699, discountedPrice: 629 },
  { id: 'iron', name: 'Iron Studies', price: 799, discountedPrice: 719 },
  { id: 'hba1c', name: 'HbA1C Test', price: 399, discountedPrice: 359 },
  { id: 'lipid', name: 'Lipid Profile', price: 499, discountedPrice: 449 }
];

const BookingPage = () => {
  const { testId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const labId = searchParams.get('lab');
  const { user } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [test, setTest] = useState<any>(null);
  const [lab, setLab] = useState<any>(null);
  const [homeCollection, setHomeCollection] = useState(true);
  const [address, setAddress] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState('');
  
  // New state for additional tests
  const [selectedAdditionalTests, setSelectedAdditionalTests] = useState<string[]>([]);
  const [showAdditionalTests, setShowAdditionalTests] = useState(false);
  
  useEffect(() => {
    // Find the test and lab based on IDs
    const foundTest = allTests.find(t => t.id === Number(testId));
    if (foundTest) {
      setTest(foundTest);
      if (labId) {
        const foundLab = foundTest.labs.find(l => l.id === Number(labId));
        if (foundLab) {
          setLab(foundLab);
        }
      } else if (foundTest.labs.length > 0) {
        setLab(foundTest.labs[0]);
      }
    }
  }, [testId, labId]);

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const homeCollectionFee = 100;
  const testPrice = lab ? lab.discountedPrice : 0;
  
  // Calculate additional tests total
  const additionalTestsTotal = selectedAdditionalTests.reduce((total, testId) => {
    const test = additionalTests.find(t => t.id === testId);
    return total + (test?.discountedPrice || 0);
  }, 0);
  
  const totalPrice = lab ? 
    (homeCollection ? testPrice + homeCollectionFee + additionalTestsTotal : testPrice + additionalTestsTotal) 
    : 0;
  const originalPrice = lab ? 
    (homeCollection ? lab.price + homeCollectionFee + additionalTestsTotal : lab.price + additionalTestsTotal) 
    : 0;
  const savings = originalPrice - totalPrice;

  const handleProceedToPayment = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    
    if (homeCollection && !address) {
      alert('Please enter your address for home collection');
      return;
    }
    
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    const newBookingId = `BK${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingId(newBookingId);
    setBookingComplete(true);
  };

  const toggleAdditionalTest = (testId: string) => {
    if (selectedAdditionalTests.includes(testId)) {
      setSelectedAdditionalTests(selectedAdditionalTests.filter(id => id !== testId));
    } else {
      setSelectedAdditionalTests([...selectedAdditionalTests, testId]);
    }
  };

  if (!test || !lab) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading test information...</p>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your test has been booked successfully.</p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking ID:</span>
              <span className="font-semibold">{bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Test:</span>
              <span className="font-semibold">{test.name}</span>
            </div>
            {selectedAdditionalTests.length > 0 && (
              <div>
                <span className="text-gray-600">Additional Tests:</span>
                <ul className="mt-1 space-y-1">
                  {selectedAdditionalTests.map(testId => {
                    const test = additionalTests.find(t => t.id === testId);
                    return (
                      <li key={testId} className="text-sm text-gray-700">
                        • {test?.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Lab:</span>
              <span className="font-semibold">{lab.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-semibold">{selectedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-semibold">{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Collection Type:</span>
              <span className="font-semibold">{homeCollection ? 'Home Collection' : 'Visit Lab'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-semibold">₹{totalPrice}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
          <div>
            <p className="text-blue-800 font-medium">Important Information</p>
            <ul className="text-sm text-blue-700 mt-1 list-disc list-inside">
              <li>Please be available at the scheduled time for sample collection.</li>
              <li>Keep yourself hydrated and follow any test-specific instructions.</li>
              <li>Results will be available within {lab.turnaround} after sample collection.</li>
            </ul>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
          <Button 
            className="flex-1"
            onClick={() => navigate('/bookings')}
          >
            View My Bookings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold mb-4">{test.name}</h1>
            {lab.actualPrice && (
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Save ₹{(lab.actualPrice - lab.discountedPrice).toFixed(0)}
              </div>
            )}
          </div>
          <p className="text-gray-600 mb-4">
            {test.description}
          </p>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Test Includes:</h2>
            <ul className="list-disc list-inside text-gray-600">
              {test.parameters.map((param: string, index: number) => (
                <li key={index}>{param}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Additional Tests Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Add More Tests</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAdditionalTests(!showAdditionalTests)}
              className="flex items-center space-x-1"
            >
              {showAdditionalTests ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{showAdditionalTests ? 'Close' : 'Add Tests'}</span>
            </Button>
          </div>
          
          {showAdditionalTests && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {additionalTests.map(test => (
                <div 
                  key={test.id}
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedAdditionalTests.includes(test.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => toggleAdditionalTest(test.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{test.name}</h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="font-bold text-blue-600">₹{test.discountedPrice}</span>
                        <span className="text-sm line-through text-gray-400">₹{test.price}</span>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">10% OFF</span>
                      </div>
                    </div>
                    <div className="h-5 w-5 border-2 rounded-full flex items-center justify-center">
                      {selectedAdditionalTests.includes(test.id) && (
                        <div className="h-3 w-3 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Select Date & Time</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={minDate}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time
              </label>
              <select 
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select time slot</option>
                <option value="7:00 AM - 8:00 AM">7:00 AM - 8:00 AM</option>
                <option value="8:00 AM - 9:00 AM">8:00 AM - 9:00 AM</option>
                <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Collection Type</h3>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={homeCollection} 
                  onChange={() => setHomeCollection(true)}
                  className="h-4 w-4 text-blue-600"
                />
                <span>Home Collection</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={!homeCollection} 
                  onChange={() => setHomeCollection(false)}
                  className="h-4 w-4 text-blue-600"
                />
                <span>Visit Lab</span>
              </label>
            </div>
            
            {homeCollection && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your complete address for sample collection"
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
        <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Calendar className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="font-medium">Date</p>
              <p className="text-gray-600">{selectedDate || 'Select a date'}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Clock className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="font-medium">Time</p>
              <p className="text-gray-600">{selectedTime || 'Select a time slot'}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <MapPin className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-gray-600">{homeCollection ? 'Home Collection' : lab.name}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="font-medium">Lab</p>
              <p className="text-gray-600">{lab.name}</p>
              <p className="text-xs text-gray-500">Results in {lab.turnaround}</p>
            </div>
          </div>
          <hr />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Primary Test ({test.name})</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">₹{testPrice}</span>
                <span className="text-sm line-through text-gray-400">₹{lab.price}</span>
              </div>
            </div>
            
            {selectedAdditionalTests.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Additional Tests:</p>
                {selectedAdditionalTests.map(testId => {
                  const test = additionalTests.find(t => t.id === testId);
                  return (
                    <div key={testId} className="flex justify-between items-center pl-4">
                      <span className="text-sm">{test?.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">₹{test?.discountedPrice}</span>
                        <span className="text-sm line-through text-gray-400">₹{test?.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {homeCollection && (
              <div className="flex justify-between">
                <span>Home Collection Fee</span>
                <span className="font-semibold">₹{homeCollectionFee}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t">
              <div className="flex items-center">
                <span className="font-bold">Total</span>
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                  <Percent className="h-3 w-3 mr-1" />
                  10% OFF
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-blue-600">₹{totalPrice}</span>
                <span className="text-sm line-through text-gray-400">₹{originalPrice}</span>
              </div>
            </div>
            <div className="text-right text-xs text-green-600">
              You save: ₹{savings}
            </div>
          </div>
          <Button 
            className="w-full"
            disabled={!selectedDate || !selectedTime}
            onClick={handleProceedToPayment}
          >
            Proceed to Payment
          </Button>
          {(!selectedDate || !selectedTime) && (
            <p className="text-xs text-center text-red-500 mt-2">
              Please select date and time to proceed
            </p>
          )}
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsPaymentModalOpen(true)}
      />
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={totalPrice}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default BookingPage;