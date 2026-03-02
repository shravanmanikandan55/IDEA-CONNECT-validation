
import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Shield, Zap, BarChart3, Users, Globe } from 'lucide-react';

interface ForCompaniesProps {
  onBack: () => void;
  isDark: boolean;
}

const ForCompanies: React.FC<ForCompaniesProps> = ({ onBack, isDark }) => {
  return (
    <div className="flex-grow pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="mb-8 flex items-center text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Home
        </button>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6"
          >
            Invest in <span className="text-indigo-600 dark:text-indigo-400">Validated</span> Innovation
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            IdeaConnect bridges the gap between visionary individuals and strategic companies. 
            We provide a platform where every idea is backed by real-world validation data.
          </motion.p>
        </div>

        {/* Key Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: <Shield className="w-8 h-8 text-indigo-600" />,
              title: "De-risked Opportunities",
              description: "Access startups that have already passed our rigorous validation flow, including market demand and user interest tracking."
            },
            {
              icon: <BarChart3 className="w-8 h-8 text-indigo-600" />,
              title: "Data-Driven Insights",
              description: "Review comprehensive analytics dashboards for every project, showing real-time validation scores and audience segmentation."
            },
            {
              icon: <Zap className="w-8 h-8 text-indigo-600" />,
              title: "Early Access",
              description: "Be the first to discover high-potential ideas before they hit the mainstream market. Secure early-stage equity in tomorrow's leaders."
            }
          ].map((benefit, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white dark:bg-[#121B35] p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Investment Process */}
        <div className="bg-indigo-600 rounded-3xl p-12 text-white mb-20 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-12 text-center">How It Works for Companies</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Browse", desc: "Explore a curated list of validated ideas across multiple industries." },
                { step: "02", title: "Analyze", desc: "Deep dive into validation data, market size, and growth projections." },
                { step: "03", title: "Connect", desc: "Directly message individuals to discuss vision, roadmap, and terms." },
                { step: "04", title: "Invest", desc: "Secure your position through our streamlined investment portal." }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl font-black text-white/20 mb-4">{item.step}</div>
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-indigo-100 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">Why Top Companies Choose Us</h2>
          <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">94%</div>
              <div className="text-gray-500 uppercase text-xs font-bold tracking-widest">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
              <div className="text-gray-500 uppercase text-xs font-bold tracking-widest">Support Access</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gray-50 dark:bg-[#0A1025] rounded-3xl p-12 border border-gray-100 dark:border-gray-800">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Ready to find your next unicorn?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join our network of 2,000+ companies and VCs. Get exclusive access to high-potential projects.
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105">
            Apply for Company Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForCompanies;
