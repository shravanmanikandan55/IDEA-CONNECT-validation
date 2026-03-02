
import React from 'react';

interface TermsOfServiceProps {
  onBack: () => void;
  isDark: boolean;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack, isDark }) => {
  return (
    <div className={`min-h-screen py-20 px-6 ${isDark ? 'bg-[#080D1D] text-gray-300' : 'bg-slate-50 text-gray-700'}`}>
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center text-indigo-500 hover:text-indigo-400 font-bold transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>

        <h1 className={`text-4xl font-extrabold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Terms of Service</h1>
        
        <div className="space-y-8 text-lg leading-relaxed">
          <section>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>1. Acceptance of Terms</h2>
            <p>
              By accessing or using IdeaConnect, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on IdeaConnect's website for personal, non-commercial transitory viewing only.
            </p>
            <p className="mt-4">This license shall automatically terminate if you violate any of these restrictions and may be terminated by IdeaConnect at any time.</p>
          </section>

          <section>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>3. User Content</h2>
            <p>
              You retain all of your ownership rights in your content. However, by submitting content to IdeaConnect, you grant IdeaConnect a worldwide, non-exclusive, royalty-free, sublicenseable and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the content in connection with the Service.
            </p>
          </section>

          <section>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>4. Disclaimer</h2>
            <p>
              The materials on IdeaConnect's website are provided on an 'as is' basis. IdeaConnect makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>5. Limitations</h2>
            <p>
              In no event shall IdeaConnect or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on IdeaConnect's website.
            </p>
          </section>

          <section>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>6. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 text-sm text-gray-500">
          Last updated: February 21, 2026
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
