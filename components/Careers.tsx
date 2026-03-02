
import React from 'react';

interface CareersProps {
  onBack: () => void;
  isDark: boolean;
}

const OPEN_POSITIONS = [
  {
    id: 1,
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Remote / New York",
    type: "Full-time"
  },
  {
    id: 2,
    title: "Product Designer (UX/UI)",
    department: "Design",
    location: "Remote / London",
    type: "Full-time"
  },
  {
    id: 3,
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time"
  },
  {
    id: 4,
    title: "Customer Success Lead",
    department: "Operations",
    location: "Remote / San Francisco",
    type: "Full-time"
  }
];

const Careers: React.FC<CareersProps> = ({ onBack, isDark }) => {
  return (
    <div className={`min-h-screen py-20 px-6 ${isDark ? 'bg-[#080D1D] text-gray-300' : 'bg-slate-50 text-gray-700'}`}>
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-12 flex items-center text-indigo-500 hover:text-indigo-400 font-bold transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>

        <div className="text-center mb-24">
          <h1 className={`text-5xl md:text-6xl font-extrabold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Build the Future of <span className="text-indigo-500">Innovation</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-400">
            We're on a mission to help creators validate their ideas and launch successful businesses. Join our global team of builders, designers, and thinkers.
          </p>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            { title: "Remote-First", desc: "Work from anywhere in the world. We value output over hours spent in a chair.", icon: "🌍" },
            { title: "Ownership", desc: "We give you the autonomy to make big decisions and own your projects from start to finish.", icon: "🚀" },
            { title: "Radical Candor", desc: "We believe in honest, direct feedback delivered with kindness and respect.", icon: "💬" }
          ].map((value) => (
            <div key={value.title} className={`p-8 rounded-3xl border ${isDark ? 'bg-[#111827] border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{value.title}</h3>
              <p className="text-gray-400 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>

        {/* Open Positions */}
        <div className="mb-32">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Open Positions</h2>
              <p className="text-gray-400">Join us in our mission to empower creators.</p>
            </div>
            <div className="hidden md:block">
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                {OPEN_POSITIONS.length} Roles Available
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {OPEN_POSITIONS.map((job) => (
              <div 
                key={job.id} 
                className={`group p-6 md:p-8 rounded-3xl border transition-all duration-300 cursor-pointer hover:shadow-xl ${
                  isDark 
                    ? 'bg-[#111827] border-gray-800 hover:border-indigo-500/50' 
                    : 'bg-white border-gray-100 hover:border-indigo-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className={`text-xl font-bold mb-1 group-hover:text-indigo-500 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m4 0h1m-5 10h1m4 0h1m-5-4h1m4 0h1" /></svg>
                        {job.department}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <button className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    isDark 
                      ? 'bg-gray-800 text-white hover:bg-indigo-600' 
                      : 'bg-gray-100 text-gray-900 hover:bg-indigo-600 hover:text-white'
                  }`}>
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className={`p-12 md:p-20 rounded-[3rem] relative overflow-hidden ${isDark ? 'bg-indigo-600/10 border border-indigo-500/20' : 'bg-indigo-50 border border-indigo-100'}`}>
          <div className="relative z-10">
            <h2 className={`text-3xl font-bold mb-12 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>Perks & Benefits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Competitive Pay", desc: "Top-tier salary and equity packages.", icon: "💰" },
                { title: "Health & Wellness", desc: "Full medical, dental, and vision coverage.", icon: "🏥" },
                { title: "Learning Budget", desc: "$2,000 annual budget for your growth.", icon: "📚" },
                { title: "Home Office", desc: "$1,500 stipend to build your perfect setup.", icon: "🖥️" }
              ].map((benefit) => (
                <div key={benefit.title} className="text-center">
                  <div className="text-3xl mb-4">{benefit.icon}</div>
                  <h4 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{benefit.title}</h4>
                  <p className="text-sm text-gray-400">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
