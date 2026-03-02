
import React from 'react';

interface SuccessStoriesProps {
  onBack: () => void;
  isDark: boolean;
}

const SUCCESS_STORIES = [
  {
    id: 1,
    title: "From Concept to $1M Seed Round",
    founder: "Alex Rivera",
    company: "EcoPack Solutions",
    story: "I posted a rough idea for reusable delivery packaging on IdeaConnect. Within two weeks, I had 500+ waitlist signups and three angel investors reaching out. The data from IdeaConnect was crucial for our pitch deck.",
    image: "https://picsum.photos/seed/founder1/800/600",
    tags: ["Sustainability", "Seed Funded"]
  },
  {
    id: 2,
    title: "Validating the Unthinkable",
    founder: "Sarah Jenkins",
    company: "PetPulse AI",
    story: "Everyone told me an AI that translates dog barks was a joke. IdeaConnect showed me there was a massive market of pet owners willing to pay. We validated our MVP in 30 days and now have 10k active users.",
    image: "https://picsum.photos/seed/founder2/800/600",
    tags: ["AI/ML", "Consumer App"]
  },
  {
    id: 3,
    title: "Pivoting with Precision",
    founder: "David Kovic",
    company: "StreamLine Ed",
    story: "Our original idea was failing. We used IdeaConnect to test three different pivots simultaneously. The 'Decentralized Study Groups' idea exploded. We saved 6 months of wasted development time.",
    image: "https://picsum.photos/seed/founder3/800/600",
    tags: ["EdTech", "Pivot Success"]
  }
];

const SuccessStories: React.FC<SuccessStoriesProps> = ({ onBack, isDark }) => {
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

        <div className="text-center mb-20">
          <h1 className={`text-5xl font-extrabold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Built on <span className="text-indigo-500">Validation</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-400">
            Discover how founders are using IdeaConnect to turn raw concepts into thriving businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {SUCCESS_STORIES.map((story) => (
            <div key={story.id} className={`group rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-2xl ${isDark ? 'bg-[#111827] border-gray-800 hover:border-indigo-500/50' : 'bg-white border-gray-100 hover:border-indigo-200'}`}>
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={story.image} 
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {story.tags.map(tag => (
                    <span key={tag} className="bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-8">
                <h3 className={`text-2xl font-bold mb-4 group-hover:text-indigo-500 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {story.title}
                </h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed italic">
                  "{story.story}"
                </p>
                <div className="flex items-center pt-6 border-t border-gray-800/50">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 font-bold mr-3">
                    {story.founder[0]}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{story.founder}</p>
                    <p className="text-xs text-gray-500">Founder, {story.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-24 p-12 rounded-[3rem] text-center relative overflow-hidden ${isDark ? 'bg-indigo-600/10 border border-indigo-500/20' : 'bg-indigo-50 border border-indigo-100'}`}>
          <div className="relative z-10">
            <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Ready to be our next success story?</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">Join 5,000+ founders who are validating their way to a successful launch.</p>
            <button 
              onClick={onBack}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-indigo-500/20 transition-all transform active:scale-95"
            >
              Start Your Journey
            </button>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -ml-32 -mb-32 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;
