import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Bell, Heart, FileText, Shield, Clock, Plus, X, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || 'Sachin Sharma');
  const [email, setEmail] = useState(user?.email || 'sachinsharma75012@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '7339799364');
  const [address, setAddress] = useState('Near Tagore School');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // New state for additional features
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: 'Rahul Sharma', relation: 'Brother', age: 28 }
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');
  const [newMemberAge, setNewMemberAge] = useState('');
  const [healthRecords, setHealthRecords] = useState([
    { id: 1, date: '2025-03-15', type: 'Blood Test', result: 'Normal', file: null }
  ]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showUploadRecord, setShowUploadRecord] = useState(false);
  const [newRecordDate, setNewRecordDate] = useState('');
  const [newRecordType, setNewRecordType] = useState('');
  const [newRecordResult, setNewRecordResult] = useState('');
  const [healthAlerts, setHealthAlerts] = useState([
    { id: 1, message: 'Your annual health checkup is due next month', type: 'reminder' },
    { id: 2, message: 'Remember to stay hydrated during summer', type: 'tip' }
  ]);
  
  if (!user) {
    navigate('/');
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateUserProfile({
        name,
        email,
        phone
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const addFamilyMember = () => {
    if (newMemberName && newMemberRelation && newMemberAge) {
      const newMember = {
        id: familyMembers.length + 1,
        name: newMemberName,
        relation: newMemberRelation,
        age: parseInt(newMemberAge)
      };
      setFamilyMembers([...familyMembers, newMember]);
      setNewMemberName('');
      setNewMemberRelation('');
      setNewMemberAge('');
      setShowAddMember(false);
    }
  };

  const removeFamilyMember = (id: number) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
  };

  const addHealthRecord = () => {
    if (newRecordDate && newRecordType && newRecordResult) {
      const newRecord = {
        id: healthRecords.length + 1,
        date: newRecordDate,
        type: newRecordType,
        result: newRecordResult,
        file: null
      };
      setHealthRecords([...healthRecords, newRecord]);
      setNewRecordDate('');
      setNewRecordType('');
      setNewRecordResult('');
      setShowUploadRecord(false);
    }
  };

  const removeHealthRecord = (id: number) => {
    setHealthRecords(healthRecords.filter(record => record.id !== id));
  };

  const dismissAlert = (id: number) => {
    setHealthAlerts(healthAlerts.filter(alert => alert.id !== id));
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="h-5 w-5 mb-1 mx-auto" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('family')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'family'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Heart className="h-5 w-5 mb-1 mx-auto" />
              Family
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'records'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-5 w-5 mb-1 mx-auto" />
              Health Records
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Bell className="h-5 w-5 mb-1 mx-auto" />
              Notifications
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'profile' && (
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{name || 'User'}</h2>
                  <p className="text-gray-600">{phone}</p>
                </div>
              </div>
              
              {success && (
                <div className="bg-green-50 text-green-700 p-3 rounded-md mb-6">
                  Profile updated successfully!
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <Phone className="h-4 w-4" />
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full px-4 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                      disabled
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Phone number cannot be changed
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Address
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your default address for home collection"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <Button 
                    type="submit" 
                    className="flex items-center space-x-2"
                    disabled={loading}
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'family' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Family Members</h2>
                <Button 
                  size="sm" 
                  onClick={() => setShowAddMember(true)}
                  className="flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Member</span>
                </Button>
              </div>
              
              {familyMembers.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No family members added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {familyMembers.map(member => (
                    <div key={member.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.relation} • {member.age} years</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/bookings?member=${member.id}`)}
                        >
                          View Tests
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => removeFamilyMember(member.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {showAddMember && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-md font-medium mb-4">Add Family Member</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Relation
                        </label>
                        <select
                          value={newMemberRelation}
                          onChange={(e) => setNewMemberRelation(e.target.value)}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select relation</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Child">Child</option>
                          <option value="Parent">Parent</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          value={newMemberAge}
                          onChange={(e) => setNewMemberAge(e.target.value)}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter age"
                          min="1"
                          max="120"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={addFamilyMember}>
                        Add Member
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddMember(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'records' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Health Records</h2>
                <Button 
                  size="sm" 
                  onClick={() => setShowUploadRecord(true)}
                  className="flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Record</span>
                </Button>
              </div>
              
              {healthRecords.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No health records added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {healthRecords.map(record => (
                    <div key={record.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{record.type}</h3>
                        <p className="text-sm text-gray-600">Date: {record.date} • Result: {record.result}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => removeHealthRecord(record.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {showUploadRecord && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-md font-medium mb-4">Add Health Record</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Test Type
                      </label>
                      <select
                        value={newRecordType}
                        onChange={(e) => setNewRecordType(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select test type</option>
                        <option value="Blood Test">Blood Test</option>
                        <option value="Thyroid Test">Thyroid Test</option>
                        <option value="Lipid Profile">Lipid Profile</option>
                        <option value="Diabetes Test">Diabetes Test</option>
                        <option value="Vitamin D Test">Vitamin D Test</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={newRecordDate}
                          onChange={(e) => setNewRecordDate(e.target.value)}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Result
                        </label>
                        <select
                          value={newRecordResult}
                          onChange={(e) => setNewRecordResult(e.target.value)}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select result</option>
                          <option value="Normal">Normal</option>
                          <option value="Abnormal">Abnormal</option>
                          <option value="Borderline">Borderline</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Report (Optional)
                      </label>
                      <input
                        type="file"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Supported formats: PDF, JPG, PNG (Max 5MB)
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={addHealthRecord}>
                        Add Record
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowUploadRecord(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable Notifications</h3>
                    <p className="text-sm text-gray-600">Receive updates about your tests and bookings</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notificationsEnabled} 
                      onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {notificationsEnabled && (
                  <>
                    <div className="flex items-center justify-between pl-4 border-l-2 border-gray-200">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={emailNotifications} 
                          onChange={() => setEmailNotifications(!emailNotifications)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between pl-4 border-l-2 border-gray-200">
                      <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={smsNotifications} 
                          onChange={() => setSmsNotifications(!smsNotifications)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </>
                )}
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Health Alerts & Reminders</h3>
                  
                  {healthAlerts.length === 0 ? (
                    <p className="text-sm text-gray-600">No active alerts or reminders</p>
                  ) : (
                    <div className="space-y-3">
                      {healthAlerts.map(alert => (
                        <div key={alert.id} className={`p-3 rounded-md flex justify-between items-start ${
                          alert.type === 'reminder' ? 'bg-blue-50' : 'bg-green-50'
                        }`}>
                          <div className="flex items-start space-x-2">
                            <AlertCircle className={`h-5 w-5 mt-0.5 ${
                              alert.type === 'reminder' ? 'text-blue-600' : 'text-green-600'
                            }`} />
                            <p className={`text-sm ${
                              alert.type === 'reminder' ? 'text-blue-700' : 'text-green-700'
                            }`}>
                              {alert.message}
                            </p>
                          </div>
                          <button 
                            onClick={() => dismissAlert(alert.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Health Insights Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Health Insights</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Next Checkup</h3>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <p className="text-blue-700">Annual checkup due in 45 days</p>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Recent Tests</h3>
              <p className="text-green-700">2 tests completed in last 3 months</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">Health Score</h3>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <p className="text-purple-700">85/100 - Good</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommended Tests Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recommended Tests</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Complete Blood Count</h3>
              <p className="text-sm text-gray-600 mb-3">Recommended every 6 months</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-bold">₹359</span>
                <Button size="sm" onClick={() => navigate('/book/1')}>Book Now</Button>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Vitamin D Test</h3>
              <p className="text-sm text-gray-600 mb-3">Recommended yearly</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-bold">₹809</span>
                <Button size="sm" onClick={() => navigate('/book/4')}>Book Now</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;