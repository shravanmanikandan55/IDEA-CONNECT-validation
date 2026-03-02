
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import BrowseIdeas from './BrowseIdeas';
import NewIdeaModal from './NewIdeaModal';
import EditIdeaModal from './EditIdeaModal';
import ViewIdeaModal from './ViewIdeaModal';
import InvestorsList from './InvestorsList';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import StatisticsModal from './StatisticsModal';
import { useDevice } from '../hooks/useDevice';
import DashboardBottomNav from './DashboardBottomNav';
import { Lightbulb } from 'lucide-react';

interface DashboardProps {
  userId: string;
  userName: string;
  isDark: boolean;
  onLogout: () => void;
}

const USER_MOCK_IDEAS = [
  {
    id: 101,
    title: "Quantum Fitness Tracker",
    description: "A wearable device using quantum sensors to track micro-muscle movements for perfect gym form and injury prevention. Athletes struggle to maintain perfect form during high-intensity training, leading to preventable injuries.",
    votes: 45,
    waitlist: 12,
    score: 62,
    stage: "Validation",
    comments: 8,
    category: "Hardware",
    tags: "Hardware, AI, Fitness"
  },
  {
    id: 102,
    title: "Solar-Powered Water Purifier",
    description: "Compact, portable water purification system designed for hikers and disaster relief zones, powered entirely by ambient sunlight. A lightweight folding solar panel array that powers a high-efficiency UV and carbon filtration pump.",
    votes: 128,
    waitlist: 54,
    score: 85,
    stage: "Prototype",
    comments: 24,
    category: "Sustainability",
    tags: "Sustainability, CleanTech, Outdoor"
  },
  {
    id: 103,
    title: "No-Code AR Menu for Restaurants",
    description: "A SaaS platform allowing local restaurants to create 3D interactive menus that customers view via a simple web link. Easy drag-and-drop AR dish builder that customers can access on their phones without downloading an app.",
    votes: 310,
    waitlist: 88,
    score: 91,
    stage: "Validation",
    comments: 42,
    category: "SaaS",
    tags: "SaaS, AR, FoodTech"
  }
];

