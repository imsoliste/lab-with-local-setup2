import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../lib/supabase';

interface Offer {
  id: string;
  title: string;
  description: string;
  image_url: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  active: boolean;
}

const OffersManager = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOffer, setNewOffer] = useState<Partial<Offer>>({
    title: '',
    description: '',
    image_url: '',
    discount_percentage: 10,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    active: true
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError('Failed to fetch offers');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `offers/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('offers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('offers')
        .getPublicUrl(filePath);

      setNewOffer({ ...newOffer, image_url: publicUrl });
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('offers')
        .insert([newOffer])
        .select()
        .single();

      if (error) throw error;

      setOffers([data, ...offers]);
      setShowAddForm(false);
      setNewOffer({
        title: '',
        description: '',
        image_url: '',
        discount_percentage: 10,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        active: true
      });
    } catch (err) {
      console.error('Error creating offer:', err);
      setError('Failed to create offer');
    } finally {
      setLoading(false);
    }
  };

  const deleteOffer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setOffers(offers.filter(offer => offer.id !== id));
    } catch (err) {
      console.error('Error deleting offer:', err);
      setError('Failed to delete offer');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Special Offers</h2>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Offer</span>
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newOffer.title}
                onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newOffer.description}
                onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div className="flex items-center space-x-4">
                {newOffer.image_url && (
                  <img 
                    src={newOffer.image_url} 
                    alt="Offer preview" 
                    className="h-20 w-20 object-cover rounded-md"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="offer-image"
                />
                <label 
                  htmlFor="offer-image"
                  className="px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50 flex items-center space-x-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>Upload Image</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Percentage
                </label>
                <input
                  type="number"
                  value={newOffer.discount_percentage}
                  onChange={(e) => setNewOffer({ ...newOffer, discount_percentage: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-md"
                  min="1"
                  max="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Active
                </label>
                <select
                  value={newOffer.active ? 'true' : 'false'}
                  onChange={(e) => setNewOffer({ ...newOffer, active: e.target.value === 'true' })}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newOffer.start_date}
                  onChange={(e) => setNewOffer({ ...newOffer, start_date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={newOffer.end_date}
                  onChange={(e) => setNewOffer({ ...newOffer, end_date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Offer'}
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {offers.map(offer => (
          <div key={offer.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between">
              <div className="flex space-x-4">
                {offer.image_url && (
                  <img 
                    src={offer.image_url} 
                    alt={offer.title}
                    className="h-24 w-24 object-cover rounded-md"
                  />
                )}
                <div>
                  <h3 className="font-medium">{offer.title}</h3>
                  <p className="text-sm text-gray-600">{offer.description}</p>
                  <div className="mt-2 space-x-4 text-sm">
                    <span className="text-green-600 font-medium">{offer.discount_percentage}% OFF</span>
                    <span className="text-gray-500">
                      {new Date(offer.start_date).toLocaleDateString()} - {new Date(offer.end_date).toLocaleDateString()}
                    </span>
                    <span className={`${offer.active ? 'text-green-600' : 'text-red-600'}`}>
                      {offer.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => deleteOffer(offer.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersManager;