import { supabase } from './supabase';
import { bookingSchema, userSchema, paymentSchema } from './validation';
import type { Booking, User, Payment } from '@/types';

export const createBooking = async (bookingData: Booking) => {
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

export const createPayment = async (paymentData: Payment) => {
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

export const updateUserProfile = async (userData: Partial<User>) => {
  try {
    const validatedData = userSchema.partial().parse(userData);
    
    const { data, error } = await supabase
      .from('users')
      .update(validatedData)
      .eq('id', userData.id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getBookingsByUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        payments (*)
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
        payments (*)
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