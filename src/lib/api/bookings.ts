import { supabase } from '../supabase';
import type { Booking } from '@/types';

export const createBooking = async (bookingData: Omit<Booking, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
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
        test: tests (*),
        lab: labs (*),
        payments (*),
        test_results (*)
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

export const getBookingById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        test: tests (*),
        lab: labs (*),
        payments (*),
        test_results (*)
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

export const updateBookingStatus = async (id: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};