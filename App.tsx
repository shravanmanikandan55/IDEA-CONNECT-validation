
import React, { useState } from 'react';
import Navbar from './components/Navbar';

console.log("APP COMPONENT LOADING...");
import HeroSection from './components/HeroSection';
import StatsGrid from './components/StatsGrid';
import HowItWorksSection from './components/HowItWorksSection';
import PowerfulFeaturesSection from './components/PowerfulFeaturesSection';
import ValidationFlowSection from './components/ValidationFlowSection';
import AnalyticsDashboardSection from './components/AnalyticsDashboardSection';
import CallToActionSection from './components/CallToActionSection';
import Footer from './components/Footer';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import PrivacyPolicy from './components/PrivacyPolicy';
import SuccessStories from './components/SuccessStories';
import Contact from './components/Contact';
import Careers from './components/Careers';
import TermsOfService from './components/TermsOfService';
import ForCompanies from './components/ForCompanies';
import SignIn from './components/SignIn';
import AdminLogin from './components/AdminLogin';
import ForgotPassword from './components/ForgotPassword';
import { isSupabaseConfigured } from './components/supabaseClient';
import { AlertTriangle, X } from 'lucide-react';
import { useDevice } from './hooks/useDevice';
import BottomNav from './components/BottomNav';
import TopBar from './components/TopBar';

