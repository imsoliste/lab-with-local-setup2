import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Tag, Percent } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';

// Sample data for tests and labs
const testData = [
  {
    id: 1,
    name: 'Complete Blood Count (CBC)',
    description: 'Measures red blood cells, white blood cells, platelets, and hemoglobin',
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 399, discountedPrice: 359, turnaround: '24 hours' },
      { id: 102, name: 'Dr. Lal PathLabs', price: 449, discountedPrice: 404, turnaround: '12 hours' },
      { id: 103, name: 'SRL Diagnostics', price: 499, discountedPrice: 449, turnaround: '8 hours' }
    ]
  },
  {
    id: 2,
    name: 'Thyroid Profile',
    description: 'Measures thyroid hormones (T3, T4) and thyroid-stimulating hormone (TSH)',
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 599, discountedPrice: 539, turnaround: '24 hours' },
      { id: 102, name: 'Dr. Lal PathLabs', price: 649, discountedPrice: 584, turnaround: '12 hours' },
      { id: 104, name: 'Metropolis', price: 699, discountedPrice: 629, turnaround: '6 hours' }
    ]
  },
  {
    id: 3,
    name: 'Lipid Profile',
    description: 'Measures cholesterol, triglycerides, HDL, and LDL',
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 499, discountedPrice: 449, turnaround: '24 hours' },
      { id: 103, name: 'SRL Diagnostics', price: 549, discountedPrice: 494, turnaround: '12 hours' },
      { id: 104, name: 'Metropolis', price: 599, discountedPrice: 539, turnaround: '8 hours' }
    ]
  },
  {
    id: 4,
    name: 'Vitamin D Test',
    description: 'Measures the level of vitamin D in your blood',
    labs: [
      { id: 102, name: 'Dr. Lal PathLabs', price: 899, discountedPrice: 809, turnaround: '24 hours' },
      { id: 103, name: 'SRL Diagnostics', price: 949, discountedPrice: 854, turnaround: '12 hours' },
      { id: 104, name: 'Metropolis', price: 999, discountedPrice: 899, turnaround: '8 hours' }
    ]
  },
  {
    id: 5,
    name: 'Diabetes (FBS & PP)',
    description: 'Measures blood glucose levels before and after meals',
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 99, discountedPrice: 89, turnaround: '24 hours' },
      { id: 102, name: 'Dr. Lal PathLabs', price: 149, discountedPrice: 134, turnaround: '12 hours' }
    ]
  },
  {
    id: 6,
    name: 'HbA1C',
    description: 'Measures average blood glucose levels over past 3 months',
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 199, discountedPrice: 179, turnaround: '24 hours' },
      { id: 102, name: 'Dr. Lal PathLabs', price: 249, discountedPrice: 224, turnaround: '12 hours' }
    ]
  },
  {
    id: 7,
    name: 'Thyroid (TSH)',
    description: 'Measures thyroid-stimulating hormone levels',
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 99, discountedPrice: 89, turnaround: '24 hours' },
      { id: 102, name: 'Dr. Lal PathLabs', price: 149, discountedPrice: 134, turnaround: '12 hours' }
    ]
  }
];

