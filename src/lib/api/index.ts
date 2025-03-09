import { supabase } from '../supabase';
import { bookingSchema, userSchema, paymentSchema } from '../validation';
import type { Booking, User, Payment } from '@/types';

// User API
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Booking API
export const createBooking = async (bookingData: Omit<Booking, 'id' | 'created_at'>) => {
  try {
    const validatedData = bookingSchema.parse(bookingData);
    
    const { data, error } = await supabase
      .from('bookings')
      .insert([validatedData])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getUserBookings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        test:tests(*),
        lab:labs(*),
        payments(*),
        test_results(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

export const getBookingById = async (bookingId: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        test:tests(*),
        lab:labs(*),
        payments(*),
        test_results(*)
      `)
      .eq('id', bookingId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

// Payment API
export const createPayment = async (paymentData: Omit<Payment, 'id' | 'created_at'>) => {
  try {
    const validatedData = paymentSchema.parse(paymentData);
    
    const { data, error } = await supabase
      .from('payments')
      .insert([validatedData])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const updatePaymentStatus = async (paymentId: string, status: string, transactionId?: string) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({ 
        status,
        ...(transactionId && { transaction_id: transactionId })
      })
      .eq('id', paymentId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

// Test Results API
export const uploadTestResult = async (bookingId: string, resultData: any, reportUrl?: string) => {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .insert([{
        booking_id: bookingId,
        result_data: resultData,
        report_url: reportUrl,
        status: 'completed'
      }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error uploading test result:', error);
    throw error;
  }
};

export const getTestResult = async (bookingId: string) => {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('booking_id', bookingId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching test result:', error);
    throw error;
  }
};