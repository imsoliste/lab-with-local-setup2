import { supabase } from '../supabase';

export const getLabs = async () => {
  try {
    const { data, error } = await supabase
      .from('labs')
      .select(`
        *,
        lab_test_prices(
          id,
          price,
          discounted_price,
          test:tests(
            id,
            name,
            category:test_categories(name)
          )
        )
      `)
      .order('name');
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching labs:', error);
    throw error;
  }
};

export const getLabById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('labs')
      .select(`
        *,
        lab_test_prices(
          id,
          price,
          discounted_price,
          test:tests(
            id,
            name,
            category:test_categories(name)
          )
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching lab:', error);
    throw error;
  }
};

export const getLabsByCity = async (city: string) => {
  try {
    const { data, error } = await supabase
      .from('labs')
      .select(`
        *,
        lab_test_prices(
          id,
          price,
          discounted_price,
          test:tests(
            id,
            name,
            category:test_categories(name)
          )
        )
      `)
      .eq('city', city)
      .order('name');
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching labs by city:', error);
    throw error;
  }
};

export const getLabPrices = async (labId: string) => {
  try {
    const { data, error } = await supabase
      .from('lab_test_prices')
      .select(`
        *,
        test:tests(
          id,
          name,
          category:test_categories(name)
        ),
        lab:labs(*)
      `)
      .eq('lab_id', labId);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching lab prices:', error);
    throw error;
  }
};

export const updateLabPrice = async (
  priceId: string, 
  updates: { price: number; discounted_price: number }
) => {
  try {
    const { data, error } = await supabase
      .from('lab_test_prices')
      .update(updates)
      .eq('id', priceId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating lab price:', error);
    throw error;
  }
};