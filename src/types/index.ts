export interface User {
  id: string;
  email: string;
  phone: string;
  name?: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  test_id: string;
  lab_id: string;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  payment_id?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  gateway_payment_id?: string;
  created_at: string;
}

export interface Test {
  id: string;
  name: string;
  description: string;
  parameters: string[];
  labs: Lab[];
}

export interface Lab {
  id: string;
  name: string;
  price: number;
  discountedPrice: number;
  turnaround: string;
  rating?: number;
  actualPrice?: number;
  bestSeller?: boolean;
}