
import React from 'react';

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  numberedStep?: number;
  className?: string;
}

const DarkCard: React.FC<CardProps> = ({ icon, title, description, numberedStep, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-[#182137] p-6 rounded-lg border border-gray-100 dark:border-transparent shadow-sm dark:shadow-xl flex flex-col items-center text-center transition-all duration-300 hover:shadow-md dark:hover:shadow-indigo-500/10 ${className}`}>
      {numberedStep && (
        <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-2">
          {numberedStep}
        </div>
      )}
      <div className="text-indigo-600 dark:text-indigo-400 text-4xl mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

export default DarkCard;