// Trigger rebuild
const App: React.FC = () => {
  const [isDark] = useState(true);

  const [view, setView] = useState<'landing' | 'register' | 'signin' | 'dashboard' | 'privacy' | 'success-stories' | 'contact' | 'careers' | 'terms' | 'for-investors' | 'admin-login' | 'forgot-password'>('landing');
  const [user, setUser] = useState<{ id: string; name: string; email?: string } | null>(null);
  const [showConfigWarning, setShowConfigWarning] = useState(false);
  const [dbStatus, setDbStatus] = useState<string | null>(null);
  const { deviceType, isPWA } = useDevice();
  const isMobileOrPWA = deviceType === 'mobile' || isPWA;

  const testConnection = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setDbStatus(data.database);
      if (data.database === 'connected') {
        setTimeout(() => setShowConfigWarning(false), 2000);
      }
    } catch (err) {
      setDbStatus('failed_to_reach_server');
    }
  };

  React.useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    
    if (!isSupabaseConfigured()) {
      setShowConfigWarning(true);
    }
  }, []);

  const toggleTheme = () => {
    // Theme is forced to dark
  };

  const navigateToRegister = () => {
    setView('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLanding = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAbout = () => {
    if (view !== 'landing') {
      setView('landing');
      setTimeout(() => {
        const element = document.getElementById('powerful-features');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById('powerful-features');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navigateToPrivacy = () => {
    setView('privacy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSuccessStories = () => {
    setView('success-stories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToContact = () => {
    setView('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCareers = () => {
    setView('careers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTerms = () => {
    setView('terms');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToForInvestors = () => {
    setView('for-investors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSignIn = () => {
    setView('signin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdminLogin = () => {
    setView('admin-login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToForgotPassword = () => {
    setView('forgot-password');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegister = (id: string, name: string) => {
    setUser({ id, name });
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignInSuccess = (userData: { id: string; name: string; email: string }) => {
    setUser(userData);
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminAccess = () => {
    navigateToAdminLogin();
  };

  const handleAdminLoginSuccess = () => {
    setUser({ id: 'admin', name: 'Admin' });
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'dashboard') {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#020617] text-gray-50' : 'bg-slate-50 text-gray-900'}`}>
        {user?.name === 'Admin' ? (
          <AdminDashboard 
            isDark={isDark} 
            onLogout={() => { setUser(null); setView('landing'); }} 
          />
        ) : (
          <Dashboard 
            userId={user?.id || ''}
            userName={user?.name || 'User'} 
            isDark={isDark} 
            onLogout={() => { setUser(null); setView('landing'); }} 
          />
        )}
        <Footer 
          onPrivacyPolicy={navigateToPrivacy} 
          onSuccessStories={navigateToSuccessStories} 
          onContact={navigateToContact}
          onCareers={navigateToCareers}
          onTerms={navigateToTerms}
          onAbout={navigateToAbout}
        />
      </div>
    );
  }

  if (view === 'privacy') {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#080D1D] text-gray-50' : 'bg-slate-50 text-gray-900'}`}>
        <PrivacyPolicy onBack={navigateToLanding} isDark={isDark} />
        <Footer 
          onPrivacyPolicy={navigateToPrivacy} 
          onSuccessStories={navigateToSuccessStories} 
          onContact={navigateToContact}
          onCareers={navigateToCareers}
          onTerms={navigateToTerms}
          onAbout={navigateToAbout}
        />
      </div>
    );
  }

  if (view === 'success-stories') {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#080D1D] text-gray-50' : 'bg-slate-50 text-gray-900'}`}>
        <SuccessStories onBack={navigateToLanding} isDark={isDark} />
        <Footer 
          onPrivacyPolicy={navigateToPrivacy} 
          onSuccessStories={navigateToSuccessStories} 
          onContact={navigateToContact}
          onCareers={navigateToCareers}
          onTerms={navigateToTerms}
          onAbout={navigateToAbout}
        />
      </div>
    );
  }

  if (view === 'contact') {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#080D1D] text-gray-50' : 'bg-slate-50 text-gray-900'}`}>
        <Contact onBack={navigateToLanding} isDark={isDark} />
        <Footer 
          onPrivacyPolicy={navigateToPrivacy} 
          onSuccessStories={navigateToSuccessStories} 
          onContact={navigateToContact}
          onCareers={navigateToCareers}
          onTerms={navigateToTerms}
          onAbout={navigateToAbout}
        />
      </div>
    );
  }

  if (view === 'careers') {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#080D1D] text-gray-50' : 'bg-slate-50 text-gray-900'}`}>
        <Careers onBack={navigateToLanding} isDark={isDark} />
        <Footer 
          onPrivacyPolicy={navigateToPrivacy} 
          onSuccessStories={navigateToSuccessStories} 
          onContact={navigateToContact}
          onCareers={navigateToCareers}
          onTerms={navigateToTerms}
          onAbout={navigateToAbout}
        />
      </div>
    );
  }

  if (view === 'terms') {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#080D1D] text-gray-50' : 'bg-slate-50 text-gray-900'}`}>
        <TermsOfService onBack={navigateToLanding} isDark={isDark} />
        <Footer 
          onPrivacyPolicy={navigateToPrivacy} 
          onSuccessStories={navigateToSuccessStories} 
          onContact={navigateToContact}
          onCareers={navigateToCareers}
          onTerms={navigateToTerms}
          onAbout={navigateToAbout}
        />
      </div>
    );
  }

  if (view === 'for-investors') {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#080D1D] text-gray-50' : 'bg-slate-50 text-gray-900'} ${isMobileOrPWA ? 'pb-20' : ''}`}>
        {isMobileOrPWA ? (
          <>
            <TopBar isDark={isDark} onHome={navigateToLanding} />
            <BottomNav 
              isDark={isDark} 
              onPostIdea={navigateToRegister} 
              onAdmin={handleAdminAccess}
              onForInvestors={navigateToForInvestors}
              onSignIn={navigateToSignIn}
              onHome={navigateToLanding}
              currentView={view}
            />
          </>
        ) : (
          <Navbar 
            isDark={isDark} 
            onPostIdea={navigateToRegister} 
            onAdmin={handleAdminAccess}
            onForInvestors={navigateToForInvestors}
            onSignIn={navigateToSignIn}
            onHome={navigateToLanding}
          />
        )}
        <ForCompanies onBack={navigateToLanding} isDark={isDark} />
        <Footer 
          onPrivacyPolicy={navigateToPrivacy} 
          onSuccessStories={navigateToSuccessStories} 
          onContact={navigateToContact}
          onCareers={navigateToCareers}
          onTerms={navigateToTerms}
          onAbout={navigateToAbout}
        />
      </div>
    );
  }

  if (view === 'signin') {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#080D1D] text-gray-50' : 'bg-slate-50 text-gray-900'} ${isMobileOrPWA ? 'pb-20' : ''}`}>
        {showConfigWarning && (
          <div className="bg-amber-500 text-white px-4 py-2 flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">
                <span className="font-bold">Supabase Not Configured:</span> Database features are disabled.
              </p>
            </div>
            <button onClick={() => setShowConfigWarning(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {isMobileOrPWA ? (
          <>
            <TopBar isDark={isDark} onHome={navigateToLanding} />
            <BottomNav 
              isDark={isDark} 
              onPostIdea={navigateToRegister} 
              onAdmin={handleAdminAccess}
              onForInvestors={navigateToForInvestors}
              onSignIn={navigateToSignIn}
              onHome={navigateToLanding}
              currentView={view}
            />
          </>
        ) : (
          <Navbar 
            isDark={isDark} 
            onPostIdea={navigateToRegister} 
            onAdmin={handleAdminAccess}
            onForInvestors={navigateToForInvestors}
            onSignIn={navigateToSignIn}
            onHome={navigateToLanding}
          />
        )}
        <SignIn 
          onBack={navigateToRegister} 
          onSuccess={handleSignInSuccess}
          onForgotPassword={navigateToForgotPassword}
          isDark={isDark} 
        />
        <Footer 
          onPrivacyPolicy={navigateToPrivacy} 
          onSuccessStories={navigateToSuccessStories} 
          onContact={navigateToContact}
          onCareers={navigateToCareers}
          onTerms={navigateToTerms}
          onAbout={navigateToAbout}
        />
      </div>
    );
  }

  if (view === 'admin-login') {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#080D1D] text-gray-50' : 'bg-slate-50 text-gray-900'}`}>
        <AdminLogin 
          onBack={navigateToLanding} 
          onSuccess={handleAdminLoginSuccess}
          isDark={isDark} 
        />
        <Footer 
          onPrivacyPolicy={navigateToPrivacy} 
          onSuccessStories={navigateToSuccessStories} 
          onContact={navigateToContact}
          onCareers={navigateToCareers}
          onTerms={navigateToTerms}
          onAbout={navigateToAbout}
        />
      </div>
    );
  }

  if (view === 'forgot-password') {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#080D1D] text-gray-50' : 'bg-slate-50 text-gray-900'}`}>
        <ForgotPassword 
          onBack={navigateToSignIn} 
          isDark={isDark} 
        />
        <Footer 
          onPrivacyPolicy={navigateToPrivacy} 
          onSuccessStories={navigateToSuccessStories} 
          onContact={navigateToContact}
          onCareers={navigateToCareers}
          onTerms={navigateToTerms}
          onAbout={navigateToAbout}
        />
      </div>
    );
  }

  if (view === 'register') {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#080D1D] text-gray-50' : 'bg-slate-50 text-gray-900'}`}>
        {showConfigWarning && (
          <div className="bg-amber-500 text-white px-4 py-2 flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">
                <span className="font-bold">Supabase Not Configured:</span> Database features are disabled.
              </p>
            </div>
            <button onClick={() => setShowConfigWarning(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <Registration 
          onClose={navigateToLanding} 
          onRegister={handleRegister}
          onSignIn={navigateToSignIn}
          isDark={isDark} 
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#080D1D] text-gray-50' : 'bg-slate-50 text-gray-900'} ${isMobileOrPWA ? 'pb-20' : ''}`}>
      {showConfigWarning && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-white px-4 py-2 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div className="text-sm font-medium">
              <p>
                <span className="font-bold">Supabase Not Configured:</span> Please set <code className="bg-black/20 px-1 rounded text-xs">VITE_SUPABASE_URL</code> and <code className="bg-black/20 px-1 rounded text-xs">VITE_SUPABASE_ANON_KEY</code>.
              </p>
              {dbStatus && (
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs opacity-90">
                    Server Status: <span className="font-mono bg-black/10 px-1 rounded">{dbStatus}</span>
                  </p>
                  <a 
                    href="https://status.supabase.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] underline hover:text-white/80"
                  >
                    Check Supabase Status
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={testConnection}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-bold transition-colors"
            >
              Test Connection
            </button>
            <button onClick={() => setShowConfigWarning(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {isMobileOrPWA ? (
        <>
          <TopBar isDark={isDark} onHome={navigateToLanding} />
          <BottomNav 
            isDark={isDark} 
            onPostIdea={navigateToRegister} 
            onAdmin={handleAdminAccess}
            onForInvestors={navigateToForInvestors}
            onSignIn={navigateToSignIn}
            onHome={navigateToLanding}
            currentView={view}
          />
        </>
      ) : (
        <Navbar 
          isDark={isDark} 
          onPostIdea={navigateToRegister} 
          onAdmin={handleAdminAccess}
          onForInvestors={navigateToForInvestors}
          onSignIn={navigateToSignIn}
          onHome={navigateToLanding}
        />
      )}
      <main className="flex-grow">
        <HeroSection 
          onGetStarted={navigateToRegister} 
        />
        <StatsGrid />
        <HowItWorksSection />
        <PowerfulFeaturesSection />
        <ValidationFlowSection />
        <AnalyticsDashboardSection />
        <CallToActionSection onGetStarted={navigateToRegister} />
      </main>
      <Footer 
        onPrivacyPolicy={navigateToPrivacy} 
        onSuccessStories={navigateToSuccessStories} 
        onContact={navigateToContact}
        onCareers={navigateToCareers}
        onTerms={navigateToTerms}
        onAbout={navigateToAbout}
      />
    </div>
  );
};

export default App;
