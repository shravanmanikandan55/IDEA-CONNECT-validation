import React from 'react';
import { LayoutDashboard, Compass, PlusCircle, Users, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DashboardBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewIdea: () => void;
}

const DashboardBottomNav: React.FC<DashboardBottomNavProps> = ({ activeTab, setActiveTab, onNewIdea }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#020617] border-t border-gray-800 pb-safe pt-2 px-4 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <button 
        onClick={() => setActiveTab('Dashboard')} 
        className={`flex flex-col items-center p-2 ${activeTab === 'Dashboard' ? 'text-[#00BA9D]' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <LayoutDashboard className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">{t('Dashboard')}</span>
      </button>
      
      <button 
        onClick={() => setActiveTab('Browse Ideas')} 
        className={`flex flex-col items-center p-2 ${activeTab === 'Browse Ideas' ? 'text-[#00BA9D]' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <Compass className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">{t('Browse')}</span>
      </button>

      <div className="relative -top-6">
        <button 
          onClick={onNewIdea}
          className="flex items-center justify-center w-14 h-14 bg-[#00BA9D] rounded-full text-white shadow-lg shadow-teal-500/30 hover:bg-[#00a88d] transition-transform hover:scale-105"
        >
          <PlusCircle className="w-8 h-8" />
        </button>
      </div>

      <button 
        onClick={() => setActiveTab('Investors')} 
        className={`flex flex-col items-center p-2 ${activeTab === 'Investors' ? 'text-[#00BA9D]' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <Users className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">{t('Investors')}</span>
      </button>

      <button 
        onClick={() => setActiveTab('Profile')} 
        className={`flex flex-col items-center p-2 ${activeTab === 'Profile' ? 'text-[#00BA9D]' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <User className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">{t('Profile')}</span>
      </button>
    </div>
  );
};

export default DashboardBottomNav;
