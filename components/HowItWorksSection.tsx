
import React from 'react';
import { FileText, Share2, TrendingUp, Users } from 'lucide-react';
import DarkCard from './DarkCard';

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="bg-slate-50 dark:bg-[#080D1D] py-16 lg:py-24 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-wide animate-fade-in-up">How It Works</h2>
        <p className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white max-w-4xl mx-auto mb-16 animate-fade-in-up delay-100">
          From idea to validated product in four simple steps. No coding required, just real market feedback.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <DarkCard
            numberedStep={1}
            icon={<FileText className="h-8 w-8" strokeWidth={1.5} />}
            title="Post Your Idea"
            description="Share your product concept with a structured form—problem, solution, target audience, and pricing."
            className="animate-fade-in-up"
          />
          <DarkCard
            numberedStep={2}
            icon={<Share2 className="h-8 w-8" strokeWidth={1.5} />}
            title="Launch Validation"
            description="Generate shareable links and QR codes. Reach your target audience through social media and communities."
            className="animate-fade-in-up delay-100"
          />
          <DarkCard
            numberedStep={3}
            icon={<TrendingUp className="h-8 w-8" strokeWidth={1.5} />}
            title="Get Real Signals"
            description="Collect purchase intent votes, price perception data, and actionable feedback from potential customers."
            className="animate-fade-in-up delay-200"
          />
          <DarkCard
            numberedStep={4}
            icon={<Users className="h-8 w-8" strokeWidth={1.5} />}
            title="Connect & Launch"
            description="With validated demand, connect with supporters, investors, and mentors ready to help you succeed."
            className="animate-fade-in-up delay-300"
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
