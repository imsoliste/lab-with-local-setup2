import { loadScript } from '@/lib/utils';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

export const initializeRazorpay = async () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount: number) => {
  try {
    const response = await fetch('/api/create-razorpay-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

export const processPayment = async (
  orderId: string,
  amount: number,
  onSuccess: (paymentId: string) => void,
  onError: (error: any) => void
) => {
  const options = {
    key: RAZORPAY_KEY,
    amount: amount * 100, // Amount in paise
    currency: 'INR',
    name: 'MedLab Compare',
    description: 'Lab Test Booking',
    order_id: orderId,
    handler: function (response: any) {
      onSuccess(response.razorpay_payment_id);
    },
    prefill: {
      name: '',
      email: '',
      contact: ''
    },
    theme: {
      color: '#2563EB'
    }
  };

  const paymentObject = new (window as any).Razorpay(options);
  paymentObject.open();
  
  paymentObject.on('payment.failed', function (response: any) {
    onError(response.error);
  });
};