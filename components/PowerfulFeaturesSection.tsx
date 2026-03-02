
import React from 'react';
import { 
  CheckCircle2, 
  BarChart3, 
  MessageSquare, 
  Activity, 
  Users, 
  ShieldCheck, 
  Globe, 
  Megaphone 
} from 'lucide-react';
import DarkCard from './DarkCard';

const PowerfulFeaturesSection: React.FC = () => {
  return (
    <section id="powerful-features" className="bg-white dark:bg-[#121B35] py-16 lg:py-24 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        <span className="inline-flex items-center px-3 py-1 mb-6 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 uppercase tracking-wide animate-fade-in-up">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Powerful Features
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white max-w-4xl mx-auto mb-16 animate-fade-in-up delay-100">
          Everything You Need to <span className="text-indigo-600 dark:text-indigo-400">Validate & Launch</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <DarkCard
            icon={<CheckCircle2 className="h-8 w-8" strokeWidth={1.5} />}
            title="Purchase Intent Voting"
            description="Get clear Yes/Maybe/No votes that indicate real buying intent, not just likes."
            className="animate-fade-in-up"
          />
          <DarkCard
            icon={<BarChart3 className="h-8 w-8" strokeWidth={1.5} />}
            title="Visual Analytics Dashboard"
            description="See validation scores, price perception, audience segments, and feedback trends at a glance."
            className="animate-fade-in-up delay-100"
          />
          <DarkCard
            icon={<MessageSquare className="h-8 w-8" strokeWidth={1.5} />}
            title="Actionable Feedback"
            description="Understand why people would or wouldn't buy with structured comments and clustering."
            className="animate-fade-in-up delay-200"
          />
          <DarkCard
            icon={<Activity className="h-8 w-8" strokeWidth={1.5} />}
            title="Validation Score"
            description="One number that tells you how ready your idea is for market based on real signals."
            className="animate-fade-in-up delay-300"
          />
          <DarkCard
            icon={<Users className="h-8 w-8" strokeWidth={1.5} />}
            title="Supporter Network"
            description="Connect with investors, mentors, and skilled collaborators once you've proven demand."
            className="animate-fade-in-up"
          />
          <DarkCard
            icon={<ShieldCheck className="h-8 w-8" strokeWidth={1.5} />}
            title="IP Protection Options"
            description="Display patent status, control visibility, and share selectively with private links."
            className="animate-fade-in-up delay-100"
          />
          <DarkCard
            icon={<Globe className="h-8 w-8" strokeWidth={1.5} />}
            title="Regional Targeting"
            description="Filter by country, state, or city. See which regions show the most interest."
            className="animate-fade-in-up delay-200"
          />
          <DarkCard
            icon={<Megaphone className="h-8 w-8" strokeWidth={1.5} />}
            title="Campaign Tools"
            description="Generate QR codes, shareable links, and track campaign performance in real-time."
            className="animate-fade-in-up delay-300"
          />
        </div>
      </div>
    </section>
  );
};

export default PowerfulFeaturesSection;
