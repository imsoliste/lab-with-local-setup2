import { supabase } from '../supabase';
import type { Payment } from '@/types';

export const createPayment = async (paymentData: Omit<Payment, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const getPaymentsByBooking = async (bookingId: string) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

export const updatePaymentStatus = async (id: string, status: string, transactionId?: string) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({ 
        status,
        ...(transactionId && { transaction_id: transactionId })
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};