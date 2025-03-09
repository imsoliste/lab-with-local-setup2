import React from 'react';
import { Search, Award, Clock, Home as HomeIcon, Tag, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import OffersBanner from '../components/OffersBanner';

// Sample data for popular tests
const popularTests = [
  {
    id: 1,
    name: "Complete Blood Count",
    description: "Includes RBC, WBC, Platelets, Hemoglobin, and more",
    minPrice: 399,
    discountedPrice: 359,
    labs: 3
  },
  {
    id: 2,
    name: "Thyroid Profile",
    description: "Measures thyroid hormones (T3, T4) and TSH",
    minPrice: 599,
    discountedPrice: 539,
    labs: 3
  },
  {
    id: 3,
    name: "Lipid Profile",
    description: "Measures cholesterol, triglycerides, HDL, and LDL",
    minPrice: 499,
    discountedPrice: 449,
    labs: 3
  },
  {
    id: 4,
    name: "Vitamin D Test",
    description: "Measures the level of vitamin D in your blood",
    minPrice: 899,
    discountedPrice: 809,
    labs: 3
  },
  {
    id: 5,
    name: "Diabetes (FBS & PP)",
    description: "Measures blood glucose levels",
    minPrice: 99,
    discountedPrice: 89,
    labs: 2
  },
  {
    id: 6,
    name: "HbA1C",
    description: "Measures average blood glucose levels over past 3 months",
    minPrice: 199,
    discountedPrice: 179,
    labs: 2
  }
];

// Health packages data
const healthPackages = [
  {
    id: 101,
    name: "Healthkind Screen",
    tests: "21 Tests",
    actualPrice: 2055,
    price: 899,
    discountedPrice: 809,
    image: "https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&q=80&w=400",
    description: "Heart, Diabetes, Kidney, Thyroid, Liver, Infection tests"
  },
  {
    id: 102,
    name: "Healthkind Lite",
    tests: "34 Tests",
    actualPrice: 1535,
    price: 1099,
    discountedPrice: 989,
    image: "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=80&w=400",
    description: "Heart, Diabetes, Kidney, Bones, Thyroid, Liver tests"
  },
  {
    id: 103,
    name: "Healthkind Active",
    tests: "56 Tests",
    actualPrice: 5555,
    price: 1449,
    discountedPrice: 1304,
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=400",
    description: "Heart, Diabetes, Kidney, Bones, Thyroid, Liver, Infection tests"
  },
  {
    id: 104,
    name: "Healthkind Total",
    tests: "74 Tests",
    actualPrice: 7215,
    price: 1949,
    discountedPrice: 1754,
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400",
    description: "Heart, Diabetes, Kidney, Bones, Thyroid, Liver, Infection, Vitamin D tests"
  },
  {
    id: 105,
    name: "Healthkind Super",
    tests: "58 Tests",
    actualPrice: 8465,
    price: 2399,
    discountedPrice: 2159,
    image: "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?auto=format&fit=crop&q=80&w=400",
    description: "Heart, Diabetes, Kidney, Bones, Thyroid, Nerves, Liver, Infection tests"
  },
  {
    id: 106,
    name: "Healthkind Complete",
    tests: "81 Tests",
    actualPrice: 10205,
    price: 3299,
    discountedPrice: 2969,
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400",
    description: "Heart, Diabetes, Kidney, Bones, Thyroid, Nerves, Liver, Anaemia, Infection tests",
    bestSeller: true
  }
];

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 px-4 bg-gradient-to-r from-blue-500 to-blue-700 rounded-3xl text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Find and Compare Lab Tests Near You
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Compare prices, book appointments, and get your tests done from the most trusted labs in your area.
        </p>
        <form className="max-w-md mx-auto bg-white rounded-lg p-2 flex items-center">
          <input
            type="text"
            placeholder="Search for tests (e.g., Blood Sugar, Thyroid Profile)"
            className="flex-1 px-4 py-2 outline-none text-gray-700"
          />
          <Link to="/search">
            <Button className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
          </Link>
        </form>
      </section>

      {/* Offers Banner */}
      <OffersBanner />

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Trusted Labs</h3>
          <p className="text-gray-600">
            All labs are verified and accredited for quality assurance
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Quick Results</h3>
          <p className="text-gray-600">
            Get your test results quickly and securely online
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <HomeIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Home Collection</h3>
          <p className="text-gray-600">
            Convenient home sample collection at your preferred time
          </p>
        </div>
      </section>

      {/* Popular Tests Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Popular Tests</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {popularTests.map(test => (
            <div key={test.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{test.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{test.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-xl font-bold text-blue-600">₹{test.discountedPrice}</p>
                      <span className="text-sm line-through text-gray-400">₹{test.minPrice}</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">10% OFF</span>
                    </div>
                    <p className="text-xs text-gray-500">{test.labs} labs available</p>
                  </div>
                  <Link to={`/search?test=${test.id}`}>
                    <Button variant="outline">Compare Labs</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/search">
            <Button size="lg">View All Tests</Button>
          </Link>
        </div>
      </section>

      {/* Health Packages Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Health Packages</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthPackages.map((package_) => (
            <div key={package_.id} className="bg-white rounded-xl overflow-hidden shadow-sm relative">
              {package_.bestSeller && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  BEST SELLER
                </div>
              )}
              <img
                src={package_.image}
                alt={package_.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{package_.name}</h3>
                  <Tag className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-gray-600 mb-1">Includes {package_.tests}</p>
                <p className="text-sm text-gray-500 mb-3">{package_.description}</p>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600 mr-2">₹{package_.discountedPrice}</span>
                  <span className="text-sm line-through text-gray-400 mr-2">₹{package_.price}</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">10% OFF</span>
                </div>
                <div className="bg-gray-50 p-2 rounded-md text-sm text-gray-600 mb-4">
                  <span className="font-medium">You Save: </span>
                  <span className="text-green-600 font-bold">₹{(package_.actualPrice - package_.discountedPrice).toFixed(0)}</span>
                  <span className="text-gray-400 text-xs ml-1">(vs. actual price ₹{package_.actualPrice})</span>
                </div>
                <Link to={`/book/${package_.id}`}>
                  <Button className="w-full">Book Now</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lab Information Section */}
      <section className="bg-white p-8 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Pathkind Labs</h2>
          <img 
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=100" 
            alt="Pathkind Labs" 
            className="h-12 w-12 object-cover rounded-full"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Why Choose Us?</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span>NABL Accredited Lab</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span>Qualified Pathologists</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span>Fastest Test Report</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span>Accurate Report</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span>Home Sample Collection</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span>Fully Automated Analysers</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Special Offers</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-blue-800 mb-2">Free Test (Choose Any One):</p>
              <p className="text-blue-700 mb-3">Calcium, Sugar, or Cholesterol</p>
              
              <p className="font-medium text-blue-800 mb-2">Other Tests:</p>
              <ul className="space-y-1 text-blue-700">
                <li>Diabetes (FBS & PP) – ₹89 <span className="line-through text-blue-400 text-xs">₹99</span></li>
                <li>Thyroid (TSH) – ₹89 <span className="line-through text-blue-400 text-xs">₹99</span></li>
                <li>HbA1C – ₹179 <span className="line-through text-blue-400 text-xs">₹199</span></li>
                <li>Lipid Profile – ₹179 <span className="line-through text-blue-400 text-xs">₹199</span></li>
                <li>Thyroid Profile (T3, T4, TSH) – ₹179 <span className="line-through text-blue-400 text-xs">₹199</span></li>
              </ul>
              
              <div className="mt-3 text-sm text-blue-600">
                <p>📍 Timing: 7:30 AM to 1:00 PM</p>
                <p>💰 Registration Fee: ₹10 Per Person</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;