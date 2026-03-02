
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import ContactModal from './ContactModal';

interface UserProfile {
  profile_type: 'personal' | 'company';
  email: string;
  bio: string;
  avatar_url: string;
  website: string;
  full_name?: string;
  interests?: string;
  company_name?: string;
  industry?: string;
  contact_person?: string;
  investor_type?: string;
  investment_range?: string;
  sectors?: string[];
  is_investor?: boolean;
  // UI only fields (not in DB schema provided)
  role?: string;
  phone?: string;
  linkedin?: string;
  location?: string;
}

interface ProfilePageProps {
  userId?: string;
  initialUser: { 
    name: string;
    email?: string;
    bio?: string;
    location?: string;
    role?: string;
    avatar?: string;
    company?: string;
    website?: string;
    industry?: string;
    investor_type?: string;
    investment_range?: string;
    sectors?: string[];
    profile_type?: 'personal' | 'company';
  };
  onUpdate?: (name: string, avatarUrl?: string) => void;
  isReadOnly?: boolean;
  onBack?: () => void;
}

const getCommunityRank = (votes: number) => {
  if (votes >= 350) return 'Legendary';
  if (votes >= 200) return 'Grandmaster';
  if (votes >= 100) return 'Master';
  if (votes >= 50) return 'Pro';
  if (votes >= 25) return 'Elite';
  if (votes >= 10) return 'Veteran';
  return 'Rookie';
};

