import React, { useState } from 'react';
import { Bell, Plus, X, Clock, Calendar, Pill } from 'lucide-react';
import { Button } from './ui/button';

type Medication = {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  startDate: string;
  endDate?: string;
};

const MedicationReminder = () => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      name: 'Vitamin D3',
      dosage: '60000 IU',
      frequency: 'Weekly',
      time: '09:00',
      startDate: '2025-03-01',
      endDate: '2025-06-01'
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState<Medication>({
    id: 0,
    name: '',
    dosage: '',
    frequency: 'Daily',
    time: '',
    startDate: '',
  });
  
  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.time && newMedication.startDate) {
      setMedications([
        ...medications,
        {
          ...newMedication,
          id: medications.length + 1
        }
      ]);
      setNewMedication({
        id: 0,
        name: '',
        dosage: '',
        frequency: 'Daily',
        time: '',
        startDate: '',
      });
      setShowAddForm(false);
    }
  };
  
  const handleRemoveMedication = (id: number) => {
    setMedications(medications.filter(med => med.id !== id));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Medication Reminders</h2>
          <Button 
            size="sm" 
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Medication</span>
          </Button>
        </div>
        
        {medications.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No medications added yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map(medication => (
              <div key={medication.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Pill className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium">{medication.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Dosage: {medication.dosage}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {medication.time}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {medication.frequency}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {medication.startDate} {medication.endDate ? `to ${medication.endDate}` : '(ongoing)'}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveMedication(medication.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {showAddForm && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-md font-medium mb-4">Add New Medication</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medication Name
                </label>
                <input
                  type="text"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter medication name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage
                </label>
                <input
                  type="text"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter dosage (e.g., 500mg)"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={newMedication.frequency}
                    onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newMedication.time}
                    onChange={(e) => setNewMedication({...newMedication, time: e.target.value})}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newMedication.startDate}
                    onChange={(e) => setNewMedication({...newMedication, startDate: e.target.value})}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newMedication.endDate || ''}
                    onChange={(e) => setNewMedication({...newMedication, endDate: e.target.value})}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={handleAddMedication}>
                  Add Medication
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
    </div>
  );
};

export default MedicationReminder;