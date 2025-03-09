import React, { useState, useEffect } from 'react';
import { Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Offer {
  id: string;
  title: string;
  description: string;
  image_url: string;
  discount_percentage: number;
}

const OffersBanner = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const { data } = await supabase
        .from('offers')
        .select('*')
        .eq('active', true)
        .gte('end_date', new Date().toISOString().split('T')[0])
        .lte('start_date', new Date().toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (data) setOffers(data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const nextOffer = () => {
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  const prevOffer = () => {
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  if (offers.length === 0) return null;

  const currentOffer = offers[currentIndex];

  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl overflow-hidden">
      {offers.length > 1 && (
        <>
          <button
            onClick={prevOffer}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full hover:bg-white/30"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextOffer}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full hover:bg-white/30"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <div className="flex items-center p-8">
        {currentOffer.image_url && (
          <img
            src={currentOffer.image_url}
            alt={currentOffer.title}
            className="h-32 w-32 object-cover rounded-lg mr-8"
          />
        )}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Tag className="h-5 w-5" />
            <h3 className="text-xl font-bold">{currentOffer.title}</h3>
          </div>
          <p className="mb-4">{currentOffer.description}</p>
          <div className="inline-block bg-white text-blue-600 px-4 py-2 rounded-full font-bold">
            {currentOffer.discount_percentage}% OFF
          </div>
        </div>
      </div>

      {offers.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersBanner;