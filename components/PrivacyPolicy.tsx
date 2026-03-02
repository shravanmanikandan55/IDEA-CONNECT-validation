
import React from 'react';

interface PrivacyPolicyProps {
  onBack: () => void;
  isDark: boolean;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack, isDark }) => {
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

        <h1 className={`text-4xl font-extrabold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Privacy Policy</h1>
        
        <div className="space-y-8 text-lg leading-relaxed">
          <section>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>1. Introduction</h2>
            <p>
              Welcome to IdeaConnect. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>2. Information We Collect</h2>
            <p>
              We collect personal information that you voluntarily provide to us when registering at the platform, expressing an interest in obtaining information about us or our products and services, when participating in activities on the platform or otherwise contacting us.
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Personal Data:</strong> Name, email address, and profile information.</li>
              <li><strong>Idea Data:</strong> Information about the product ideas you share and validate.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our platform.</li>
            </ul>
          </section>

          <section>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>3. How We Use Your Information</h2>
            <p>
              We use personal information collected via our platform for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>To facilitate account creation and logon process.</li>
              <li>To send you marketing and promotional communications.</li>
              <li>To enable user-to-user communications.</li>
              <li>To manage user accounts.</li>
            </ul>
          </section>

          <section>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>4. Sharing Your Information</h2>
            <p>
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
            </p>
          </section>

          <section>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>5. Data Security</h2>
            <p>
              We aim to protect your personal information through a system of organizational and technical security measures. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
            </p>
          </section>

          <section>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>6. Your Privacy Rights</h2>
            <p>
              In some regions, such as the European Economic Area, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.
            </p>
          </section>

          <section>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>7. Updates to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.
            </p>
          </section>

          <section>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>8. Contact Us</h2>
            <p>
              If you have questions or comments about this policy, you may email us at privacy@ideaconnect.com.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 text-sm text-gray-500">
          Last updated: February 20, 2026
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
