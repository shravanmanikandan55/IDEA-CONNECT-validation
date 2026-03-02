
import React, { useState } from 'react';
import { Shield, ArrowLeft, Lock, User, Eye, EyeOff } from 'lucide-react';
import Button from './Button';

interface AdminLoginProps {
  onBack: () => void;
  onSuccess: () => void;
  isDark: boolean;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onBack, onSuccess, isDark }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate admin authentication
    setTimeout(() => {
      if (username === 'admin123' && password === 'ideaconnect142') {
        onSuccess();
      } else {
        setError('Invalid admin credentials');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-[#080D1D]' : 'bg-slate-50'}`}>
      <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl border transition-all duration-300 ${
        isDark ? 'bg-[#0f172a] border-gray-800 shadow-indigo-500/10' : 'bg-white border-gray-100 shadow-slate-200'
      }`}>
        <button 
          onClick={onBack}
          className={`flex items-center text-sm font-medium mb-8 transition-colors ${
            isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-indigo-600'
          }`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/10 text-indigo-600 mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Admin Login</h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Secure access for platform administrators
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Admin Username
            </label>
            <div className="relative">
              <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all outline-none ${
                  isDark 
                    ? 'bg-gray-800/50 border-gray-700 text-white focus:border-indigo-500' 
                    : 'bg-slate-50 border-slate-200 text-gray-900 focus:border-indigo-600'
                }`}
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-12 pr-12 py-4 rounded-2xl border transition-all outline-none ${
                  isDark 
                    ? 'bg-gray-800/50 border-gray-700 text-white focus:border-indigo-500' 
                    : 'bg-slate-50 border-slate-200 text-gray-900 focus:border-indigo-600'
                }`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            variant={isDark ? "darkPrimary" : "primary"} 
            className="w-full py-4 text-lg font-bold shadow-lg shadow-indigo-500/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </div>
            ) : "Login to Dashboard"}
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-800/50 text-center">
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Authorized personnel only. All access attempts are logged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
