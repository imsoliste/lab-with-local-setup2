import { supabase } from '../supabase';

export const getTests = async () => {
  try {
    const { data: tests, error } = await supabase
      .from('tests')
      .select(`
        *,
        category:test_categories(
          id,
          name,
          description
        ),
        lab_test_prices(
          id,
          price,
          discounted_price,
          home_collection_available,
          home_collection_fee,
          lab:labs(
            id,
            name,
            description,
            address,
            city,
            rating,
            accredited
          )
        )
      `)
      .order('name');
      
    if (error) throw error;
    
    console.log('Fetched tests:', tests); // For debugging
    
    return tests;
  } catch (error) {
    console.error('Error fetching tests:', error);
    throw error;
  }
};

export const searchTests = async (query: string) => {
  try {
    const { data: tests, error } = await supabase
      .from('tests')
      .select(`
        *,
        category:test_categories(
          id,
          name,
          description
        ),
        lab_test_prices(
          id,
          price,
          discounted_price,
          home_collection_available,
          home_collection_fee,
          lab:labs(
            id,
            name,
            description,
            address,
            city,
            rating,
            accredited
          )
        )
      `)
      .or(`
        name.ilike.%${query}%,
        description.ilike.%${query}%
      `)
      .order('name');
      
    if (error) throw error;
    return tests;
  } catch (error) {
    console.error('Error searching tests:', error);
    throw error;
  }
};