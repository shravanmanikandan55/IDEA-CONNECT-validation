
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactInfo: {
    name: string;
    email?: string;
    website?: string;
    linkedin?: string;
    phone?: string;
  };
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, contactInfo }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0f172a] border border-gray-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{t('Contact')} {contactInfo.name}</h2>
              <p className="text-teal-400 text-sm font-medium italic">
                {t('u can contact the user and discuss more about it directly by the given contacts below')}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {contactInfo.email && (
              <div className="bg-gray-800/30 border border-gray-700/50 p-4 rounded-2xl flex items-center justify-between group hover:border-teal-500/30 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{t('Email Address')}</p>
                    <p className="text-white font-medium">{contactInfo.email}</p>
                  </div>
                </div>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-gray-500 hover:text-teal-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {contactInfo.website && (
              <div className="bg-gray-800/30 border border-gray-700/50 p-4 rounded-2xl flex items-center justify-between group hover:border-teal-500/30 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{t('Website')}</p>
                    <p className="text-white font-medium">{contactInfo.website}</p>
                  </div>
                </div>
                <a 
                  href={contactInfo.website.startsWith('http') ? contactInfo.website : `https://${contactInfo.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {contactInfo.linkedin && (
              <div className="bg-gray-800/30 border border-gray-700/50 p-4 rounded-2xl flex items-center justify-between group hover:border-teal-500/30 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{t('LinkedIn')}</p>
                    <p className="text-white font-medium">{t('View Profile')}</p>
                  </div>
                </div>
                <a 
                  href={contactInfo.linkedin.startsWith('http') ? contactInfo.linkedin : `https://linkedin.com/in/${contactInfo.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-indigo-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {contactInfo.phone && (
              <div className="bg-gray-800/30 border border-gray-700/50 p-4 rounded-2xl flex items-center justify-between group hover:border-teal-500/30 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{t('Phone Number')}</p>
                    <p className="text-white font-medium">{contactInfo.phone}</p>
                  </div>
                </div>
                <a 
                  href={`tel:${contactInfo.phone}`}
                  className="text-gray-500 hover:text-emerald-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {!contactInfo.email && !contactInfo.website && !contactInfo.linkedin && !contactInfo.phone && (
              <div className="text-center py-8">
                <p className="text-gray-500 italic">{t('No contact information provided by this user.')}</p>
              </div>
            )}
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-8 bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-2xl transition-all"
          >
            {t('Close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
