
import React, { useState } from 'react';

interface ContactProps {
  onBack: () => void;
  isDark: boolean;
}

const Contact: React.FC<ContactProps> = ({ onBack, isDark }) => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'submitted'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormState('submitted');
    }, 1500);
  };

  const inputStyles = `w-full px-4 py-3 rounded-xl border transition-all outline-none ${
    isDark 
      ? 'bg-[#1e293b]/50 border-gray-700 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' 
      : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
  }`;

  const labelStyles = `block text-xs font-bold uppercase tracking-wider mb-2 ${
    isDark ? 'text-gray-400' : 'text-gray-500'
  }`;

  return (
    <div className={`min-h-screen py-20 px-6 ${isDark ? 'bg-[#080D1D] text-gray-300' : 'bg-slate-50 text-gray-700'}`}>
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-12 flex items-center text-indigo-500 hover:text-indigo-400 font-bold transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>

        <div className="max-w-2xl mx-auto">
          {/* Left Side: Info */}
          <div>
            <h1 className={`text-5xl font-extrabold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Let's <span className="text-indigo-500">Connect</span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              Have questions about validation? Want to partner with us? Or just want to say hello? We're here to help you build the future.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mr-4 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Email Us</h4>
                  <p className="text-gray-400">hello@ideaconnect.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mr-4 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Office</h4>
                  <p className="text-gray-400">123 Innovation Way, Tech City, TC 54321</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mr-4 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Chat with AI</h4>
                  <p className="text-gray-400">Available 24/7 to answer your questions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
