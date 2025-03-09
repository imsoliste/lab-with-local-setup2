import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { sendOtp, verifyOtp } = useAuth();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setLoading(true);
    const result = await sendOtp(phone);
    setLoading(false);
    
    if (result.success) {
      setStep('otp');
    } else {
      setError(result.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    const result = await verifyOtp(phone, otp);
    setLoading(false);
    
    if (result.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError(result.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {step === 'phone' ? 'Login with Phone' : 'Verify OTP'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  +91
                </span>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-4 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your 10-digit number"
                  maxLength={10}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                We'll send you a one-time password to verify your number
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center space-x-2"
              disabled={loading}
            >
              <span>{loading ? 'Sending OTP...' : 'Continue'}</span>
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP sent to +91 {phone}
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="6-digit OTP"
                maxLength={6}
              />
              <div className="mt-2 flex justify-between items-center">
                <button 
                  type="button" 
                  onClick={() => setStep('phone')}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Change number
                </button>
                <button 
                  type="button" 
                  className="text-sm text-blue-600 hover:text-blue-500"
                  onClick={() => sendOtp(phone)}
                >
                  Resend OTP
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;