const ProfilePage: React.FC<ProfilePageProps> = ({ userId, initialUser, onUpdate, isReadOnly = false, onBack }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [voteBreakdown, setVoteBreakdown] = useState({ yes: 0, maybe: 0, no: 0 });
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<UserProfile>({
    profile_type: initialUser.profile_type || 'personal',
    email: initialUser.email || '',
    bio: initialUser.bio || "",
    avatar_url: initialUser.avatar || '',
    website: initialUser.website || "",
    full_name: initialUser.profile_type === 'personal' ? initialUser.name : '',
    company_name: initialUser.profile_type === 'company' ? initialUser.name : (initialUser.company || ''),
    location: initialUser.location || "",
    role: initialUser.role || '',
    industry: initialUser.industry || '',
    investor_type: initialUser.investor_type || 'Angel',
    investment_range: initialUser.investment_range || '',
    sectors: initialUser.sectors || [],
    is_investor: false,
    phone: "",
    linkedin: "",
  });

  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || userId === 'guest' || userId === 'admin') return;
      if (!isSupabaseConfigured()) return;

      setLoading(true);
      try {
        // Fetch profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data) {
          const fetchedProfile: UserProfile = {
            profile_type: data.profile_type,
            email: data.email,
            bio: data.bio || '',
            avatar_url: data.avatar_url || '',
            website: data.website || '',
            full_name: data.full_name || '',
            company_name: data.company_name || '',
            interests: data.interests || '',
            industry: data.industry || '',
            contact_person: data.contact_person || '',
            investor_type: data.investor_type || '',
            investment_range: data.investment_range || '',
            sectors: data.sectors || [],
            is_investor: data.interests === 'Yes',
            location: data.location || '',
            // UI only fields (not in DB)
            role: data.current_role || '',
            phone: data.contact_person || '',
            linkedin: ''
          };
          setProfile(fetchedProfile);
          setTempProfile(fetchedProfile);
        }

        // Fetch vote count
        const { data: voteData, error: voteError } = await supabase
          .from('idea_votes')
          .select('yes_vote, maybe_vote, no_vote')
          .eq('user_id', userId);
        
        if (!voteError && voteData) {
          setVoteCount(voteData.length);
          
          let yes = 0;
          let maybe = 0;
          let no = 0;
          
          voteData.forEach(vote => {
            if (vote.yes_vote) yes++;
            if (vote.maybe_vote) maybe++;
            if (vote.no_vote) no++;
          });
          
          setVoteBreakdown({ yes, maybe, no });
        }
      } catch (err) {
        console.error('Unexpected error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, isReadOnly]);

  const handleSave = async () => {
    if (!userId || userId === 'guest' || userId === 'admin') {
      setProfile(tempProfile);
      if (onUpdate) onUpdate(profile.profile_type === 'personal' ? (tempProfile.full_name || '') : (tempProfile.company_name || ''), tempProfile.avatar_url);
      setIsEditing(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      alert('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
      return;
    }

    setLoading(true);
    try {
      const updateData: any = {
        email: tempProfile.email,
        bio: tempProfile.bio,
        website: tempProfile.website,
        avatar_url: tempProfile.avatar_url,
        current_role: tempProfile.role,
        location: tempProfile.location,
        updated_at: new Date().toISOString()
      };

      if (profile.profile_type === 'personal') {
        updateData.full_name = tempProfile.full_name;
        // Store investor status in interests column as requested
        updateData.interests = tempProfile.is_investor ? 'Yes' : 'No';
        
        // Map is_investor to investor_type for persistence as well
        if (tempProfile.is_investor) {
          // Also store company_name and industry for personal profiles if they are investors
          updateData.company_name = tempProfile.company_name;
          updateData.industry = tempProfile.industry;
          updateData.contact_person = tempProfile.phone;
          updateData.investment_range = tempProfile.investment_range;
          updateData.sectors = tempProfile.sectors;
        } else {
          updateData.contact_person = tempProfile.phone;
        }
      } else {
        updateData.company_name = tempProfile.company_name;
        updateData.industry = tempProfile.industry;
        updateData.contact_person = tempProfile.contact_person;
        updateData.investment_range = tempProfile.investment_range;
        updateData.sectors = tempProfile.sectors;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', userId);

      if (error) throw error;

      setProfile(tempProfile);
      if (onUpdate) onUpdate(profile.profile_type === 'personal' ? (tempProfile.full_name || '') : (tempProfile.company_name || ''), tempProfile.avatar_url);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      let msg = err.message || 'Failed to update profile';
      if (msg === 'Failed to fetch') {
        msg = 'Connection error: Please check your Supabase configuration and internet connection.';
      }
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfile({ ...tempProfile, avatar_url: reader.result as string });
        setShowAvatarMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    setTempProfile({ ...tempProfile, avatar_url: '' });
    setShowAvatarMenu(false);
  };

  const inputStyles = "w-full bg-[#1e293b]/50 border border-gray-700 text-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#00BA9D] focus:border-transparent transition-all outline-none placeholder:text-gray-500 disabled:opacity-70";
  const labelStyles = "block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2";

  if (loading && !isEditing) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#00BA9D]/30 border-t-[#00BA9D] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in max-w-4xl">
      {isReadOnly && (
        <button 
          onClick={onBack}
          className="mb-6 flex items-center text-[#00BA9D] font-bold hover:underline"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Network
        </button>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              {profile.profile_type === 'personal' ? profile.full_name : profile.company_name}
            </h1>
            <p className="text-gray-400">
              {isReadOnly ? `Viewing public information for ${profile.profile_type === 'personal' ? profile.full_name : profile.company_name}.` : 'Manage your public presence and personal information.'}
            </p>
          </div>
        {!isReadOnly && (
          !isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-[#00BA9D] hover:bg-[#00a88d] text-white px-8 py-3 rounded-full font-bold transition-all transform active:scale-95 shadow-lg shadow-teal-500/20 flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>{t('Edit Profile')}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleCancel}
                className="px-6 py-3 rounded-full text-gray-400 hover:text-white font-bold transition-all"
              >
                {t('Cancel')}
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="bg-[#00BA9D] hover:bg-[#00a88d] text-white px-8 py-3 rounded-full font-bold transition-all transform active:scale-95 shadow-lg shadow-teal-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                <span>{loading ? t('Saving...') : t('Save Changes')}</span>
              </button>
            </div>
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="space-y-6">
          <div className="bg-[#1e293b]/20 border border-gray-800 rounded-3xl p-8 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-[#00BA9D]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
              <div className="relative inline-block group/avatar">
                <div 
                  onClick={() => !isReadOnly && isEditing && setShowAvatarMenu(!showAvatarMenu)}
                  className={`w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-700 flex items-center justify-center text-4xl font-bold text-white shadow-2xl mx-auto mb-6 transition-all overflow-hidden relative ${!isReadOnly && isEditing ? 'cursor-pointer hover:scale-105 hover:border-[#00BA9D]/50' : ''}`}
                >
                  {tempProfile.avatar_url && (tempProfile.avatar_url.startsWith('http') || tempProfile.avatar_url.startsWith('data:')) ? (
                    <img src={tempProfile.avatar_url} alt={profile.profile_type === 'personal' ? profile.full_name : profile.company_name} className="w-full h-full object-cover" />
                  ) : (
                    tempProfile.avatar_url || initialUser.avatar || (profile.profile_type === 'personal' ? tempProfile.full_name?.[0] : tempProfile.company_name?.[0])?.toUpperCase() || '?'
                  )}
                  
                  {!isReadOnly && isEditing && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Avatar Options Popup */}
                {showAvatarMenu && !isReadOnly && isEditing && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#0f172a] border border-gray-800 rounded-2xl shadow-2xl z-50 py-2 animate-fade-in-up">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center space-x-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#00BA9D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="font-medium">{t('Upload Image')}</span>
                    </button>
                    <button 
                      onClick={handleDeleteAvatar}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center space-x-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="font-medium">{t('Delete Image')}</span>
                    </button>
                  </div>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {profile.profile_type === 'personal' ? profile.full_name : profile.company_name}
              </h2>
              <p className="text-[#00BA9D] text-sm font-bold uppercase tracking-widest mb-4">{profile.role}</p>
              <div className="flex items-center justify-center text-gray-500 text-sm mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {profile.location}
              </div>
            </div>
          </div>

          <div className="bg-[#1e293b]/20 border border-gray-800 rounded-3xl p-8">
            <h4 className={labelStyles}>{isReadOnly ? t('Company Stats') : t('Account Stats')}</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Member Since</span>
                <span className="text-white text-sm font-medium">Feb 2024</span>
              </div>
              {!isReadOnly && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Ideas Validated</span>
                  <span className="text-white text-sm font-medium">{voteCount}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">{isReadOnly ? 'Company Type' : 'Community Rank'}</span>
                <span className="text-[#00BA9D] text-sm font-bold">
                  {isReadOnly ? (profile.investor_type || 'Angel') : getCommunityRank(voteCount)}
                </span>
              </div>
              {isReadOnly && profile.investment_range && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Check Size</span>
                  <span className="text-white text-sm font-medium">{profile.investment_range}</span>
                </div>
              )}
            </div>
            
            {/* Vote Breakdown */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h4 className={labelStyles}>Voting History</h4>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-[#1e293b]/40 rounded-xl p-3 flex flex-col items-center justify-center">
                  <span className="text-xl mb-1">👍</span>
                  <span className="text-white font-bold">{voteBreakdown.yes}</span>
                  <span className="text-gray-500 text-[10px] uppercase font-bold mt-1">Yes</span>
                </div>
                <div className="bg-[#1e293b]/40 rounded-xl p-3 flex flex-col items-center justify-center">
                  <span className="text-xl mb-1">🤷</span>
                  <span className="text-white font-bold">{voteBreakdown.maybe}</span>
                  <span className="text-gray-500 text-[10px] uppercase font-bold mt-1">Maybe</span>
                </div>
                <div className="bg-[#1e293b]/40 rounded-xl p-3 flex flex-col items-center justify-center">
                  <span className="text-xl mb-1">👎</span>
                  <span className="text-white font-bold">{voteBreakdown.no}</span>
                  <span className="text-gray-500 text-[10px] uppercase font-bold mt-1">No</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-2">
          <div className="bg-[#1e293b]/20 border border-gray-800 rounded-3xl p-8 sm:p-10">
            <div className="space-y-8">
              {/* Basic Info Section */}
              <section>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[#00BA9D] rounded-full mr-3" />
                    {isReadOnly ? t('About') : t('Personal Information')}
                  </div>
                  {isReadOnly && (
                    <button 
                      onClick={() => setShowContactModal(true)}
                      className="bg-[#00BA9D] hover:bg-[#00a88d] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-teal-500/20 transition-all transform active:scale-95"
                    >
                      {t('Contact')}
                    </button>
                  )}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyles}>{profile.profile_type === 'personal' ? t('Full Name') : t('Company Name')}</label>
                    <input 
                      type="text" 
                      className={inputStyles}
                      value={profile.profile_type === 'personal' ? tempProfile.full_name : tempProfile.company_name}
                      onChange={(e) => {
                        if (profile.profile_type === 'personal') {
                          setTempProfile({...tempProfile, full_name: e.target.value});
                        } else {
                          setTempProfile({...tempProfile, company_name: e.target.value});
                        }
                      }}
                      disabled={!isEditing || isReadOnly}
                    />
                  </div>
                  {isReadOnly && profile.profile_type === 'personal' && tempProfile.company_name && (
                    <div>
                      <label className={labelStyles}>{t('Company Name')}</label>
                      <input 
                        type="text" 
                        className={inputStyles}
                        value={tempProfile.company_name}
                        disabled={true}
                      />
                    </div>
                  )}
                  {!isReadOnly && (
                    <div>
                      <label className={labelStyles}>{t('Email Address')}</label>
                      <input 
                        type="email" 
                        className={inputStyles}
                        value={tempProfile.email}
                        onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  )}
                  <div>
                    <label className={labelStyles}>{t('Current Role')}</label>
                    <input 
                      type="text" 
                      className={inputStyles}
                      value={tempProfile.role}
                      onChange={(e) => setTempProfile({...tempProfile, role: e.target.value})}
                      disabled={!isEditing || isReadOnly}
                    />
                  </div>
                  {isReadOnly && (
                    <div>
                      <label className={labelStyles}>{t('Type of Company')}</label>
                      <input 
                        type="text" 
                        className={inputStyles}
                        value={tempProfile.investor_type || 'Angel'}
                        disabled={true}
                      />
                    </div>
                  )}
                  {isReadOnly && tempProfile.sectors && tempProfile.sectors.length > 0 && (
                    <div className="sm:col-span-2">
                      <label className={labelStyles}>{t('Sectors')}</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tempProfile.sectors.map((sector) => (
                          <span key={sector} className="bg-gray-800/50 text-gray-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-gray-700">
                            {sector.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {isReadOnly && tempProfile.investment_range && (
                    <div>
                      <label className={labelStyles}>{t('Max Investment Amount')}</label>
                      <input 
                        type="text" 
                        className={inputStyles}
                        value={tempProfile.investment_range && tempProfile.investment_range.includes('-') ? tempProfile.investment_range.split('-')[1].trim() : tempProfile.investment_range}
                        disabled={true}
                      />
                    </div>
                  )}
                  <div>
                    <label className={labelStyles}>Location</label>
                    <input 
                      type="text" 
                      className={inputStyles}
                      value={tempProfile.location}
                      onChange={(e) => setTempProfile({...tempProfile, location: e.target.value})}
                      disabled={!isEditing || isReadOnly}
                    />
                  </div>
                  {profile.industry && (
                    <div>
                      <label className={labelStyles}>Industry</label>
                      <input 
                        type="text" 
                        className={inputStyles}
                        value={tempProfile.industry}
                        onChange={(e) => setTempProfile({...tempProfile, industry: e.target.value})}
                        disabled={!isEditing || isReadOnly}
                      />
                    </div>
                  )}
                  
                  {/* Are you an investor question */}
                  {!isReadOnly && (
                    <div className="sm:col-span-2 mt-4 p-6 bg-[#0f172a]/30 border border-gray-800 rounded-2xl">
                      <label className="block text-white font-bold mb-4">Are you a company?</label>
                      <div className="flex space-x-4 mb-6">
                        <button
                          type="button"
                          disabled={!isEditing}
                          onClick={() => setTempProfile({...tempProfile, is_investor: true})}
                          className={`flex-1 py-3 rounded-xl font-bold transition-all border ${tempProfile.is_investor === true ? 'bg-[#00BA9D] border-[#00BA9D] text-white shadow-lg shadow-teal-500/20' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'}`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          disabled={!isEditing}
                          onClick={() => setTempProfile({...tempProfile, is_investor: false})}
                          className={`flex-1 py-3 rounded-xl font-bold transition-all border ${tempProfile.is_investor === false ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'}`}
                        >
                          No
                        </button>
                      </div>

                      {tempProfile.is_investor && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                          <div>
                            <label className={labelStyles}>Company Name</label>
                            <input 
                              type="text" 
                              className={inputStyles}
                              value={tempProfile.company_name || ''}
                              onChange={(e) => setTempProfile({...tempProfile, company_name: e.target.value})}
                              disabled={!isEditing}
                              placeholder="e.g. Sequoia Capital"
                            />
                          </div>
                          <div>
                            <label className={labelStyles}>Industry</label>
                            <input 
                              type="text" 
                              className={inputStyles}
                              value={tempProfile.industry || ''}
                              onChange={(e) => setTempProfile({...tempProfile, industry: e.target.value})}
                              disabled={!isEditing}
                              placeholder="e.g. Fintech, AI"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className={labelStyles}>What type of company are you?</label>
                            <select 
                              className={inputStyles}
                              value={tempProfile.investor_type || ''}
                              onChange={(e) => setTempProfile({...tempProfile, investor_type: e.target.value})}
                              disabled={!isEditing}
                            >
                              <option value="">Select investor type</option>
                              <option value="Angel">Angel</option>
                              <option value="venture_capital">Venture Capital</option>
                              <option value="corporate">Corporate</option>
                              <option value="private_equity">Private Equity</option>
                              <option value="seed_investor">Seed Investor</option>
                              <option value="accelerator">Accelerator</option>
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className={labelStyles}>What sectors do you invest in?</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {['fintech', 'healthtech', 'ai', 'edtech', 'ecommerce', 'blockchain', 'saas', 'gaming', 'green_energy', 'biotech', 'Other'].map((sector) => {
                                const isSelected = tempProfile.sectors?.includes(sector);
                                return (
                                  <button
                                    key={sector}
                                    type="button"
                                    disabled={!isEditing}
                                    onClick={() => {
                                      const currentSectors = tempProfile.sectors || [];
                                      if (isSelected) {
                                        setTempProfile({ ...tempProfile, sectors: currentSectors.filter(s => s !== sector) });
                                      } else {
                                        setTempProfile({ ...tempProfile, sectors: [...currentSectors, sector] });
                                      }
                                    }}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${isSelected ? 'bg-[#00BA9D] border-[#00BA9D] text-white shadow-lg shadow-teal-500/20' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'}`}
                                  >
                                    {sector.replace('_', ' ')}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          <div className="sm:col-span-2">
                            <label className={labelStyles}>How much are you planning to invest maximum?</label>
                            <input 
                              type="text" 
                              className={inputStyles}
                              value={tempProfile.investment_range || ''}
                              onChange={(e) => setTempProfile({...tempProfile, investment_range: e.target.value})}
                              disabled={!isEditing}
                              placeholder="e.g. $50,000"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* Bio Section */}
              <section>
                    <label className={labelStyles}>{t('Bio')} / About</label>
                <textarea 
                  rows={4}
                  className={inputStyles}
                  value={tempProfile.bio}
                  onChange={(e) => setTempProfile({...tempProfile, bio: e.target.value})}
                  disabled={!isEditing || isReadOnly}
                  placeholder="Tell the community about yourself..."
                />
              </section>

              {/* Sectors Section (for Investors) */}
              {profile.profile_type === 'company' && (
                <section>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <span className="w-2 h-2 bg-teal-500 rounded-full mr-3" />
                    Investment Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelStyles}>Company Type</label>
                      <select 
                        className={inputStyles}
                        value={tempProfile.investor_type}
                        onChange={(e) => setTempProfile({...tempProfile, investor_type: e.target.value})}
                        disabled={!isEditing || isReadOnly}
                      >
                        <option value="Angel">Angel Investor</option>
                        <option value="VC">Venture Capital</option>
                        <option value="Syndicate">Syndicate</option>
                        <option value="Accelerator">Accelerator</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelStyles}>Investment Range</label>
                      <input 
                        type="text" 
                        className={inputStyles}
                        value={tempProfile.investment_range}
                        onChange={(e) => setTempProfile({...tempProfile, investment_range: e.target.value})}
                        disabled={!isEditing || isReadOnly}
                        placeholder="e.g. $10k - $50k"
                      />
                    </div>
                    <div>
                      <label className={labelStyles}>Contact Person</label>
                      <input 
                        type="text" 
                        className={inputStyles}
                        value={tempProfile.contact_person}
                        onChange={(e) => setTempProfile({...tempProfile, contact_person: e.target.value})}
                        disabled={!isEditing || isReadOnly}
                        placeholder="Name of contact"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelStyles}>Focus Sectors (comma separated)</label>
                      {isEditing && !isReadOnly ? (
                        <input 
                          type="text" 
                          className={inputStyles}
                          value={tempProfile.sectors?.join(', ')}
                          onChange={(e) => setTempProfile({...tempProfile, sectors: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                          placeholder="e.g. AI, SaaS, Fintech"
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {profile.sectors && profile.sectors.length > 0 ? (
                            profile.sectors.map((sector) => (
                              <span key={sector} className="bg-gray-800/50 text-gray-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-gray-700">
                                {sector}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 italic text-sm">No sectors specified</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Online Presence Section */}
              <section>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3" />
                  Online Presence
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyles}>{t('Website')}</label>
                    <input 
                      type="text" 
                      className={inputStyles}
                      value={tempProfile.website}
                      onChange={(e) => setTempProfile({...tempProfile, website: e.target.value})}
                      disabled={!isEditing || isReadOnly}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label className={labelStyles}>Contact</label>
                    <input 
                      type="text" 
                      className={inputStyles}
                      value={tempProfile.phone}
                      onChange={(e) => setTempProfile({...tempProfile, phone: e.target.value})}
                      disabled={!isEditing || isReadOnly}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal 
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          contactInfo={{
            name: profile.profile_type === 'personal' ? (profile.full_name || '') : (profile.company_name || ''),
            email: profile.email,
            website: profile.website,
            linkedin: profile.linkedin,
            phone: profile.phone
          }}
        />
      )}
    </div>
  );
};

export default ProfilePage;
