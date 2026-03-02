
import React from 'react';
import Button from './Button';

interface CallToActionSectionProps {
  onGetStarted?: () => void;
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative bg-gradient-to-r from-indigo-700 to-purple-800 py-16 lg:py-24 text-white text-center">
      <div className="container mx-auto px-4 relative z-10">
        <span className="inline-flex items-center px-3 py-1 mb-6 rounded-full text-xs font-semibold bg-indigo-900/20 text-indigo-300 uppercase tracking-wide animate-fade-in-up">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Start For Free
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 animate-fade-in-down">
          Ready to Validate Your Next <span className="text-indigo-300">Big Idea</span>?
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 opacity-90 text-gray-200 animate-fade-in-up">
          Join thousands of creators who validate before they build. Get real purchase intent signals and connect with supporters who believe in your vision.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up delay-200">
          <Button variant="darkPrimary" size="lg" className="flex items-center" onClick={onGetStarted}>
            Get Started Free
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Button>
        </div>
        <p className="text-gray-400 text-sm mt-8 animate-fade-in-up delay-300">
          Free forever for basic validation. No credit card needed.
        </p>
      </div>
    </section>
  );
};

export default CallToActionSection;
