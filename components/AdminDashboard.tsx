import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { useDevice } from '../hooks/useDevice';
import AdminBottomNav from './AdminBottomNav';
import { Lightbulb } from 'lucide-react';

interface AdminDashboardProps {
  isDark: boolean;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isDark, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  // Edit User State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // View Idea State
  const [isViewIdeaModalOpen, setIsViewIdeaModalOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);

  // Delete Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // User Delete Confirmation State
  const [isUserDeleteModalOpen, setIsUserDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // Add User State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Personal',
    status: 'Active'
  });

  // Data states
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [ideaCount, setIdeaCount] = useState<number | null>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const { deviceType, isPWA } = useDevice();
  const isMobileOrPWA = deviceType === 'mobile' || isPWA;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setShowSuccess(true);
      setBroadcastMessage('');
      setTimeout(() => {
        setShowSuccess(false);
        setIsBroadcastModalOpen(false);
      }, 2000);
    }, 1500);
  };

  const generateReport = () => {
    setIsGeneratingReport(true);
    
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('IdeaConnect - User Management Report', 14, 22);
      
      // Add date
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      
      // Add stats summary
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Summary Stats:', 14, 45);
      doc.setFontSize(10);
      doc.text(`Total Users: ${users.length}`, 14, 52);
      doc.text(`Active Ideas: ${ideaCount || 0}`, 14, 58);

      // Add user table
      const tableColumn = ["ID", "Name", "Email", "Role", "Status", "Joined"];
      const tableRows = users.map(user => [
        user.id?.slice(0, 8) || 'N/A',
        user.name,
        user.email,
        user.role,
        user.status,
        user.joined
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 75,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] },
      });

      doc.save(`ideaconnect-user-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const confirmDelete = (idea: any) => {
    setIdeaToDelete(idea);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!ideaToDelete) return;
    setIsDeleting(true);
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('ideas')
          .delete()
          .eq('id', ideaToDelete.id);

        if (error) throw error;
      }
      
      setIdeas(ideas.filter(i => i.id !== ideaToDelete.id));
      setIsDeleteModalOpen(false);
      setIdeaToDelete(null);
      
      if (selectedIdea && selectedIdea.id === ideaToDelete.id) {
        setIsViewIdeaModalOpen(false);
        setSelectedIdea(null);
      }
    } catch (err: any) {
      console.error("Error deleting idea:", err);
      alert("Error deleting idea: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (user: any) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };

  const confirmDeleteUser = (user: any) => {
    setUserToDelete(user);
    setIsUserDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeletingUser(true);
    try {
      if (isSupabaseConfigured()) {
        // Delete user auth
        const { error: authError } = await supabase.auth.admin.deleteUser(userToDelete.id);
        if (authError) throw authError;
      }
      
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setIsUserDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err: any) {
      console.error("Error deleting user:", err);
      alert("Error deleting user: " + err.message);
    } finally {
      setIsDeletingUser(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsUpdating(true);
    
    try {
      if (isSupabaseConfigured()) {
        const { error: authError } = await supabase.auth.admin.updateUserById(editingUser.id, {
          email: editingUser.email,
          user_metadata: { full_name: editingUser.name }
        });

        if (authError) throw authError;

        const profileType = editingUser.role === 'Investor' ? 'company' : 'personal';
        const profileUpdate: any = {
          email: editingUser.email,
          profile_type: profileType,
          updated_at: new Date().toISOString()
        };

        if (profileType === 'personal') {
          profileUpdate.full_name = editingUser.name;
        } else {
          profileUpdate.company_name = editingUser.name;
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdate)
          .eq('user_id', editingUser.id);

        if (profileError) throw profileError;
      }
      
      setIsUpdating(false);
      setUpdateSuccess(true);
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      
      setTimeout(() => {
        setUpdateSuccess(false);
        setIsEditModalOpen(false);
        setEditingUser(null);
      }, 1500);
    } catch (err: any) {
      console.error("Error updating user:", err);
      alert("Error updating user: " + err.message);
      setIsUpdating(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingUser(true);
    
    try {
      if (isSupabaseConfigured()) {
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: newUser.email,
          email_confirm: true,
          user_metadata: { full_name: newUser.name }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("User creation failed");

        const profileType = newUser.role.toLowerCase() === 'company' ? 'company' : 'personal';
        
        const profileData: any = {
          user_id: authData.user.id,
          email: newUser.email,
          profile_type: profileType,
          updated_at: new Date().toISOString()
        };

        if (profileType === 'personal') {
          profileData.full_name = newUser.name;
        } else {
          profileData.company_name = newUser.name;
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(profileData);

        if (profileError) throw profileError;

        const userToAdd = {
          id: authData.user.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
          joined: new Date().toISOString().split('T')[0]
        };
        
        setUsers([userToAdd, ...users]);
      }
      
      setAddSuccess(true);
      
      setTimeout(() => {
        setAddSuccess(false);
        setIsAddModalOpen(false);
        setNewUser({
          name: '',
          email: '',
          role: 'Personal',
          status: 'Active'
        });
      }, 1500);
    } catch (err: any) {
      console.error("Error adding user:", err);
      alert("Error adding user: " + err.message);
    } finally {
      setIsAddingUser(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'Users' || activeTab === 'Overview') {
      fetchUsers();
    }
    if (activeTab === 'Overview') {
      fetchIdeaCount();
    }
    if (activeTab === 'Moderation') {
      fetchIdeas();
    }
  }, [activeTab]);

  const fetchIdeas = async () => {
    setLoadingIdeas(true);
    setLoadingError(null);
    try {
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured, using empty data');
        setIdeas([]);
        return;
      }

      // Fetch ideas without join (due to missing foreign key relationship)
      const { data: ideasData, error: ideasError } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (ideasError) throw ideasError;

      if (ideasData && ideasData.length > 0) {
        // Get unique user IDs
        const userIds = [...new Set(ideasData.map(idea => idea.user_id).filter(Boolean))];
        
        // Fetch profiles for these users
        let profilesMap: Record<string, any> = {};
        if (userIds.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('user_id, full_name, company_name, email')
            .in('user_id', userIds);
          
          if (profilesData) {
            profilesData.forEach(profile => {
              profilesMap[profile.user_id] = profile;
            });
          }
        }

        const mappedIdeas = ideasData.map((idea: any) => {
          const profile = profilesMap[idea.user_id];
          return {
            id: idea.id,
            title: idea.title,
            author: profile?.full_name || profile?.company_name || profile?.email || 'Unknown',
            category: idea.category,
            submitted: new Date(idea.created_at).toISOString().split('T')[0],
            description: idea.description,
            stage: idea.stage,
            tags: idea.tags,
            seeking_investment: idea.seeking_investment,
            investment_amount: idea.investment_amount,
            views: idea.views
          };
        });
        setIdeas(mappedIdeas);
      } else {
        setIdeas([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch ideas:', err);
      setLoadingError(err.message);
      setIdeas([]);
    } finally {
      setLoadingIdeas(false);
    }
  };

  const fetchIdeaCount = async () => {
    try {
      if (!isSupabaseConfigured()) {
        setIdeaCount(0);
        return;
      }

      const { count, error } = await supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      setIdeaCount(count || 0);
    } catch (err: any) {
      console.error('Failed to fetch idea count:', err);
      setIdeaCount(0);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setLoadingError(null);
    try {
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured, using empty data');
        setUsers([]);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedUsers = data.map((profile: any) => ({
          id: profile.user_id,
          name: profile.full_name || profile.company_name || 'Unknown',
          email: profile.email || 'No email',
          role: profile.profile_type === 'company' ? 'Company' : 'Personal',
          status: 'Active',
          joined: new Date(profile.created_at).toISOString().split('T')[0]
        }));
        setUsers(mappedUsers);
      }
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      setLoadingError(err.message);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Users", value: loadingUsers ? "..." : (users.length > 0 ? users.length.toString() : "0"), icon: "👥", color: "text-blue-400" },
    { label: "Active Ideas", value: ideaCount !== null ? ideaCount.toString() : "...", icon: "💡", color: "text-yellow-400" },
  ];

  return (
    <div className={`flex-grow flex flex-col bg-[#020617] ${isMobileOrPWA ? 'pb-20' : ''}`}>
      {/* Admin Navbar */}
      {!isMobileOrPWA && (
        <nav className="bg-[#020617] border-b border-gray-800 px-6 py-4 sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-12">
              <div className="flex items-center text-xl font-bold text-white">
                <Lightbulb className="w-6 h-6 mr-2 text-indigo-500" />
                IdeaConnect <span className="ml-2 px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] uppercase tracking-widest rounded border border-indigo-500/20">Admin</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                {['Overview', 'Users', 'Moderation'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-sm font-medium transition-colors ${
                      activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <button onClick={onLogout} className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Top Bar */}
      {isMobileOrPWA && (
        <div className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-gray-800 p-4 flex justify-center items-center">
          <div className="flex items-center text-xl font-bold text-white">
            <Lightbulb className="w-6 h-6 mr-2 text-indigo-500" />
            IdeaConnect <span className="ml-2 px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] uppercase tracking-widest rounded border border-indigo-500/20">Admin</span>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      {isMobileOrPWA && (
        <AdminBottomNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={onLogout} 
        />
      )}

      <main className="container mx-auto px-6 py-12">
        {loadingError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6">
            Error loading data: {loadingError}
          </div>
        )}

        {activeTab === 'Overview' && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-8">System Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-[#1e293b]/20 border border-gray-800 p-6 rounded-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="bg-[#1e293b]/10 border border-gray-800 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={generateReport}
                    disabled={isGeneratingReport}
                    className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 font-bold hover:bg-indigo-500/20 transition-all text-sm flex items-center justify-center disabled:opacity-50"
                  >
                    {isGeneratingReport ? (
                      <svg className="animate-spin h-4 w-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : "Generate Report"}
                  </button>
                  <button 
                    onClick={() => setIsBroadcastModalOpen(true)}
                    className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 font-bold hover:bg-green-500/20 transition-all text-sm"
                  >
                    Broadcast Message
                  </button>
                  <button className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400 font-bold hover:bg-purple-500/20 transition-all text-sm">
                    System Audit
                  </button>
                  <button className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 font-bold hover:bg-red-500/20 transition-all text-sm">
                    Maintenance Mode
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Users' && (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h1 className="text-3xl font-bold text-white">User Management</h1>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-10 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {userSearchQuery && (
                    <button 
                      onClick={() => setUserSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold transition-all w-full sm:w-auto"
                >
                  + Add User
                </button>
              </div>
            </div>
            
            <div className="bg-[#1e293b]/10 border border-gray-800 rounded-3xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left min-w-[600px] md:min-w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-800/20">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">User</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Role</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Joined</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-gray-500 italic">
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-white">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${user.role === 'Company' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                            user.status === 'Active' ? 'bg-teal-500/10 text-teal-400' : 
                            user.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{user.joined}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleEditClick(user)}
                            className="text-gray-400 hover:text-white mr-4 text-xs font-bold"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => confirmDeleteUser(user)}
                            className="text-red-600 hover:text-red-500 text-xs font-bold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-gray-500 italic">
                        No users found matching "{userSearchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Moderation' && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-8">Idea Moderation</h1>
            <div className="grid grid-cols-1 gap-4">
              {loadingIdeas ? (
                 <div className="text-center py-10 text-gray-500">Loading ideas...</div>
              ) : ideas.length > 0 ? (
                ideas.map((idea) => (
                <div key={idea.id} className="bg-[#1e293b]/20 border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{idea.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>By <span className="text-indigo-400 font-medium">{idea.author}</span></span>
                      <span>•</span>
                      <span>{idea.category}</span>
                      <span>•</span>
                      <span>Submitted {idea.submitted}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => confirmDelete(idea)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-all"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedIdea(idea);
                        setIsViewIdeaModalOpen(true);
                      }}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded-lg transition-all"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
              ) : (
                <div className="text-center py-10 text-gray-500">No ideas found.</div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Broadcast Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSending && setIsBroadcastModalOpen(false)} />
          <div className="relative bg-[#0f172a] border border-gray-800 w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Broadcast Message</h2>
                <button 
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {showSuccess ? (
                <div className="py-12 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400">Your broadcast has been delivered to all users.</p>
                </div>
              ) : (
                <form onSubmit={handleBroadcast}>
                  <p className="text-gray-400 text-sm mb-4">
                    This message will be sent as a global notification to all active users on the platform.
                  </p>
                  <textarea
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Enter your message here..."
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors h-40 resize-none mb-6"
                    required
                  />
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsBroadcastModalOpen(false)}
                      className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-white/5 transition-all"
                      disabled={isSending}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSending || !broadcastMessage.trim()}
                      className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-50 text-white hover:text-indigo-900 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSending ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : "Send Broadcast"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isAddingUser && setIsAddModalOpen(false)} />
          <div className="relative bg-[#0f172a] border border-gray-800 w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Add New User</h2>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {addSuccess ? (
                <div className="py-12 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">User Added!</h3>
                  <p className="text-gray-400">The new user has been successfully created.</p>
                </div>
              ) : (
                <form onSubmit={handleAddUser} className="space-y-6">
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Username</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Email</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Role</label>
                      <div className="relative">
                        <select
                          value={newUser.role}
                          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                        >
                          <option value="Personal">Personal</option>
                          <option value="Company">Company</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Status</label>
                      <div className="relative">
                        <select
                          value={newUser.status}
                          onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                        >
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-white/5 transition-all"
                      disabled={isAddingUser}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isAddingUser}
                      className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-50 text-white hover:text-indigo-900 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isAddingUser ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : "Create User"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isUpdating && setIsEditModalOpen(false)} />
          <div className="relative bg-[#0f172a] border border-gray-800 w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Edit User</h2>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {updateSuccess ? (
                <div className="py-12 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">User Updated!</h3>
                  <p className="text-gray-400">The user details have been successfully saved.</p>
                </div>
              ) : (
                <form onSubmit={handleUpdateUser} className="space-y-6">
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Email Address</label>
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Role</label>
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                      >
                        <option value="Personal">Personal</option>
                        <option value="Company">Company</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Status</label>
                      <select
                        value={editingUser.status}
                        onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-white/5 transition-all"
                      disabled={isUpdating}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-50 text-white hover:text-indigo-900 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isUpdating ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Idea Modal */}
      {isViewIdeaModalOpen && selectedIdea && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsViewIdeaModalOpen(false)} />
          <div className="relative bg-[#0f172a] border border-gray-800 w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-indigo-500/20 mb-2 inline-block">
                    {selectedIdea.category}
                  </span>
                  <h2 className="text-3xl font-bold text-white">{selectedIdea.title}</h2>
                  <p className="text-gray-500 text-sm">Submitted by <span className="text-indigo-400 font-medium">{selectedIdea.author}</span> on {selectedIdea.submitted}</p>
                </div>
                <button 
                  onClick={() => setIsViewIdeaModalOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedIdea.description}</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section>
                    <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">Stage</h3>
                    <p className="text-gray-400 text-sm leading-relaxed capitalize">{selectedIdea.stage}</p>
                  </section>
                  <section>
                    <h3 className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3">Investment</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {selectedIdea.seeking_investment 
                        ? `Seeking ${selectedIdea.investment_amount || 'Investment'}` 
                        : 'Not currently seeking investment'}
                    </p>
                  </section>
                </div>

                <section>
                  <h3 className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedIdea.tags && selectedIdea.tags.length > 0 ? (
                      selectedIdea.tags.map((tag: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md border border-gray-700">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No tags</p>
                    )}
                  </div>
                </section>

                <div className="flex space-x-4 pt-6 border-t border-gray-800">
                  <button
                    onClick={() => confirmDelete(selectedIdea)}
                    className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20"
                  >
                    Reject Idea
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && ideaToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isDeleting && setIsDeleteModalOpen(false)} />
          <div className="relative bg-[#0f172a] border border-gray-800 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Delete Idea?</h2>
              <p className="text-gray-400 mb-8">
                Are you sure you want to delete <span className="text-white font-bold">"{ideaToDelete.title}"</span>? This action cannot be undone.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:bg-white/5 transition-all"
                  disabled={isDeleting}
                >
                  No, Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center justify-center"
                >
                  {isDeleting ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* User Delete Confirmation Modal */}
      {isUserDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isDeletingUser && setIsUserDeleteModalOpen(false)} />
          <div className="relative bg-[#0f172a] border border-gray-800 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Delete User?</h2>
              <p className="text-gray-400 mb-8">
                Are you sure you want to delete <span className="text-white font-bold">"{userToDelete.name}"</span>? This will also delete all their ideas and data. This action cannot be undone.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setIsUserDeleteModalOpen(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:bg-white/5 transition-all"
                  disabled={isDeletingUser}
                >
                  No, Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={isDeletingUser}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center justify-center"
                >
                  {isDeletingUser ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
