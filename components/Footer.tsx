
import React from 'react';
import { Lightbulb } from 'lucide-react';

interface FooterProps {
  onPrivacyPolicy?: () => void;
  onSuccessStories?: () => void;
  onContact?: () => void;
  onCareers?: () => void;
  onTerms?: () => void;
  onAbout?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onPrivacyPolicy, onSuccessStories, onContact, onCareers, onTerms, onAbout }) => {
  return (
    <footer className="bg-white dark:bg-[#080D1D] text-gray-600 dark:text-gray-300 py-12 border-t border-gray-100 dark:border-transparent transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 border-b border-gray-100 dark:border-gray-700 pb-8 mb-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2 text-center md:text-left">
            <a href="#" className="flex items-center justify-center md:justify-start text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
              <Lightbulb className="w-8 h-8 mr-2" />
              IdeaConnect
            </a>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto md:mx-0 mb-4">
              The pre-market validation platform for creators. Test ideas, get real signals, and launch with confidence.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
            </div>
          </div>

          {/* Product Links */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400 text-sm">
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors duration-200">Pricing</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400 text-sm">
              <li>
                <button 
                  onClick={onSuccessStories}
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors duration-200"
                >
                  Success Stories
                </button>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400 text-sm">
              <li>
                <button 
                  onClick={onAbout}
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors duration-200"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={onCareers}
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors duration-200"
                >
                  Careers
                </button>
              </li>
              <li>
                <button 
                  onClick={onContact}
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors duration-200"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400 text-sm">
              <li>
                <button 
                  onClick={onPrivacyPolicy}
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={onTerms}
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors duration-200"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-400 dark:text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} IdeaConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
