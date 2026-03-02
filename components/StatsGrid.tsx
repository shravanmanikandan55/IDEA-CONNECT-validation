import React, { useEffect, useState } from 'react';
import { Lightbulb, MessageSquareText, Rocket } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const StatsGrid: React.FC = () => {
  const [stats, setStats] = useState({ ideas: 2500, votes: 50000 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // Try to fetch from server first
      try {
        const response = await fetch('/api/public/stats');
        if (response.ok) {
          const data = await response.json();
          if (data.ideas !== 2500 || data.votes !== 50000) {
            // Real data from server
            setStats(data);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log('Server stats endpoint not available, trying client-side...');
      }

      // Fallback: Fetch directly from Supabase client-side
      if (isSupabaseConfigured()) {
        try {
          // Get total ideas count
          const { count: ideaCount, error: ideaError } = await supabase
            .from('ideas')
            .select('*', { count: 'exact', head: true });

          // Get total votes count
          const { count: voteCount, error: voteError } = await supabase
            .from('idea_votes')
            .select('*', { count: 'exact', head: true });

          if (!ideaError && !voteError) {
            setStats({
              ideas: ideaCount || 0,
              votes: voteCount || 0
            });
          }
        } catch (err) {
          console.error('Error fetching stats from Supabase:', err);
        }
      }
      
      setLoading(false);
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K+';
    }
    return num.toString();
  };

  return (
    <section className="bg-white dark:bg-[#121B35] py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-slate-50 dark:bg-[#182137] border border-gray-100 dark:border-transparent rounded-lg shadow-sm dark:shadow-xl animate-fade-in-up">
          <div className="text-indigo-600 dark:text-indigo-400 text-5xl mb-3 flex justify-center">
            <Lightbulb className="h-12 w-12" strokeWidth={1.5} />
          </div>
          <p className="text-indigo-600 dark:text-indigo-400 text-4xl font-bold">
            {loading ? '...' : formatNumber(stats.ideas)}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Ideas Validated</p>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-[#182137] border border-gray-100 dark:border-transparent rounded-lg shadow-sm dark:shadow-xl animate-fade-in-up delay-100">
          <div className="text-indigo-600 dark:text-indigo-400 text-5xl mb-3 flex justify-center">
            <MessageSquareText className="h-12 w-12" strokeWidth={1.5} />
          </div>
          <p className="text-indigo-600 dark:text-indigo-400 text-4xl font-bold">
            {loading ? '...' : formatNumber(stats.votes)}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Votes & Feedback</p>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-[#182137] border border-gray-100 dark:border-transparent rounded-lg shadow-sm dark:shadow-xl animate-fade-in-up delay-200">
          <div className="text-indigo-600 dark:text-indigo-400 text-5xl mb-3 flex justify-center">
            <Rocket className="h-12 w-12" strokeWidth={1.5} />
          </div>
          <p className="text-indigo-600 dark:text-indigo-400 text-4xl font-bold">78%</p>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Launch Success Rate</p>
        </div>
      </div>
    </section>
  );
};

export default StatsGrid;
