import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock, Home, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { getTests, searchTests } from '../lib/api/tests';

const LabTestViewer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'turnaround'>('price');
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTests();
      
      if (data) {
        setTests(data);
        
        // Extract unique categories and locations
        const uniqueCategories = Array.from(new Set(data.map(test => test.category)));
        const uniqueLocations = Array.from(new Set(
          data.flatMap(test => test.lab_test_prices.map(price => price.lab.city))
        ));
        
        setCategories(uniqueCategories);
        setLocations(uniqueLocations);
      }
    } catch (err) {
      console.error('Error fetching tests:', err);
      setError('Failed to load tests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchTests();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchTests(searchQuery);
      setTests(data || []);
    } catch (err) {
      console.error('Error searching tests:', err);
      setError('Failed to search tests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedTests = React.useMemo(() => {
    let filtered = [...tests];

    // Apply filters
    if (selectedCategory) {
      filtered = filtered.filter(test => test.category === selectedCategory);
    }

    if (selectedLocation) {
      filtered = filtered.filter(test => 
        test.lab_test_prices.some(price => price.lab.city === selectedLocation)
      );
    }

    // Apply price range
    filtered = filtered.filter(test => {
      const minPrice = Math.min(...test.lab_test_prices.map(price => price.discounted_price));
      return minPrice >= priceRange[0] && minPrice <= priceRange[1];
    });

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return Math.min(...a.lab_test_prices.map(p => p.discounted_price)) -
                 Math.min(...b.lab_test_prices.map(p => p.discounted_price));
        case 'rating':
          return Math.max(...b.lab_test_prices.map(p => p.lab.rating || 0)) -
                 Math.max(...a.lab_test_prices.map(p => p.lab.rating || 0));
        case 'turnaround':
          return a.report_time_hours - b.report_time_hours;
        default:
          return 0;
      }
    });
  }, [tests, selectedCategory, selectedLocation, priceRange, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchTests}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6">Lab Tests Catalog</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for tests, packages, or health conditions"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'price' | 'rating' | 'turnaround')}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="price">Sort by Price</option>
            <option value="rating">Sort by Rating</option>
            <option value="turnaround">Sort by Turnaround Time</option>
          </select>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                value={selectedLocation || ''}
                onChange={(e) => setSelectedLocation(e.target.value || null)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range (₹)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min={0}
                  max={5000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">₹{priceRange[1]}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test Results */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredAndSortedTests.length === 0 ? (
          <div className="md:col-span-2 bg-white p-8 rounded-lg shadow-sm text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No tests found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setSelectedLocation(null);
                setPriceRange([0, 5000]);
                fetchTests();
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          filteredAndSortedTests.map(test => (
            <div key={test.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{test.name}</h2>
                    <p className="text-gray-600 text-sm mt-1">{test.description}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {test.category}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start space-x-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Results in {test.report_time_hours} hours
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Available at {test.lab_test_prices.length} labs
                  </p>
                  <div className="space-y-2">
                    {test.lab_test_prices.slice(0, 2).map((price: any) => (
                      <div key={price.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{price.lab.name}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span>{price.lab.rating}</span>
                            {price.home_collection_available && (
                              <div className="flex items-center text-green-600">
                                <Home className="h-4 w-4 mr-1" />
                                <span>Home Collection</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-blue-600">
                              ₹{price.discounted_price}
                            </span>
                            <span className="text-sm line-through text-gray-400">
                              ₹{price.price}
                            </span>
                          </div>
                          <Link to={`/book/${test.id}?lab=${price.lab.id}`}>
                            <Button size="sm" className="mt-1">Book Now</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {test.lab_test_prices.length > 2 && (
                    <div className="mt-4 text-center">
                      <Link to={`/compare?test=${test.id}`}>
                        <Button variant="outline" size="sm">
                          Compare All {test.lab_test_prices.length} Labs
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LabTestViewer;