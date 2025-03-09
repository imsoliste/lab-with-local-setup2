import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchTests from './pages/SearchTests';
import TestComparison from './pages/TestComparison';
import BookingPage from './pages/BookingPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import AdminPanel from './pages/AdminPanel';
import LabTestViewer from './pages/LabTestViewer';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { initializeApp } from './lib/initApp';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const success = await initializeApp();
        if (!success) {
          setError('Failed to initialize application');
        }
      } catch (err) {
        setError('An error occurred while initializing the application');
      } finally {
        setIsInitialized(true);
      }
    };

    init();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Initializing application...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/admin/*" element={<AdminPanel />} />
            <Route path="*" element={
              <>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<SearchTests />} />
                    <Route path="/compare" element={<TestComparison />} />
                    <Route path="/book/:testId" element={<BookingPage />} />
                    <Route path="/bookings" element={<BookingsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/tests" element={<LabTestViewer />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;