// Health packages data
const healthPackages = [
  {
    id: 101,
    name: "Healthkind Screen (21 Tests)",
    description: "Heart, Diabetes, Kidney, Thyroid, Liver, Infection tests",
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 899, discountedPrice: 809, actualPrice: 2055, turnaround: '24 hours' }
    ]
  },
  {
    id: 102,
    name: "Healthkind Lite (34 Tests)",
    description: "Heart, Diabetes, Kidney, Bones, Thyroid, Liver tests",
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 1099, discountedPrice: 989, actualPrice: 1535, turnaround: '24 hours' }
    ]
  },
  {
    id: 103,
    name: "Healthkind Active (56 Tests)",
    description: "Heart, Diabetes, Kidney, Bones, Thyroid, Liver, Infection tests",
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 1449, discountedPrice: 1304, actualPrice: 5555, turnaround: '24 hours' }
    ]
  },
  {
    id: 104,
    name: "Healthkind Total (74 Tests)",
    description: "Heart, Diabetes, Kidney, Bones, Thyroid, Liver, Infection, Vitamin D tests",
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 1949, discountedPrice: 1754, actualPrice: 7215, turnaround: '24 hours' }
    ]
  },
  {
    id: 105,
    name: "Healthkind Super (58 Tests)",
    description: "Heart, Diabetes, Kidney, Bones, Thyroid, Nerves, Liver, Infection tests",
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 2399, discountedPrice: 2159, actualPrice: 8465, turnaround: '24 hours' }
    ]
  },
  {
    id: 106,
    name: "Healthkind Complete (81 Tests)",
    description: "Heart, Diabetes, Kidney, Bones, Thyroid, Nerves, Liver, Anaemia, Infection tests",
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 3299, discountedPrice: 2969, actualPrice: 10205, turnaround: '24 hours', bestSeller: true }
    ]
  },
  {
    id: 107,
    name: "Healthkind Advance (83 Tests)",
    description: "Heart, Diabetes, Kidney, Bones, Thyroid, Nerves, Liver, Anaemia, Infection tests",
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 3999, discountedPrice: 3599, actualPrice: 11405, turnaround: '24 hours' }
    ]
  },
  {
    id: 108,
    name: "Healthkind Platinum (85 Tests)",
    description: "Heart, Diabetes, Kidney, Bones, Thyroid, Nerves, Liver, Anaemia, Infection tests",
    labs: [
      { id: 101, name: 'Pathkind Labs', price: 4999, discountedPrice: 4499, actualPrice: 12365, turnaround: '24 hours' }
    ]
  }
];

// Combine both arrays for searching
const allTests = [...testData, ...healthPackages];

const SearchTests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTest, setExpandedTest] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Check if there's a test ID in the URL query params
    const params = new URLSearchParams(location.search);
    const testId = params.get('test');
    if (testId) {
      setExpandedTest(parseInt(testId));
    }
  }, [location]);

  const filteredTests = allTests.filter(test => 
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTestExpansion = (testId: number) => {
    if (expandedTest === testId) {
      setExpandedTest(null);
    } else {
      setExpandedTest(testId);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is already handled by the filteredTests variable
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6">Find Lab Tests</h1>
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for tests, packages, or health conditions"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button type="submit" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
        </form>
      </div>

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

      <div className="space-y-6">
        {filteredTests.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-600">No tests found matching your search criteria.</p>
          </div>
        ) : (
          filteredTests.map(test => (
            <div key={test.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div 
                className="p-6 cursor-pointer flex justify-between items-center"
                onClick={() => toggleTestExpansion(test.id)}
              >
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">{test.name}</h3>
                    {test.labs.some(lab => lab.bestSeller) && (
                      <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">BEST SELLER</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{test.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Starting from</p>
                  <div className="flex items-center justify-end space-x-2">
                    <p className="text-xl font-bold text-blue-600">₹{Math.min(...test.labs.map(lab => lab.discountedPrice))}</p>
                    <span className="text-sm line-through text-gray-400">₹{Math.min(...test.labs.map(lab => lab.price))}</span>
                  </div>
                </div>
              </div>
              
              {expandedTest === test.id && (
                <div className="border-t border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Lab Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Turnaround Time</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-500"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {test.labs.map(lab => (
                          <tr key={lab.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                              <div className="flex items-center">
                                {lab.name}
                                {lab.bestSeller && (
                                  <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">BEST SELLER</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-blue-600">₹{lab.discountedPrice}</span>
                                <span className="text-sm line-through text-gray-400">₹{lab.price}</span>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">10% OFF</span>
                              </div>
                              {lab.actualPrice && (
                                <p className="text-xs text-green-600 mt-1">
                                  You save ₹{(lab.actualPrice - lab.discountedPrice).toFixed(0)}
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">{lab.turnaround}</td>
                            <td className="px-4 py-4 text-right">
                              <Link to={`/book/${test.id}?lab=${lab.id}`}>
                                <Button size="sm" className="flex items-center space-x-1">
                                  <span>Book Now</span>
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
                    <Link to={`/compare?test=${test.id}`}>
                      <Button variant="outline">Compare All Labs</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchTests;