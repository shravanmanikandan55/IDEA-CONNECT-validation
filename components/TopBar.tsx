import React from 'react';
import { Lightbulb } from 'lucide-react';

interface TopBarProps {
  isDark: boolean;
  onHome: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ isDark, onHome }) => {
  return (
    <div className="sticky top-0 z-50 bg-white/80 dark:bg-[#080D1D]/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 p-4 flex justify-center items-center">
      <a href="#" onClick={(e) => { e.preventDefault(); onHome(); }} className="flex items-center text-xl font-bold text-indigo-600 dark:text-indigo-400">
        <Lightbulb className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
        IdeaConnect
      </a>
    </div>
  );
};

export default TopBar;
