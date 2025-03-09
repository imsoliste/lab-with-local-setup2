import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Percent } from 'lucide-react';

// Sample test data
const testData = [
  {
    id: 1,
    name: 'Complete Blood Count (CBC)',
    description: 'Basic health screening',
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 399, discountedPrice: 359, turnaround: '24 hours', rating: 4.2 },
      { id: 102, name: 'Dr. Lal PathLabs', price: 449, discountedPrice: 404, turnaround: '12 hours', rating: 4.5 },
      { id: 103, name: 'SRL Diagnostics', price: 499, discountedPrice: 449, turnaround: '8 hours', rating: 4.3 }
    ]
  },
  {
    id: 2,
    name: 'Thyroid Profile',
    description: 'Thyroid function test',
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 599, discountedPrice: 539, turnaround: '24 hours', rating: 4.2 },
      { id: 102, name: 'Dr. Lal PathLabs', price: 649, discountedPrice: 584, turnaround: '12 hours', rating: 4.5 },
      { id: 104, name: 'Metropolis', price: 699, discountedPrice: 629, turnaround: '6 hours', rating: 4.4 }
    ]
  },
  {
    id: 3,
    name: 'Lipid Profile',
    description: 'Cholesterol test',
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 499, discountedPrice: 449, turnaround: '24 hours', rating: 4.2 },
      { id: 103, name: 'SRL Diagnostics', price: 549, discountedPrice: 494, turnaround: '12 hours', rating: 4.3 },
      { id: 104, name: 'Metropolis', price: 599, discountedPrice: 539, turnaround: '8 hours', rating: 4.4 }
    ]
  },
  {
    id: 4,
    name: 'Vitamin D Test',
    description: 'Vitamin D level test',
    labs: [
      { id: 102, name: 'Dr. Lal PathLabs', price: 899, discountedPrice: 809, turnaround: '24 hours', rating: 4.5 },
      { id: 103, name: 'SRL Diagnostics', price: 949, discountedPrice: 854, turnaround: '12 hours', rating: 4.3 },
      { id: 104, name: 'Metropolis', price: 999, discountedPrice: 899, turnaround: '8 hours', rating: 4.4 }
    ]
  },
  {
    id: 5,
    name: 'Diabetes (FBS & PP)',
    description: 'Blood glucose test',
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 99, discountedPrice: 89, turnaround: '24 hours', rating: 4.2 },
      { id: 102, name: 'Dr. Lal PathLabs', price: 149, discountedPrice: 134, turnaround: '12 hours', rating: 4.5 }
    ]
  }
];

const TestComparison = () => {
  const [selectedTests, setSelectedTests] = useState<number[]>([1]); // Default to first test
  const location = useLocation();
  
  useEffect(() => {
    // Check if there's a test ID in the URL query params
    const params = new URLSearchParams(location.search);
    const testId = params.get('test');
    if (testId) {
      setSelectedTests([parseInt(testId)]);
    }
  }, [location]);

  const handleTestSelection = (testId: number) => {
    if (selectedTests.includes(testId)) {
      // If already selected and not the only one, remove it
      if (selectedTests.length > 1) {
        setSelectedTests(selectedTests.filter(id => id !== testId));
      }
    } else {
      // Add to selection
      setSelectedTests([...selectedTests, testId]);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Compare Lab Tests</h1>
      
      {/* Discount Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Percent className="h-5 w-5 text-yellow-600" />
          <h2 className="text-xl font-bold text-yellow-800">Special Offer!</h2>
        </div>
        <p className="text-yellow-700">
          Get <span className="font-bold">10% OFF</span> on all lab tests and health packages. Limited time offer!
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Select Tests to Compare</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testData.map(test => (
            <div 
              key={test.id} 
              className={`border rounded-lg p-4 cursor-pointer ${
                selectedTests.includes(test.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => handleTestSelection(test.id)}
            >
              <h3 className="font-semibold">{test.name}</h3>
              <p className="text-sm text-gray-600">{test.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left">Lab Details</th>
              {selectedTests.map(testId => {
                const test = testData.find(t => t.id === testId);
                return (
                  <th key={testId} className="p-4 text-center">
                    {test?.name}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {/* Get all unique labs from selected tests */}
            {Array.from(new Set(
              selectedTests.flatMap(testId => 
                testData.find(t => t.id === testId)?.labs.map(lab => lab.id) || []
              )
            )).map(labId => {
              // Find lab info
              const labInfo = testData.flatMap(t => t.labs).find(l => l.id === labId);
              
              return (
                <tr key={labId} className="border-t">
                  <td className="p-4">
                    <h3 className="font-semibold">{labInfo?.name}</h3>
                    <p className="text-xs text-gray-500">Rating: {labInfo?.rating}/5</p>
                  </td>
                  
                  {selectedTests.map(testId => {
                    const test = testData.find(t => t.id === testId);
                    const labForTest = test?.labs.find(l => l.id === labId);
                    
                    return (
                      <td key={`${testId}-${labId}`} className="p-4 text-center">
                        {labForTest ? (
                          <>
                            <div className="flex items-center justify-center space-x-2">
                              <p className="font-bold text-blue-600">₹{labForTest.discountedPrice}</p>
                              <span className="text-sm line-through text-gray-400">₹{labForTest.price}</span>
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">10% OFF</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{labForTest.turnaround}</p>
                            <Link to={`/book/${testId}?lab=${labId}`}>
                              <Button size="sm" className="mt-2">Book</Button>
                            </Link>
                          </>
                        ) : (
                          <p className="text-gray-400">Not available</p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestComparison;