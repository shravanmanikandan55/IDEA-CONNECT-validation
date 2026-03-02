
import React from 'react';

const ValidationFlowSection: React.FC = () => {
  return (
    <section className="bg-slate-50 dark:bg-[#080D1D] py-16 lg:py-24 transition-colors duration-300">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text Content */}
        <div className="lg:pr-8 animate-fade-in-left">
          <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-wide">Validation Flow</h3>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
            Simple Voting, <br /><span className="text-indigo-600 dark:text-indigo-400">Powerful Insights</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
            Your audience goes through a quick, mobile-friendly flow that captures purchase intent, price perception,
            and detailed feedback—all in under 60 seconds.
          </p>
          <ul className="space-y-6">
            <li className="flex items-start">
              <div className="text-indigo-600 dark:text-indigo-400 text-3xl mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Purchase Intent</h4>
                <p className="text-gray-500 dark:text-gray-400">Would they actually buy? Yes, Maybe, or No with reasons.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="text-indigo-600 dark:text-indigo-400 text-3xl mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Price Perception</h4>
                <p className="text-gray-500 dark:text-gray-400">Is it too cheap, fair, or too expensive? Find the sweet spot.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right Column: Mockup */}
        <div className="relative p-4 sm:p-8 bg-white dark:bg-[#182137] rounded-lg shadow-lg dark:shadow-xl animate-fade-in-right border border-gray-100 dark:border-transparent">
            <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-12 mb-6">Smart scheduling that learns from your work patterns</p>

            <div className="text-center mb-8">
                <p className="text-gray-900 dark:text-white text-lg font-semibold mb-4">Would you buy this product?</p>
                <div className="flex justify-center space-x-4">
                    <button className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Yes
                    </button>
                    <button className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Maybe
                    </button>
                    <button className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        No
                    </button>
                </div>
                <div className="flex justify-center mt-4 space-x-2">
                    <span className="block h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-500"></span>
                    <span className="block h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                    <span className="block h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                    <span className="block h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default ValidationFlowSection;
