
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const MOCK_INVESTORS = [
  {
    id: 1,
    name: "Sarah Chen",
    type: "Angel Investor",
    focus: ["SaaS", "AI/ML", "Fintech"],
    location: "San Francisco, CA",
    portfolio: 12,
    bio: "Former VP of Product at a major tech firm. Passionate about supporting early-stage founders solving real-world problems with AI.",
    avatar: "SC",
    minCheck: "$25k",
    maxCheck: "$100k"
  },
  {
    id: 2,
    name: "Blue Horizon Ventures",
    type: "Venture Capital",
    focus: ["Sustainability", "Hardware", "CleanTech"],
    location: "Berlin, Germany",
    portfolio: 45,
    bio: "We invest in the future of our planet. Looking for hardware-enabled solutions that have clear environmental impact and scalability.",
    avatar: "BH",
    minCheck: "$250k",
    maxCheck: "$2M"
  },
  {
    id: 3,
    name: "Marcus Thorne",
    type: "Syndicate Lead",
    focus: ["Consumer Apps", "Gaming", "Web3"],
    location: "London, UK",
    portfolio: 28,
    bio: "Serial entrepreneur turned investor. I lead syndicates for high-growth consumer products with strong community engagement.",
    avatar: "MT",
    minCheck: "$50k",
    maxCheck: "$500k"
  },
  {
    id: 4,
    name: "Elena Rodriguez",
    type: "Angel Investor",
    focus: ["HealthTech", "EdTech"],
    location: "Austin, TX",
    portfolio: 8,
    bio: "Focusing on social impact through technology. I provide hands-on mentorship for founders in the healthcare and education sectors.",
    avatar: "ER",
    minCheck: "$10k",
    maxCheck: "$50k"
  }
];

interface InvestorsListProps {
  onViewProfile?: (investor: any) => void;
  onApply?: () => void;
}

const InvestorsList: React.FC<InvestorsListProps> = ({ onViewProfile, onApply }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [investors, setInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInvestors = async () => {
      if (!isSupabaseConfigured()) {
        setInvestors(MOCK_INVESTORS);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .ilike('interests', '%yes%');

        if (error) throw error;

        const mappedInvestors = (data || []).map(profile => ({
          id: profile.user_id,
          name: profile.full_name || profile.company_name || 'Anonymous Investor',
          username: profile.email ? profile.email.split('@')[0] : 'user',
          profile_type: profile.profile_type,
          company_name: profile.company_name,
          current_role: profile.current_role,
          type: (profile.investor_type || (profile.profile_type === 'company' ? 'Venture Capital' : 'Angel Investor')).replace(/_/g, ' '),
          focus: profile.sectors || [],
          location: profile.industry || 'Remote',
          bio: profile.bio || 'No bio provided.',
          avatar: (profile.full_name || profile.company_name || 'IN').substring(0, 2).toUpperCase(),
          avatar_url: profile.avatar_url,
          minCheck: profile.investment_range ? profile.investment_range.split('-')[0] : '$10k',
          maxCheck: profile.investment_range ? profile.investment_range.split('-')[1] : '$100k'
        }));

        setInvestors(mappedInvestors);
      } catch (err) {
        console.error('Error fetching investors:', err);
        setInvestors(MOCK_INVESTORS);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = 
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.focus.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{t('Companies')}</h1>
          <p className="text-gray-400 max-w-xl mb-6">{t('Connect with verified companies looking for validated ideas in your sector.')}</p>
          
          <div className="relative max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-focus-within:text-[#00BA9D] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder={t('Search by name, type, or focus area...')} 
              className="w-full bg-[#1e293b]/30 border border-gray-800 text-white pl-12 pr-4 py-3 rounded-2xl focus:ring-2 focus:ring-[#00BA9D]/50 focus:border-[#00BA9D] outline-none transition-all placeholder:text-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredInvestors.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInvestors.map((investor) => (
            <div key={investor.id} className="bg-[#1e293b]/20 border border-gray-800 rounded-3xl p-8 hover:border-[#00BA9D]/30 transition-all group relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00BA9D]/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[#00BA9D]/10 transition-colors" />
              
              <div className="flex items-start gap-6 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 flex items-center justify-center text-xl font-bold text-white shadow-xl group-hover:scale-105 transition-transform">
                  {investor.avatar}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#00BA9D] transition-colors">{investor.name}</h3>
                      <p className="text-[#00BA9D] text-xs font-bold uppercase tracking-widest mt-1">{investor.type}</p>
                    </div>
                    <div className="flex items-center text-gray-500 text-xs">
                      {investor.location}
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2 italic">
                    "{investor.bio}"
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {investor.focus.map((tag) => (
                      <span key={tag} className="bg-gray-800/50 text-gray-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-800/50">
                    <div>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter mb-1">{t('Min Check')}</p>
                      <p className="text-white font-bold">{investor.minCheck}</p>
                    </div>
                    <div className="text-right">
                      <button 
                        onClick={() => onViewProfile && onViewProfile(investor)}
                        className="text-[#00BA9D] hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-end ml-auto group/btn"
                      >
                        {t('View Profile')}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#1e293b]/10 border border-dashed border-gray-800 rounded-3xl">
          <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center text-gray-500 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{t('No companies found')}</h3>
          <p className="text-gray-500">{t("Try adjusting your search terms to find what you're looking for.")}</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-6 text-[#00BA9D] font-bold hover:underline"
          >
            {t('Clear search')}
          </button>
        </div>
      )}
      
      <div className="mt-16 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Are you a company?</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto text-sm">Join our network to get early access to validated, high-potential product ideas before they hit the open market.</p>
        <button 
          onClick={onApply}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold transition-all transform active:scale-95 shadow-lg shadow-indigo-500/20"
        >
          Apply to Join
        </button>
      </div>
    </div>
  );
};

export default InvestorsList;
