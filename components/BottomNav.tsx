import React from 'react';
import { Home, PlusCircle, User, Briefcase, Settings } from 'lucide-react';

interface BottomNavProps {
  isDark: boolean;
  onPostIdea: () => void;
  onAdmin: () => void;
  onForInvestors: () => void;
  onSignIn: () => void;
  onHome: () => void;
  currentView?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ isDark, onPostIdea, onAdmin, onForInvestors, onSignIn, onHome, currentView }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#050914] border-t border-gray-200 dark:border-gray-800 pb-safe pt-2 px-4 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <button onClick={onHome} className="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
        <Home className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">Home</span>
      </button>
      
      <button onClick={onForInvestors} className="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
        <Briefcase className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">Investors</span>
      </button>

      <div className="relative -top-6">
        <button 
          onClick={onPostIdea}
          className="flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-full text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-transform hover:scale-105"
        >
          <PlusCircle className="w-8 h-8" />
        </button>
      </div>

      <button onClick={onSignIn} className="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
        <User className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">Sign In</span>
      </button>

      <button onClick={onAdmin} className="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
        <Settings className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium">Admin</span>
      </button>
    </div>
  );
};

export default BottomNav;
