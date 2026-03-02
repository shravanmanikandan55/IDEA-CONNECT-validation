import React from 'react';
import { LayoutDashboard, Users, Shield, LogOut } from 'lucide-react';

interface AdminBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const AdminBottomNav: React.FC<AdminBottomNavProps> = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#020617] border-t border-gray-800 pb-safe pt-2 px-4 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <button 
        onClick={() => setActiveTab('Overview')} 
        className={`flex flex-col items-center p-2 ${activeTab === 'Overview' ? 'text-indigo-500' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <LayoutDashboard className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">Overview</span>
      </button>
      
      <button 
        onClick={() => setActiveTab('Users')} 
        className={`flex flex-col items-center p-2 ${activeTab === 'Users' ? 'text-indigo-500' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <Users className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">Users</span>
      </button>

      <button 
        onClick={() => setActiveTab('Moderation')} 
        className={`flex flex-col items-center p-2 ${activeTab === 'Moderation' ? 'text-indigo-500' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <Shield className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">Moderation</span>
      </button>

      <button 
        onClick={onLogout} 
        className="flex flex-col items-center p-2 text-red-500 hover:text-red-400"
      >
        <LogOut className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">Logout</span>
      </button>
    </div>
  );
};

export default AdminBottomNav;
