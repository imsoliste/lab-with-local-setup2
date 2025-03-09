import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Microscope, Search, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from './ui/button';
import LoginModal from './LoginModal';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSearch = () => {
    navigate('/search');
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    navigate('/profile');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Microscope className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">MedLab Compare</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/tests" className="text-gray-600 hover:text-gray-900">Lab Tests</Link>
            <Link to="/search" className="text-gray-600 hover:text-gray-900">Find Tests</Link>
            <Link to="/compare" className="text-gray-600 hover:text-gray-900">Compare</Link>
            
            {user ? (
              <div className="relative group">
                <Button className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{user.name || 'My Account'}</span>
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Admin Panel
                      </div>
                    </Link>
                  )}
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </div>
                  </Link>
                  <Link to="/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Bookings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsLoginModalOpen(true)} className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            )}
          </div>
          
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/tests" 
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Lab Tests
              </Link>
              <Link 
                to="/search" 
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Tests
              </Link>
              <Link 
                to="/compare" 
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Compare
              </Link>
              
              {user ? (
                <>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="text-gray-600 hover:text-gray-900 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link 
                    to="/profile" 
                    className="text-gray-600 hover:text-gray-900 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/bookings" 
                    className="text-gray-600 hover:text-gray-900 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center space-x-2 w-full text-red-600 border-red-200"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <Button 
                  className="flex items-center justify-center space-x-2 w-full" 
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;