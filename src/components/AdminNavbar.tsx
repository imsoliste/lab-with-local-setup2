import React from 'react';
import { Microscope, Bell, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';

type AdminNavbarProps = {
  onLogout: () => void;
};

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Microscope className="h-6 w-6 text-blue-600" />
        <span className="text-xl font-bold">MedLab Admin</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-sm font-medium">Admin</span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center space-x-1"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default AdminNavbar;