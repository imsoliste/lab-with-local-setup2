import React, { useState } from 'react';
import { Phone, User, Heart, Plus, X } from 'lucide-react';
import { Button } from './ui/button';

type Contact = {
  id: number;
  name: string;
  relation: string;
  phone: string;
  isDoctor?: boolean;
  specialty?: string;
};

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      relation: 'Family Doctor',
      phone: '9876543210',
      isDoctor: true,
      specialty: 'General Physician'
    },
    {
      id: 2,
      name: 'Rahul Sharma',
      relation: 'Brother',
      phone: '7339799364',
      isDoctor: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState<Contact>({
    id: 0,
    name: '',
    relation: '',
    phone: '',
    isDoctor: false
  });

  const handleAddContact = () => {
    if (newContact.name && newContact.phone && newContact.relation) {
      setContacts([
        ...contacts,
        {
          ...newContact,
          id: contacts.length + 1
        }
      ]);
      setNewContact({
        id: 0,
        name: '',
        relation: '',
        phone: '',
        isDoctor: false
      });
      setShowAddForm(false);
    }
  };

  const handleRemoveContact = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-red-600" />
          <h2 className="text-xl font-semibold">Emergency Contacts</h2>
        </div>
        <Button 
          size="sm"
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-1"
        >
          <Plus className="h-4 w-4" />
          <span>Add Contact</span>
        </Button>
      </div>

      <div className="space-y-4">
        {contacts.map(contact => (
          <div key={contact.id} className={`border rounded-lg p-4 ${contact.isDoctor ? 'bg-blue-50' : ''}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  {contact.isDoctor ? (
                    <User className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Heart className="h-5 w-5 text-red-600" />
                  )}
                  <h3 className="font-medium">{contact.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {contact.relation}
                  {contact.specialty && ` • ${contact.specialty}`}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400 mr-1" />
                  <a href={`tel:${contact.phone}`} className="text-blue-600">
                    {contact.phone}
                  </a>
                </div>
              </div>
              <button
                onClick={() => handleRemoveContact(contact.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-md font-medium mb-4">Add Emergency Contact</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relation
                </label>
                <input
                  type="text"
                  value={newContact.relation}
                  onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter relation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newContact.isDoctor}
                onChange={(e) => setNewContact({...newContact, isDoctor: e.target.checked})}
                className="h-4 w-4 text-blue-600"
              />
              <label className="text-sm text-gray-700">This is a doctor</label>
            </div>

            {newContact.isDoctor && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialty
                </label>
                <input
                  type="text"
                  value={newContact.specialty || ''}
                  onChange={(e) => setNewContact({...newContact, specialty: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter specialty"
                />
              </div>
            )}

            <div className="flex space-x-2">
              <Button onClick={handleAddContact}>
                Add Contact
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyContacts;