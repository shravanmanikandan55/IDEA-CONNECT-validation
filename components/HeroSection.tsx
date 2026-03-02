
import React from 'react';
import Button from './Button';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative bg-gradient-to-br from-indigo-50 to-white dark:from-[#080D1D] dark:to-[#121B35] text-gray-900 dark:text-white py-20 lg:py-28 overflow-hidden transition-colors duration-300">
      <div className="container mx-auto relative z-10 flex flex-col items-center justify-center px-4 text-center">
        <span className="inline-flex items-center px-3 py-1 mb-6 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 uppercase tracking-wide animate-fade-in-up">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"/></svg>
          Pre-Market Validation Platform
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-down">
          Validate Before You Build. <br className="hidden sm:block"/> <span className="text-indigo-600 dark:text-indigo-400">Launch With Confidence.</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-90 text-gray-600 dark:text-gray-300 max-w-3xl animate-fade-in-up">
          Test if people would actually buy your product idea. Get real purchase intent signals, understand feedback with clear analytics, and connect with supporters ready to help you launch.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12 animate-fade-in-up delay-200">
          <Button variant="primary" size="lg" className="flex items-center dark:bg-indigo-500 dark:hover:bg-indigo-600 w-full sm:w-auto" onClick={onGetStarted}>
            Start Validating Free
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Button>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-gray-500 dark:text-gray-400 text-sm md:text-base animate-fade-in-up delay-400">
            <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                No credit card required
            </span>
            <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Get responses in hours
            </span>
            <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Real purchase intent data
            </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
