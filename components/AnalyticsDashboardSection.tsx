
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { X, TrendingUp, BarChart3, PieChart as PieChartIcon, Info } from 'lucide-react';

const lineData = [
  { votes: 0, confidence: 0 },
  { votes: 5, confidence: 2 },
  { votes: 12, confidence: 5 },
  { votes: 25, confidence: 10 },
  { votes: 40, confidence: 15 },
  { votes: 60, confidence: 20 },
  { votes: 85, confidence: 25 },
  { votes: 110, confidence: 30 },
  { votes: 135, confidence: 35 },
  { votes: 160, confidence: 40 },
  { votes: 185, confidence: 45 },
  { votes: 210, confidence: 50 },
  { votes: 235, confidence: 55 },
  { votes: 260, confidence: 60 },
  { votes: 285, confidence: 65 },
  { votes: 310, confidence: 70 },
  { votes: 335, confidence: 75 },
  { votes: 360, confidence: 80 },
  { votes: 385, confidence: 85 },
  { votes: 410, confidence: 90 },
  { votes: 435, confidence: 95 },
  { votes: 460, confidence: 100 },
];

const barData = [
  { name: 'Yes', value: 68, color: '#00BA9D' },
  { name: 'Maybe', value: 22, color: '#F59E0B' },
  { name: 'No', value: 10, color: '#EF4444' },
];

const pieData = [
  { name: 'Yes', value: 68 },
  { name: 'Maybe', value: 22 },
  { name: 'No', value: 10 },
];

const COLORS = ['#00BA9D', '#F59E0B', '#EF4444'];

const AnalyticsDashboardSection: React.FC = () => {
  const [chartType, setChartType] = useState<'LINE' | 'BAR' | 'PIE'>('LINE');

  return (
    <section className="bg-white dark:bg-[#020617] py-20 lg:py-32 transition-colors duration-300 overflow-hidden relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-6 uppercase tracking-widest">
                <TrendingUp className="w-3 h-3 mr-2" />
                Data-Driven Insights
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                Growth Statistics That <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-400">Drive Decisions</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 leading-relaxed">
                Stop guessing and start growing. Our advanced analytics engine processes every vote, comment, and interaction to give you a clear picture of your idea's potential.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: 'Validation Score', desc: 'Real-time score based on purchase intent and market fit.' },
                  { title: 'Confidence Index', desc: 'AI-powered metric indicating the reliability of your data.' },
                  { title: 'Vote Distribution', desc: 'Detailed breakdown of how users feel about your concept.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Dashboard Mockup */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Main Dashboard Container */}
              <div className="bg-[#0A1025] rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden p-8 md:p-10">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Growth Statistics</h3>
                    <p className="text-gray-400 text-sm flex items-center">
                      Tracking engagement for <span className="text-indigo-400 ml-1 font-medium">No-Code AR Menu for Restaurants</span>
                    </p>
                  </div>
                  <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Confidence</p>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-[#00BA9D]">91%</span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Total Votes</p>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-white">310</span>
                    </div>
                  </div>
                </div>

                {/* Chart Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-[1px] bg-white/20" />
                      <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Vote Distribution</span>
                    </div>
                    
                    {/* Chart Toggle */}
                    <div className="bg-white/5 p-1 rounded-xl flex items-center">
                      {(['LINE', 'BAR', 'PIE'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setChartType(type)}
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 ${
                            chartType === type 
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                              : 'text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chart Display */}
                  <div className="h-[300px] w-full relative">
                    <AnimatePresence mode="wait">
                      {chartType === 'LINE' && (
                        <motion.div
                          key="line"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full h-full"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                              <XAxis 
                                dataKey="votes" 
                                type="number"
                                domain={[0, 'dataMax']}
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#4B5563', fontSize: 10 }} 
                                dy={10}
                              />
                              <YAxis 
                                domain={[0, 100]}
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#4B5563', fontSize: 10 }} 
                                tickFormatter={(value) => `${value}%`}
                              />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#121B35', border: 'none', borderRadius: '12px', color: '#fff' }}
                                itemStyle={{ color: '#00BA9D' }}
                                labelFormatter={(value) => `Votes: ${value}`}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="confidence" 
                                name="Confidence"
                                stroke="#00BA9D" 
                                strokeWidth={3} 
                                dot={false} 
                                animationDuration={1500}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </motion.div>
                      )}

                      {chartType === 'BAR' && (
                        <motion.div
                          key="bar"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full h-full"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                              <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#4B5563', fontSize: 12 }} 
                                dy={10}
                              />
                              <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#4B5563', fontSize: 12 }} 
                              />
                              <Tooltip 
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#121B35', border: 'none', borderRadius: '12px', color: '#fff' }}
                              />
                              <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={1000}>
                                {barData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </motion.div>
                      )}

                      {chartType === 'PIE' && (
                        <motion.div
                          key="pie"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full h-full"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={110}
                                paddingAngle={5}
                                dataKey="value"
                                animationDuration={1000}
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#121B35', border: 'none', borderRadius: '12px', color: '#fff' }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                              <p className="text-white text-3xl font-bold">68%</p>
                              <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Yes</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Footer Button */}
                <div className="flex justify-center">
                  <button className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-12 rounded-2xl transition-all duration-200 border border-white/5">
                    Close Insights
                  </button>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 bg-teal-500 text-white px-4 py-2 rounded-2xl font-bold shadow-xl shadow-teal-500/20 z-20 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                +12% Growth
              </div>

              {/* Decorative Glow */}
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] -z-10" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AnalyticsDashboardSection;
