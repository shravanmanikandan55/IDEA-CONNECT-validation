
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDevice } from '../hooks/useDevice';

interface SettingsPageProps {
  onDeleteAccount: () => void;
  onLogout: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onDeleteAccount, onLogout }) => {
  const { t, i18n } = useTranslation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { deviceType, isPWA } = useDevice();
  const isMobileOrPWA = deviceType === 'mobile' || isPWA;

  const languages = [
    { name: 'English', code: 'en' },
    { name: 'Spanish', code: 'es' },
    { name: 'French', code: 'fr' },
    { name: 'German', code: 'de' },
    { name: 'Chinese', code: 'zh' },
    { name: 'Japanese', code: 'ja' }
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  const labelStyles = "block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2";
  const selectStyles = "w-full bg-[#1e293b]/50 border border-gray-700 text-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#00BA9D] focus:border-transparent transition-all outline-none appearance-none cursor-pointer";

  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in max-w-3xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{t('Settings')}</h1>
        <p className="text-gray-400">Manage your account preferences and security settings.</p>
      </div>

      <div className="space-y-8">
        {/* Language Settings */}
        <section className="bg-[#1e293b]/20 border border-gray-800 rounded-3xl p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 11.37 9.188 15.287 5.718 18.842" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{t('Language & Region')}</h3>
              <p className="text-gray-500 text-sm">{t('Select your preferred language for the interface.')}</p>
            </div>
          </div>

          <div className="max-w-xs relative">
            <label className={labelStyles}>{t('INTERFACE LANGUAGE')}</label>
            <div className="relative">
              <select 
                className={selectStyles}
                value={i18n.language.split('-')[0]}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{t(lang.name)}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Account Actions (Mobile Only) */}
        {isMobileOrPWA && (
          <section className="bg-[#1e293b]/20 border border-gray-800 rounded-3xl p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Account</h3>
                <p className="text-gray-500 text-sm">Manage your session.</p>
              </div>
            </div>

            <button 
              onClick={onLogout}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2 border border-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{t('Logout')}</span>
            </button>
          </section>
        )}

        {/* Danger Zone */}
        <section className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Danger Zone</h3>
              <p className="text-gray-500 text-sm">Irreversible actions for your account.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
            <div>
              <h4 className="text-white font-bold mb-1">Delete Account</h4>
              <p className="text-gray-500 text-xs">Once you delete your account, there is no going back. Please be certain.</p>
            </div>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-xl font-bold transition-all whitespace-nowrap"
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-[#111827] border border-gray-800 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-fade-in-up">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400 mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-2">Are you absolutely sure?</h3>
            <p className="text-gray-400 text-center mb-8">
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </p>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={onDeleteAccount}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20"
              >
                Yes, Delete My Account
              </button>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full py-3 text-gray-400 hover:text-white font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
