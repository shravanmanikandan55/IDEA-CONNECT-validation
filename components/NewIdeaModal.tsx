
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { validateContent } from '../utils/aiValidation';

interface NewIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (idea: any) => void;
}

const NewIdeaModal: React.FC<NewIdeaModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    category: 'SaaS',
    stage: 'idea',
    description: '',
    tags: '',
    seeking_investment: false,
    investment_amount: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const textToValidate = `Title: ${formData.title}\nDescription: ${formData.description}`;
    const validation = await validateContent(textToValidate);

    if (!validation.isValid) {
      setErrorMsg(validation.reason || "Your idea violates community policies and cannot be posted.");
      setIsSubmitting(false);
      return;
    }

    onSubmit(formData);
    setIsSubmitting(false);
    onClose();
  };

  const inputStyles = "w-full bg-[#1e293b]/50 border border-gray-700 text-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#00BA9D] focus:border-transparent transition-all outline-none placeholder:text-gray-500";
  const labelStyles = "block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[#111827] border border-gray-800 rounded-3xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">{t('Share Your Vision')}</h2>
            <p className="text-gray-500 text-sm">{t('Fill in the details to start your validation journey.')}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm font-medium">
              {errorMsg}
            </div>
          )}
          <form id="new-idea-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyles}>{t('Idea Title')}</label>
                <input 
                  type="text" 
                  className={inputStyles} 
                  placeholder="e.g. AI Plant Care Assistant"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className={labelStyles}>{t('Category')}</label>
                <select 
                  className={inputStyles}
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="SaaS">SaaS</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Sustainability">Sustainability</option>
                  <option value="EdTech">EdTech</option>
                  <option value="Fintech">Fintech</option>
                  <option value="HealthTech">HealthTech</option>
                  <option value="Web3">Web3</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelStyles}>{t('Validation Stage')}</label>
              <div className="flex bg-[#0f172a] p-1 rounded-xl">
                {[
                  { id: 'idea', label: t('Idea') },
                  { id: 'prototype', label: t('Prototype') },
                  { id: 'mvp', label: t('MVP') },
                  { id: 'launched', label: t('Launched') }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFormData({...formData, stage: s.id})}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.stage === s.id ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-[#0f172a]/30 border border-gray-800 rounded-2xl">
              <input 
                type="checkbox" 
                id="seeking_investment"
                className="w-5 h-5 rounded border-gray-700 text-[#00BA9D] focus:ring-[#00BA9D] bg-gray-900"
                checked={formData.seeking_investment}
                onChange={(e) => setFormData({...formData, seeking_investment: e.target.checked})}
              />
              <label htmlFor="seeking_investment" className="text-sm font-medium text-gray-300 cursor-pointer">
                {t('Seeking Investment')}
              </label>
            </div>

            {formData.seeking_investment && (
              <div className="animate-fade-in">
                <label className={labelStyles}>{t('Target Investment Amount')}</label>
                <input 
                  type="text" 
                  className={inputStyles} 
                  placeholder="e.g. $50,000"
                  value={formData.investment_amount}
                  onChange={(e) => setFormData({...formData, investment_amount: e.target.value})}
                  required={formData.seeking_investment}
                />
              </div>
            )}

            <div>
              <label className={labelStyles}>{t('Description')}</label>
              <textarea 
                rows={6}
                className={inputStyles} 
                placeholder="Describe your idea, the problem it solves, and how it works..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div>
              <label className={labelStyles}>{t('Tags')}</label>
              <input 
                type="text" 
                className={inputStyles} 
                placeholder="e.g. AI, Mobile, B2B (comma separated)"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                required
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 bg-[#0f172a]/50 flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 text-gray-400 font-bold hover:text-white transition-colors"
          >
            {t('Cancel')}
          </button>
          <button 
            type="submit" 
            form="new-idea-form"
            disabled={isSubmitting}
            className="bg-[#00BA9D] hover:bg-[#00a88d] text-white px-8 py-2.5 rounded-full font-bold shadow-lg shadow-teal-500/20 transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('Validating & Publishing...') : t('Publish to Community')}
          </button>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
};

export default NewIdeaModal;