const Dashboard: React.FC<DashboardProps> = ({ userId, userName: initialUserName, isDark, onLogout }) => {
  const { t } = useTranslation();
  const [userName, setUserName] = useState(initialUserName);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId || userId === 'guest' || userId === 'admin') return;
      if (!isSupabaseConfigured()) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, company_name, profile_type, avatar_url')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        if (data) {
          const displayName = data.profile_type === 'company' ? data.company_name : data.full_name;
          if (displayName) {
            setUserName(displayName);
          }
          if (data.avatar_url) {
            setUserAvatar(data.avatar_url);
          }
        }
      } catch (err) {
        console.error('Error fetching profile data for dashboard:', err);
      }
    };

    fetchProfileData();
  }, [userId]);

  const [isNewIdeaModalOpen, setIsNewIdeaModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<any>(null);
  const [viewingIdea, setViewingIdea] = useState<any>(null);
  const [viewingStats, setViewingStats] = useState<any>(null);
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [viewingUserName, setViewingUserName] = useState<string | null>(null);
  const [previousTab, setPreviousTab] = useState('Browse Ideas');
  const [userIdeas, setUserIdeas] = useState<any[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [activeSort, setActiveSort] = useState('Recent');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const { deviceType, isPWA } = useDevice();
  const isMobileOrPWA = deviceType === 'mobile' || isPWA;

  const categories = ['All Categories', 'SaaS', 'Hardware', 'Sustainability', 'EdTech', 'Fintech', 'HealthTech', 'Web3'];
  const sortOptions = ['Popularity', 'Recent', 'Oldest', 'Validation Score'];

  const filteredUserIdeas = userIdeas.filter(idea => {
    return activeCategory === 'All Categories' || idea.category === activeCategory;
  }).sort((a, b) => {
    if (activeSort === 'Popularity') return (b.votes || 0) - (a.votes || 0);
    if (activeSort === 'Recent') {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : (typeof a.id === 'number' ? a.id : 0);
      const dateB = b.created_at ? new Date(b.created_at).getTime() : (typeof b.id === 'number' ? b.id : 0);
      return dateB - dateA;
    }
    if (activeSort === 'Oldest') {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : (typeof a.id === 'number' ? a.id : 0);
      const dateB = b.created_at ? new Date(b.created_at).getTime() : (typeof b.id === 'number' ? b.id : 0);
      return dateA - dateB;
    }
    if (activeSort === 'Validation Score') return (b.score || 0) - (a.score || 0);
    return 0;
  });

  const navLinks = ['Browse Ideas', 'Investors', 'Dashboard'];

  useEffect(() => {
    const fetchUserIdeas = async () => {
      if (!userId || userId === 'guest' || userId === 'admin') {
        setUserIdeas(USER_MOCK_IDEAS);
        const mockTotalVotes = USER_MOCK_IDEAS.reduce((sum, idea) => sum + (idea.votes || 0), 0);
        const mockTotalComments = USER_MOCK_IDEAS.reduce((sum, idea) => sum + (idea.comments || 0), 0);
        setTotalVotes(mockTotalVotes);
        setTotalComments(mockTotalComments);
        return;
      }

      if (!isSupabaseConfigured()) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('ideas')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const ideaIds = (data || []).map(idea => idea.id);
        
        let voteCounts: Record<number, number> = {};
        let yesCounts: Record<number, number> = {};
        let noCounts: Record<number, number> = {};
        ideaIds.forEach(id => {
          voteCounts[id] = 0;
          yesCounts[id] = 0;
          noCounts[id] = 0;
        });
        
        if (ideaIds.length > 0) {
          const { data: votesData } = await supabase
            .from('idea_votes')
            .select('idea_id, yes_vote, maybe_vote, no_vote')
            .in('idea_id', ideaIds);
            
          if (votesData) {
            votesData.forEach(vote => {
              if (vote.yes_vote || vote.maybe_vote || vote.no_vote) {
                voteCounts[vote.idea_id] = (voteCounts[vote.idea_id] || 0) + 1;
              }
              if (vote.yes_vote) yesCounts[vote.idea_id] = (yesCounts[vote.idea_id] || 0) + 1;
              if (vote.no_vote) noCounts[vote.idea_id] = (noCounts[vote.idea_id] || 0) + 1;
            });
          }
        }

        // Map DB fields to UI fields if necessary
        const mappedIdeas = (data || []).map(idea => {
          const yes = yesCounts[idea.id] || 0;
          const no = noCounts[idea.id] || 0;
          const netVotes = yes - no;
          const calculatedScore = Math.round(Math.sign(netVotes) * Math.min(100, Math.sqrt(Math.abs(netVotes)) * 10));

          return {
            ...idea,
            votes: voteCounts[idea.id] !== undefined ? voteCounts[idea.id] : (idea.votes || 0),
            waitlist: idea.waitlist || 0,
            score: calculatedScore,
            comments: idea.comments || 0
          };
        });

        setUserIdeas(mappedIdeas);

        // Fetch actual total votes for all user's ideas
        if (mappedIdeas.length > 0) {
          setTotalVotes(Object.values(voteCounts).reduce((a, b) => a + b, 0));

          // Fetch actual total comments for all user's ideas
          const ideaIds = mappedIdeas.map(i => i.id);
          const { count: commentsCount, error: commentsError } = await supabase
            .from('idea_comments')
            .select('*', { count: 'exact', head: true })
            .in('idea_id', ideaIds);
          
          if (!commentsError) {
            setTotalComments(commentsCount || 0);
          }
        } else {
          setTotalVotes(0);
          setTotalComments(0);
        }
      } catch (err) {
        console.error('Error fetching ideas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserIdeas();
  }, [userId]);

  const handleIdeaSubmit = async (idea: any) => {
    if (!userId || userId === 'guest' || userId === 'admin') {
      const newIdea = {
        ...idea,
        id: Date.now(),
        votes: 0,
        waitlist: 0,
        score: 0,
        comments: 0
      };
      setUserIdeas([newIdea, ...userIdeas]);
      setIsNewIdeaModalOpen(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      alert('Supabase is not configured.');
      return;
    }

    setLoading(true);
    try {
      const ideaData = {
        user_id: userId,
        title: idea.title,
        description: idea.description,
        category: idea.category,
        stage: idea.stage,
        tags: idea.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t !== ''),
        seeking_investment: idea.seeking_investment,
        investment_amount: idea.investment_amount
      };

      const { data, error } = await supabase
        .from('ideas')
        .insert([ideaData])
        .select()
        .single();

      if (error) throw error;

      const newIdea = {
        ...data,
        votes: 0,
        waitlist: 0,
        score: 0,
        comments: 0
      };

      setUserIdeas([newIdea, ...userIdeas]);
      setIsNewIdeaModalOpen(false);
    } catch (err: any) {
      console.error('Error saving idea:', err);
      alert('Failed to save idea: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIdea = async (updatedIdea: any) => {
    if (!userId || userId === 'guest' || userId === 'admin') {
      setUserIdeas(userIdeas.map(idea => idea.id === updatedIdea.id ? updatedIdea : idea));
      setEditingIdea(null);
      return;
    }

    if (!isSupabaseConfigured()) {
      alert('Supabase is not configured.');
      return;
    }

    setLoading(true);
    try {
      const ideaData = {
        title: updatedIdea.title,
        description: updatedIdea.description,
        category: updatedIdea.category,
        stage: updatedIdea.stage,
        tags: typeof updatedIdea.tags === 'string' ? updatedIdea.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t !== '') : updatedIdea.tags,
        seeking_investment: updatedIdea.seeking_investment,
        investment_amount: updatedIdea.investment_amount,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('ideas')
        .update(ideaData)
        .eq('id', updatedIdea.id);

      if (error) throw error;

      setUserIdeas(userIdeas.map(idea => idea.id === updatedIdea.id ? updatedIdea : idea));
      setEditingIdea(null);
    } catch (err: any) {
      console.error('Error updating idea:', err);
      alert('Failed to update idea: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIdea = async (ideaId: number) => {
    if (!window.confirm(t('Are you sure you want to delete this idea?'))) return;

    if (!userId || userId === 'guest' || userId === 'admin') {
      setUserIdeas(userIdeas.filter(idea => idea.id !== ideaId));
      return;
    }

    if (!isSupabaseConfigured()) {
      alert('Supabase is not configured.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId);

      if (error) throw error;

      setUserIdeas(userIdeas.filter(idea => idea.id !== ideaId));
    } catch (err: any) {
      console.error('Error deleting idea:', err);
      alert('Failed to delete idea: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (uid: string, name?: string) => {
    if (uid === userId) {
      setActiveTab('Profile');
    } else {
      setViewingUserId(uid);
      setViewingUserName(name || null);
      setPreviousTab(activeTab);
      setActiveTab('UserProfile');
    }
    setViewingIdea(null);
  };

  const handleDeleteAccount = async () => {
    if (!userId || userId === 'guest' || userId === 'admin') {
      onLogout();
      return;
    }

    if (!isSupabaseConfigured()) {
      onLogout();
      return;
    }

    try {
      // Use getUser() instead of getSession() to ensure the session is fresh and valid
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('No active user found:', userError);
        onLogout();
        return;
      }

      // Now get the session to get the access token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        onLogout();
        return;
      }

      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }

      // Sign out locally
      await supabase.auth.signOut();
      onLogout();
    } catch (err: any) {
      console.error('Error deleting account:', err);
      alert('Failed to delete account: ' + err.message);
    }
  };

  return (
    <div className={`flex-grow flex flex-col ${isMobileOrPWA ? 'pb-20' : ''}`}>
      {/* Dashboard Navbar */}
      {!isMobileOrPWA && (
        <nav className="bg-[#020617] border-b border-gray-800 px-6 py-4 transition-colors duration-300 sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-12">
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Dashboard'); }} className="flex items-center text-xl font-bold text-white">
                <Lightbulb className="w-6 h-6 mr-2 text-[#00BA9D]" />
                IdeaConnect
              </a>
              <div className="hidden md:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <button
                    key={link}
                    onClick={() => setActiveTab(link)}
                    className={`text-sm font-medium transition-colors ${
                      activeTab === link ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {t(link)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4 md:space-x-6">
              <div className="relative group hidden md:block">
                <div className="flex items-center space-x-2 cursor-pointer group">
                  {userAvatar ? (
                    <img 
                      src={userAvatar} 
                      alt={userName} 
                      className="w-8 h-8 rounded-full object-cover border border-[#00BA9D]/40"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#00BA9D]/20 border border-[#00BA9D]/40 flex items-center justify-center text-[#00BA9D] text-xs font-bold">
                        {userName[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">{userName}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="absolute right-0 top-full pt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto min-w-[180px]">
                  <div className="bg-[#1e293b] rounded-2xl border border-gray-700 shadow-2xl overflow-hidden py-2">
                    <button 
                      onClick={() => setActiveTab('Profile')}
                      className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center space-x-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#00BA9D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium">{t('Profile')}</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('Settings')}
                      className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center space-x-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#00BA9D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">{t('Settings')}</span>
                    </button>
                    <div className="h-px bg-gray-800 my-1 mx-2" />
                    <button 
                      onClick={onLogout} 
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center space-x-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-medium">{t('Logout')}</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Top Bar (if mobile/PWA) */}
      {isMobileOrPWA && (
        <div className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-gray-800 p-4 flex justify-center items-center relative">
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Dashboard'); }} className="flex items-center text-xl font-bold text-white">
            <Lightbulb className="w-6 h-6 mr-2 text-[#00BA9D]" />
            IdeaConnect
          </a>
          <button 
            onClick={() => setActiveTab('Settings')}
            className="absolute right-4 text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      {isMobileOrPWA && (
        <DashboardBottomNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onNewIdea={() => setIsNewIdeaModalOpen(true)} 
        />
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-[#020617] pt-24 px-6 animate-fade-in">
           <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => {
                    setActiveTab(link);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-lg font-medium transition-colors text-left ${
                    activeTab === link ? 'text-[#00BA9D]' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t(link)}
                </button>
              ))}
              
              <div className="h-px bg-gray-800 my-4" />
              
              <div className="flex items-center space-x-3 mb-4">
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt={userName} 
                    className="w-10 h-10 rounded-full object-cover border border-[#00BA9D]/40"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#00BA9D]/20 border border-[#00BA9D]/40 flex items-center justify-center text-[#00BA9D] text-sm font-bold">
                      {userName[0].toUpperCase()}
                  </div>
                )}
                <span className="text-white font-medium">{userName}</span>
              </div>

              <button 
                onClick={() => { setActiveTab('Profile'); setIsMobileMenuOpen(false); }}
                className="text-gray-400 hover:text-white text-left flex items-center space-x-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{t('Profile')}</span>
              </button>
              
              <button 
                onClick={() => { setActiveTab('Settings'); setIsMobileMenuOpen(false); }}
                className="text-gray-400 hover:text-white text-left flex items-center space-x-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{t('Settings')}</span>
              </button>

              <button 
                onClick={onLogout} 
                className="text-red-400 hover:text-red-300 text-left flex items-center space-x-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{t('Logout')}</span>
              </button>
           </div>
        </div>
      )}

      {/* Conditional Main Content */}
      <main className="flex-grow transition-all duration-500">
        {activeTab === 'Dashboard' && (
          <div className="container mx-auto px-6 py-12 animate-fade-in">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{t('Welcome')}, {userName}!</h1>
                    <p className="text-gray-500">{t('Track your validation progress and community feedback.')}</p>
                </div>
                <button 
                    onClick={() => setIsNewIdeaModalOpen(true)}
                    className="flex items-center space-x-2 bg-[#00BA9D] hover:bg-[#00a88d] text-white px-6 py-3 rounded-full font-bold transition-all transform active:scale-95 shadow-lg shadow-teal-500/20"
                >
                    <span className="text-xl">+</span>
                    <span>{t('New Idea')}</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-[#1e293b]/30 border border-gray-800 p-6 rounded-2xl flex items-center group hover:border-[#00BA9D]/30 transition-colors">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mr-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white mb-0.5">{userIdeas.length}</p>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{t('My Ideas')}</p>
                </div>
              </div>

              <div className="bg-[#1e293b]/30 border border-gray-800 p-6 rounded-2xl flex items-center group hover:border-[#00BA9D]/30 transition-colors">
                <div className="w-12 h-12 bg-[#00BA9D]/10 rounded-xl flex items-center justify-center text-[#00BA9D] mr-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white mb-0.5">{totalVotes}</p>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{t('Total Votes')}</p>
                </div>
              </div>

              <div className="bg-[#1e293b]/30 border border-gray-800 p-6 rounded-2xl flex items-center group hover:border-[#00BA9D]/30 transition-colors">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mr-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white mb-0.5">{totalComments}</p>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{t('Feedback')}</p>
                </div>
              </div>
            </div>

            {/* Ideas List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">{t('Active Projects')}</h2>
                    <div className="flex items-center space-x-3">
                        {/* Sort Dropdown */}
                        <div className="relative">
                            <button 
                              onClick={() => {
                                setIsSortOpen(!isSortOpen);
                                setIsCategoryOpen(false);
                              }}
                              className="text-xs text-gray-400 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700 hover:border-gray-600 transition-all flex items-center space-x-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                              </svg>
                              <span>{t('Sort')}: {activeSort}</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            {isSortOpen && (
                              <div className="absolute top-full right-0 mt-2 w-48 bg-[#0f172a] border border-gray-800 rounded-xl shadow-2xl z-50 py-2 animate-fade-in-up">
                                {sortOptions.map((option) => (
                                  <button
                                    key={option}
                                    onClick={() => {
                                      setActiveSort(option);
                                      setIsSortOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeSort === option ? 'text-[#00BA9D] bg-[#00BA9D]/5 font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            )}
                        </div>

                        {/* Category Dropdown */}
                        <div className="relative">
                            <button 
                              onClick={() => {
                                setIsCategoryOpen(!isCategoryOpen);
                                setIsSortOpen(false);
                              }}
                              className="text-xs text-gray-400 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700 hover:border-gray-600 transition-all flex items-center space-x-2"
                            >
                              <span>{activeCategory}</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            {isCategoryOpen && (
                              <div className="absolute top-full right-0 mt-2 w-48 bg-[#0f172a] border border-gray-800 rounded-xl shadow-2xl z-50 py-2 animate-fade-in-up">
                                {categories.map((cat) => (
                                  <button
                                    key={cat}
                                    onClick={() => {
                                      setActiveCategory(cat);
                                      setIsCategoryOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeCategory === cat ? 'text-[#00BA9D] bg-[#00BA9D]/5 font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                  >
                                    {cat}
                                  </button>
                                ))}
                              </div>
                            )}
                        </div>
                    </div>
                </div>

                {filteredUserIdeas.length === 0 ? (
                    <div className="text-center py-20 bg-[#1e293b]/10 rounded-3xl border-2 border-dashed border-gray-800">
                        <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center text-gray-500 mx-auto mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {userIdeas.length === 0 ? "You haven't shared any ideas yet" : "No matching ideas found"}
                        </h3>
                        <p className="text-gray-500 italic mb-6">
                          {userIdeas.length === 0 
                            ? "Start your journey by publishing your first vision to the community." 
                            : "Try adjusting your filters to find what you're looking for."}
                        </p>
                        {userIdeas.length === 0 ? (
                          <button 
                            onClick={() => setIsNewIdeaModalOpen(true)}
                            className="bg-[#00BA9D] hover:bg-[#00a88d] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-teal-500/20 transition-all"
                          >
                            Post Your First Idea
                          </button>
                        ) : activeCategory !== 'All Categories' && (
                          <button 
                            onClick={() => setActiveCategory('All Categories')}
                            className="text-[#00BA9D] text-sm font-bold hover:underline"
                          >
                            Show all projects
                          </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredUserIdeas.map((idea) => (
                            <div key={idea.id} className="bg-[#1e293b]/20 border border-gray-800 p-6 rounded-2xl hover:bg-[#1e293b]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${['mvp', 'launched'].includes(idea.stage) ? 'bg-teal-500/10 text-teal-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                            {idea.stage.charAt(0).toUpperCase() + idea.stage.slice(1)}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                                            {idea.category || 'General'}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00BA9D] transition-colors">{idea.title}</h3>
                                    <p className="text-gray-400 text-sm max-w-2xl line-clamp-1">{idea.description}</p>
                                </div>

                                <div className="flex items-center space-x-4 sm:space-x-12 min-w-fit">
                                    <div className="text-center">
                                        <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">{t('Votes')}</p>
                                        <p className="text-white font-bold">{idea.votes}</p>
                                    </div>
                                    <div className="text-right w-24">
                                        <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">{t('Validation')}</p>
                                        <div className="flex items-center justify-end space-x-2">
                                            <span className={`font-bold ${idea.score < 0 ? 'text-red-500' : idea.score >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>{idea.score}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ${idea.score < 0 ? 'bg-red-500' : idea.score >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                style={{ width: `${Math.max(0, idea.score)}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button 
                                          onClick={() => setViewingStats(idea)}
                                          className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-2 rounded-lg transition-colors border border-gray-700"
                                          title={t('View Statistics')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </button>
                                        <button 
                                          onClick={() => setViewingIdea(idea)}
                                          className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-2 rounded-lg transition-colors border border-gray-700"
                                          title={t('View Details')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                        <button 
                                          onClick={() => setEditingIdea(idea)}
                                          className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-2 rounded-lg transition-colors border border-gray-700"
                                          title={t('Edit Idea')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteIdea(idea.id)}
                                          className="bg-gray-800 hover:bg-red-900/50 text-gray-300 hover:text-red-400 p-2 rounded-lg transition-colors border border-gray-700 hover:border-red-900/50"
                                          title={t('Delete Idea')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>
        )}

        {activeTab === 'Browse Ideas' && (
          <BrowseIdeas 
            user={{ id: userId, name: userName }} 
            onViewProfile={handleViewProfile}
          />
        )}

        {activeTab === 'Investors' && (
          <InvestorsList 
            onViewProfile={(investor) => {
              setSelectedInvestor(investor);
              setActiveTab('InvestorProfile');
            }} 
            onApply={() => setActiveTab('Profile')}
          />
        )}

        {activeTab === 'InvestorProfile' && selectedInvestor && (
          <ProfilePage 
            userId={selectedInvestor.id}
            initialUser={{ 
              name: selectedInvestor.name,
              role: selectedInvestor.current_role || selectedInvestor.type,
              company: selectedInvestor.company_name,
              location: selectedInvestor.location,
              bio: selectedInvestor.bio,
              avatar: selectedInvestor.avatar_url || selectedInvestor.avatar,
              investor_type: selectedInvestor.type,
              investment_range: selectedInvestor.maxCheck ? `${selectedInvestor.minCheck} - ${selectedInvestor.maxCheck}` : selectedInvestor.minCheck,
              sectors: selectedInvestor.focus,
              profile_type: selectedInvestor.profile_type
            }} 
            isReadOnly={true}
            onBack={() => setActiveTab('Investors')}
          />
        )}

        {activeTab === 'UserProfile' && viewingUserId && (
          <ProfilePage 
            userId={viewingUserId}
            initialUser={{ name: viewingUserName || 'Loading...' }}
            isReadOnly={viewingUserId !== userId}
            onBack={() => setActiveTab(previousTab)}
          />
        )}

        {activeTab === 'Profile' && (
          <ProfilePage 
            userId={userId}
            initialUser={{ name: userName, avatar: userAvatar || undefined }} 
            onUpdate={(newName, newAvatar) => {
              setUserName(newName);
              if (newAvatar) setUserAvatar(newAvatar);
            }} 
          />
        )}

        {activeTab === 'Settings' && (
          <SettingsPage onDeleteAccount={handleDeleteAccount} onLogout={onLogout} />
        )}
      </main>

      {/* New Idea Modal */}
      <NewIdeaModal 
        isOpen={isNewIdeaModalOpen} 
        onClose={() => setIsNewIdeaModalOpen(false)} 
        onSubmit={handleIdeaSubmit}
      />

      {/* Edit Idea Modal */}
      <EditIdeaModal 
        isOpen={!!editingIdea} 
        idea={editingIdea}
        onClose={() => setEditingIdea(null)} 
        onSave={handleUpdateIdea}
      />

      {/* View Idea Modal */}
      <ViewIdeaModal 
        isOpen={!!viewingIdea} 
        idea={viewingIdea} 
        onClose={() => setViewingIdea(null)} 
        onViewProfile={handleViewProfile}
        user={{ id: userId, name: userName }}
      />

      {/* Statistics Modal */}
      <StatisticsModal 
        isOpen={!!viewingStats} 
        idea={viewingStats} 
        onClose={() => setViewingStats(null)} 
      />
    </div>
  );
};

export default Dashboard;
