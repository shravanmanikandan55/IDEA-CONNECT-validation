
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ReferenceLine
} from 'recharts';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: any;
}

type ChartType = 'line' | 'bar' | 'pie';

const locationData = {
  "United States": ["California", "New York", "Texas", "Florida"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  "Canada": ["Ontario", "Quebec", "British Columbia", "Alberta"],
  "Australia": ["New South Wales", "Victoria", "Queensland", "Western Australia"],
  "India": ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu"]
};

const StatisticsModal: React.FC<StatisticsModalProps> = ({ isOpen, onClose, idea }) => {
  const { t } = useTranslation();
  const [chartType, setChartType] = useState<ChartType>('line');
  const [confidence, setConfidence] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [lineData, setLineData] = useState<any[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isOpen || !idea || !isSupabaseConfigured()) return;

      // Skip fetching for mock ideas
      if (typeof idea.id === 'number' || (typeof idea.id === 'string' && !idea.id.includes('-'))) {
        setConfidence(idea.score || 0);
        setChartData([
          { day: 'Mon', votes: Math.floor(idea.votes * 0.4) },
          { day: 'Tue', votes: Math.floor(idea.votes * 0.5) },
          { day: 'Wed', votes: Math.floor(idea.votes * 0.65) },
          { day: 'Thu', votes: Math.floor(idea.votes * 0.75) },
          { day: 'Fri', votes: Math.floor(idea.votes * 0.85) },
          { day: 'Sat', votes: Math.floor(idea.votes * 0.95) },
          { day: 'Sun', votes: idea.votes },
        ]);
        
        const mockLineData = [{ voteNumber: 0, confidence: 0, yesVotes: 0, maybeVotes: 0, noVotes: 0 }];
        for (let i = 1; i <= idea.votes; i++) {
          const progress = i / idea.votes;
          const conf = Math.round((idea.score || 0) * Math.pow(progress, 0.7));
          mockLineData.push({
            voteNumber: i,
            confidence: conf,
            yesVotes: Math.floor(i * 0.8),
            maybeVotes: Math.floor(i * 0.1),
            noVotes: Math.floor(i * 0.1)
          });
        }
        setLineData(mockLineData);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('idea_votes')
          .select('yes_vote, no_vote, maybe_vote, updated_at')
          .eq('idea_id', idea.id);

        if (error) throw error;

        if (data) {
          let yesCount = 0;
          let noCount = 0;
          let maybeCount = 0;
          data.forEach(vote => {
            if (vote.yes_vote) yesCount++;
            if (vote.no_vote) noCount++;
            if (vote.maybe_vote) maybeCount++;
          });

          const netVotes = yesCount - noCount;
          setConfidence(Math.round(Math.sign(netVotes) * Math.min(100, Math.sqrt(Math.abs(netVotes)) * 10)));

          // Calculate chart data based on vote types instead of dates
          const newChartData = [
            { name: 'Yes', value: yesCount, fill: '#10b981' },
            { name: 'Maybe', value: maybeCount, fill: '#eab308' },
            { name: 'No', value: noCount, fill: '#ef4444' }
          ];

          setChartData(newChartData);

          // Calculate line data based on vote sequence
          const sortedData = [...data].sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
          let currentYes = 0;
          let currentNo = 0;
          let currentMaybe = 0;
          const newLineData = [{ voteNumber: 0, confidence: 0, yesVotes: 0, maybeVotes: 0, noVotes: 0 }];
          sortedData.forEach((vote, index) => {
            if (vote.yes_vote) currentYes++;
            if (vote.no_vote) currentNo++;
            if (vote.maybe_vote) currentMaybe++;
            const net = currentYes - currentNo;
            const conf = Math.round(Math.sign(net) * Math.min(100, Math.sqrt(Math.abs(net)) * 10));
            newLineData.push({
              voteNumber: index + 1,
              confidence: Math.max(0, conf),
              yesVotes: currentYes,
              maybeVotes: currentMaybe,
              noVotes: currentNo
            });
          });
          setLineData(newLineData);
        }
      } catch (err) {
        console.error('Error fetching votes for stats:', err);
        setConfidence(idea.score || 0);
        setChartData([
          { name: 'Yes', value: Math.floor(idea.votes * 0.8), fill: '#10b981' },
          { name: 'Maybe', value: Math.floor(idea.votes * 0.1), fill: '#eab308' },
          { name: 'No', value: Math.floor(idea.votes * 0.1), fill: '#ef4444' }
        ]);
        setLineData([
          { voteNumber: 0, confidence: 0, yesVotes: 0, maybeVotes: 0, noVotes: 0 }
        ]);
      }
    };

    fetchStats();
  }, [isOpen, idea]);

  if (!isOpen || !idea) return null;

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="voteNumber" 
              type="number"
              domain={[0, 'dataMax']}
              stroke="#475569" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              domain={[0, 100]}
              stroke="#475569" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dx={-10}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid #1e293b',
                borderRadius: '12px',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#fff' }}
              labelFormatter={(value) => `Votes: ${value}`}
            />
            <Line type="monotone" dataKey="confidence" name="Confidence (%)" stroke="#00BA9D" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="yesVotes" name="Yes Votes" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="maybeVotes" name="Maybe Votes" stroke="#eab308" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="noVotes" name="No Votes" stroke="#ef4444" strokeWidth={2} dot={false} />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={chartData} barGap={0}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dx={-10}
            />
            <Tooltip 
              cursor={{ fill: '#1e293b', opacity: 0.4 }}
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid #1e293b',
                borderRadius: '12px',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar 
              dataKey="value" 
              name="Votes"
              radius={[4, 4, 0, 0]} 
              barSize={30}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid #1e293b',
                borderRadius: '12px',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      
      <div className="relative bg-[#080D1D] border border-gray-800 w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gray-800/50 flex justify-between items-center bg-[#0f172a]/30">
          <div>
            <h2 className="text-2xl font-bold text-white">{t('Growth Statistics')}</h2>
            <p className="text-gray-500 text-sm">{t('Tracking engagement for')} <span className="text-indigo-400 font-medium">{idea.title}</span></p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white hover:bg-gray-800/50 rounded-full transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="bg-[#1e293b]/20 border border-gray-800/50 p-4 rounded-2xl">
              <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">{t('Total Votes')}</p>
              <p className="text-2xl font-bold text-white">{idea.votes}</p>
            </div>
            <div className="bg-[#1e293b]/20 border border-gray-800/50 p-4 rounded-2xl">
              <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">{t('Confidence')}</p>
              <p className={`text-2xl font-bold ${confidence < 0 ? 'text-red-500' : 'text-[#00BA9D]'}`}>{confidence}%</p>
              <p className="text-gray-500 text-[10px] font-bold mt-1">High potential</p>
            </div>
          </div>

          <div className="flex flex-col h-80 w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center">
                  <span className="w-8 h-px bg-gray-800 mr-3" />
                  {t('Vote Distribution')}
                </h4>
                
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <button 
                      onClick={() => setShowFilter(!showFilter)}
                      className="flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#1e293b]/50 border border-gray-800 text-gray-300 hover:text-white transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      Filter
                    </button>
                    
                    {showFilter && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-[#0f172a] border border-gray-800 rounded-xl shadow-2xl z-50 py-2">
                        {!selectedCountry ? (
                          <>
                            <div className="px-4 py-1 text-[10px] font-bold text-gray-500 uppercase">Select Country</div>
                            {Object.keys(locationData).map(country => (
                              <button 
                                key={country}
                                onClick={() => setSelectedCountry(country)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                              >
                                {country}
                              </button>
                            ))}
                          </>
                        ) : (
                          <>
                            <div className="px-4 py-1 flex items-center justify-between">
                              <span className="text-[10px] font-bold text-gray-500 uppercase">Select State (Optional)</span>
                              <button onClick={() => setSelectedCountry(null)} className="text-gray-400 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                              </button>
                            </div>
                            <button 
                              onClick={() => { setSelectedState(null); setShowFilter(false); }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors italic"
                            >
                              All States
                            </button>
                            {locationData[selectedCountry as keyof typeof locationData].map(state => (
                              <button 
                                key={state}
                                onClick={() => { setSelectedState(state); setShowFilter(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                              >
                                {state}
                              </button>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {selectedCountry && (
                    <div className="flex items-center bg-indigo-600/20 border border-indigo-500/30 rounded-lg px-2 py-1">
                      <span className="text-[10px] font-bold text-indigo-300 uppercase mr-2">
                        {selectedCountry}{selectedState ? `, ${selectedState}` : ''}
                      </span>
                      <button 
                        onClick={() => { setSelectedCountry(null); setSelectedState(null); }}
                        className="text-indigo-400 hover:text-indigo-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex bg-[#1e293b]/50 p-1 rounded-xl border border-gray-800">
                <button 
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${chartType === 'line' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Line
                </button>
                <button 
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${chartType === 'bar' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Bar
                </button>
                <button 
                  onClick={() => setChartType('pie')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${chartType === 'pie' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Pie
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 sm:p-8 bg-[#0f172a]/50 border-t border-gray-800/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white font-bold transition-all"
          >
            {t('Close Insights')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatisticsModal;
