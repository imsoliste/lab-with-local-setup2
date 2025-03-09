import React, { useState } from 'react';
import { X, CreditCard, Wallet, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: () => void;
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate payment details
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        setError('Please fill in all card details');
        return;
      }
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        setError('Please enter a valid 16-digit card number');
        return;
      }
      if (cardCvv.length !== 3) {
        setError('Please enter a valid 3-digit CVV');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        setError('Please enter a valid UPI ID');
        return;
      }
    }
    
    // Process payment (simulated)
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Close after showing success
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h3>
            <p className="text-gray-600">Your booking has been confirmed.</p>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <p className="text-sm text-blue-800">Amount to pay: <span className="font-bold">₹{amount.toFixed(2)}</span></p>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
            
            <div className="flex space-x-2 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center space-x-2 ${
                  paymentMethod === 'card' 
                    ? 'bg-blue-50 border-2 border-blue-500 text-blue-700' 
                    : 'border border-gray-300'
                }`}
              >
                <CreditCard className="h-5 w-5" />
                <span>Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center space-x-2 ${
                  paymentMethod === 'upi' 
                    ? 'bg-blue-50 border-2 border-blue-500 text-blue-700' 
                    : 'border border-gray-300'
                }`}
              >
                <Wallet className="h-5 w-5" />
                <span>UPI</span>
              </button>
            </div>
            
            <form onSubmit={handlePayment}>
              {paymentMethod === 'card' ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div>
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="cardExpiry"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cardCvv"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="123"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    id="upiId"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="name@upi"
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full mt-6"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay ₹${amount.toFixed(2)}`}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;