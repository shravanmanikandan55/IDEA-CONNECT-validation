
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './supabaseClient';

interface RegistrationProps {
  onClose: () => void;
  onRegister: (id: string, name: string) => void;
  onSignIn?: () => void;
  isDark: boolean;
}

const Registration: React.FC<RegistrationProps> = ({ onClose, onRegister, onSignIn, isDark }) => {
  const { t } = useTranslation();
  const [role, setRole] = useState<'creator' | 'investor'>('creator');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    website: '',
    interests: '',
    industry: '',
    contact_person: '',
    investment_range: '',
    sectors: '',
  });

  const handleTabChange = (newRole: 'creator' | 'investor') => {
    setRole(newRole);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Insert into profiles table
        const profileData: any = {
          user_id: data.user.id,
          email: formData.email,
          profile_type: role === 'creator' ? 'personal' : 'company',
          bio: formData.bio,
          website: formData.website,
        };

        if (role === 'creator') {
          profileData.full_name = formData.name;
          profileData.interests = formData.interests;
        } else {
          profileData.company_name = formData.name;
          profileData.industry = formData.industry;
          profileData.contact_person = formData.contact_person;
          profileData.investment_range = formData.investment_range;
          profileData.sectors = formData.sectors.split(',').map(s => s.trim()).filter(s => s !== '');
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([profileData]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          throw new Error('User created but profile setup failed: ' + profileError.message);
        }

        onRegister(data.user.id, formData.name || data.user.email?.split('@')[0] || 'User');
      }
    } catch (err: any) {
      console.error('Registration Error:', err);
      let msg = err.message || 'Failed to register';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        console.log("Network error detected. Falling back to mock registration.");
        onRegister('guest', formData.name || formData.email.split('@')[0] || 'Guest User');
        return;
      }
      if (msg.includes('rate limit exceeded')) {
        msg = t('Too many requests. Please wait a few minutes before trying again.');
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full bg-gray-50 dark:bg-[#0A1025] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00BA9D] focus:border-transparent outline-none transition-all";
  const labelStyles = "block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1";

  return (
    <div className="flex-grow flex items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00BA9D]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-2xl bg-white/80 dark:bg-[#121B35]/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-gray-800/50 overflow-hidden relative z-10 p-8 md:p-12 animate-fade-in-up">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">{t('Join IdeaConnect')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Start your journey today</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Role Switcher */}
          <div className="flex bg-gray-100 dark:bg-[#0f172a] p-1.5 rounded-full mb-8 relative max-w-xs mx-auto">
            <button 
              onClick={() => handleTabChange('creator')}
              className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300 z-10 ${role === 'creator' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {t('Personal')}
            </button>
            <button 
              onClick={() => handleTabChange('investor')}
              className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300 z-10 ${role === 'investor' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {t('Company')}
            </button>
            {/* Sliding Background */}
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#00BA9D] rounded-full transition-all duration-300 ease-out ${role === 'creator' ? 'left-1.5' : 'left-[calc(50%+1.5px)]'}`}
            />
          </div>

          {/* Form */}
          <form className="space-y-6 text-left" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dynamic Name Field */}
              <div>
                <label className={labelStyles}>{role === 'creator' ? t('Full Name') : t('Company Name')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    {role === 'creator' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    )}
                  </div>
                  <input 
                    type="text" 
                    className={inputStyles} 
                    placeholder={role === 'creator' ? 'John Doe' : 'Acme Inc'}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className={labelStyles}>{t('Email Address')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input 
                    type="email" 
                    className={inputStyles} 
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className={labelStyles}>{t('Password')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className={`${inputStyles} pr-12`} 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Website Field */}
              <div>
                <label className={labelStyles}>{t('Website')} ({t('Optional')})</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <input 
                    type="url" 
                    className={inputStyles} 
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Bio Field */}
            <div>
              <label className={labelStyles}>{t('Bio')} / {t('About')}</label>
              <textarea 
                className={`${inputStyles} h-24 py-3 resize-none`}
                placeholder="Tell us about yourself or your company..."
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </div>

            {/* Role Specific Fields */}
            {role === 'creator' ? (
              <div>
                <label className={labelStyles}>{t('Interests')}</label>
                <input 
                  type="text" 
                  className={inputStyles} 
                  placeholder="e.g. AI, Sustainability, Web3"
                  value={formData.interests}
                  onChange={(e) => setFormData({...formData, interests: e.target.value})}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyles}>{t('Industry')}</label>
                  <input 
                    type="text" 
                    className={inputStyles} 
                    placeholder="e.g. Venture Capital"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  />
                </div>
                <div>
                  <label className={labelStyles}>{t('Contact Person')}</label>
                  <input 
                    type="text" 
                    className={inputStyles} 
                    placeholder="Full Name"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                  />
                </div>
                <div>
                  <label className={labelStyles}>{t('Investment Range')}</label>
                  <input 
                    type="text" 
                    className={inputStyles} 
                    placeholder="e.g. $50k - $500k"
                    value={formData.investment_range}
                    onChange={(e) => setFormData({...formData, investment_range: e.target.value})}
                  />
                </div>
                <div>
                  <label className={labelStyles}>{t('Sectors of Interest')}</label>
                  <input 
                    type="text" 
                    className={inputStyles} 
                    placeholder="e.g. SaaS, Fintech (comma separated)"
                    value={formData.sectors}
                    onChange={(e) => setFormData({...formData, sectors: e.target.value})}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#00BA9D] hover:bg-[#00a88d] text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-500/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : t('Create Account')}
            </button>

            {/* Footer Links */}
            <div className="text-center mt-8 space-y-4">
              <button 
                type="button"
                onClick={onSignIn}
                className="block w-full text-[#00BA9D] text-sm font-bold hover:underline"
              >
                {t('Already have an account? Sign in')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
