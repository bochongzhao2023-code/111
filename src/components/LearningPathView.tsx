import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  ArrowRight,
  BrainCircuit,
  Zap,
  CheckCircle2,
  Trophy,
  History
} from 'lucide-react';
import { useApp } from '../AppContext';
import { geminiService } from '../services/geminiService';
import { cn } from '../lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { motion } from 'motion/react';

const LearningPathView: React.FC = () => {
  const { applications } = useApp();
  const [summary, setSummary] = useState('Generating your weekly performance summary...');
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const fetchSummary = async () => {
      const text = await geminiService.getWeeklySummary(applications);
      setSummary(text);
      setLoading(false);
    };
    fetchSummary();
  }, [applications]);

  const weeklyData = [
    { name: 'Mon', apps: 4, prep: 2 },
    { name: 'Tue', apps: 2, prep: 5 },
    { name: 'Wed', apps: 6, prep: 3 },
    { name: 'Thu', apps: 3, prep: 6 },
    { name: 'Fri', apps: 5, prep: 4 },
    { name: 'Sat', apps: 1, prep: 8 },
    { name: 'Sun', apps: 0, prep: 6 },
  ];

  const goals = [
    { label: 'Weekly Applications', current: 15, target: 20 },
    { label: 'Interview Prep (hrs)', current: 8, target: 12 },
    { label: 'Networking Reachouts', current: 4, target: 10 },
  ];

  return (
    <div className="flex-1 overflow-auto bg-brand-bg p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Weekly Summary & Strategies */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 text-brand-sidebar opacity-40">
               <BrainCircuit className="w-40 h-40" />
             </div>
             <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-brand-accent rounded-lg flex items-center justify-center">
                   <Zap className="w-5 h-5 text-white" />
                 </div>
                 <h2 className="text-xl font-bold text-brand-text tracking-tight">Weekly Performance Summary</h2>
               </div>
               
               <div className="prose prose-slate max-w-none text-brand-text leading-relaxed min-h-[100px] text-[11px] font-medium italic">
                 {loading ? (
                   <div className="space-y-3">
                     <div className="h-3 bg-brand-bg rounded w-full animate-pulse" />
                     <div className="h-3 bg-brand-bg rounded w-5/6 animate-pulse" />
                     <div className="h-3 bg-brand-bg rounded w-4/6 animate-pulse" />
                   </div>
                 ) : (
                   <p className="whitespace-pre-wrap">{summary}</p>
                 )}
               </div>

               <div className="mt-8 pt-8 border-t border-brand-sidebar grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex gap-3 p-4 rounded-xl bg-[#E9F3EB] border border-[#D1E5D7]">
                    <CheckCircle2 className="w-5 h-5 text-[#2D5D39] shrink-0" />
                    <div>
                      <h4 className="font-bold text-[#1B3B24] text-[10px] uppercase tracking-wider">Key Wins</h4>
                      <p className="text-[10px] text-[#2D5D39] mt-1 font-medium leading-relaxed">Application velocity increased by 20% this week. Resume pass rate is stabilizing.</p>
                    </div>
                 </div>
                 <div className="flex gap-3 p-4 rounded-xl bg-[#FBEDDC] border border-[#F3DBB9]">
                    <Target className="w-5 h-5 text-[#854C0E] shrink-0" />
                    <div>
                      <h4 className="font-bold text-[#543009] text-[10px] uppercase tracking-wider">Action Area</h4>
                      <p className="text-[10px] text-[#854C0E] mt-1 font-medium leading-relaxed">Focus on system design prep. Recent interview feedback suggests a gap in architecting scalable VPCs.</p>
                    </div>
                 </div>
               </div>
             </div>
           </div>

           <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-xs font-bold text-brand-text uppercase tracking-widest">Activity Trends</h3>
               <select 
                 value={timeRange}
                 onChange={(e) => setTimeRange(e.target.value)}
                 className="bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-[10px] font-bold text-brand-text focus:outline-none"
               >
                 <option value="3d">Last 3 Days</option>
                 <option value="7d">Last 7 Days</option>
                 <option value="30d">Last 30 Days</option>
               </select>
             </div>
             <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1EF" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9A9A97', fontSize: 9, fontWeight: 600 }} />
                    <Tooltip cursor={{ fill: '#F7F7F5' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E9E9E7', fontSize: '10px' }} />
                    <Bar dataKey="apps" name="Applications" fill="#000000" radius={[2, 2, 0, 0]} barSize={16} />
                    <Bar dataKey="prep" name="Prep Hours" fill="#448361" radius={[2, 2, 0, 0]} barSize={16} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>
        </div>

        {/* Right Column: Goals & Priorities */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-4 h-4 text-orange-400" />
                <hgroup>
                  <h3 className="font-bold text-[11px] text-brand-text uppercase tracking-widest">Growth Goals</h3>
                </hgroup>
              </div>
              <div className="space-y-6">
                 {goals.map((goal) => (
                   <div key={goal.label} className="space-y-2">
                     <div className="flex justify-between text-[10px] font-bold">
                       <span className="text-gray-400 uppercase tracking-tight">{goal.label}</span>
                       <span className="text-brand-text">{goal.current} / {goal.target}</span>
                     </div>
                     <div className="w-full h-1.5 bg-brand-sidebar rounded-full overflow-hidden border border-brand-border">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                         className="h-full bg-brand-accent rounded-full"
                       />
                     </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-2 bg-brand-accent text-white rounded-lg text-[10px] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm">
                Edit Goals
                <ArrowRight className="w-3 h-3" />
              </button>
           </div>

           <div className="bg-brand-accent p-6 rounded-xl shadow-lg text-white">
              <h3 className="font-bold text-xs uppercase tracking-widest mb-4 text-gray-400">Strategy</h3>
              <p className="text-gray-300 text-[11px] mb-6 leading-relaxed font-medium italic">
                "Based on your current skills and application data, you are 3.5x more likely to secure an interview for Full Stack roles."
              </p>
              <div className="space-y-3">
                 {['Tailor CV for Node.js depth', 'Post engineering blogs', 'Connect with 3 alumni'].map((act, i) => (
                   <div key={act} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 text-[10px] font-bold">
                     <div className="w-3 h-3 rounded-sm border border-white/40 flex-shrink-0" />
                     {act}
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default LearningPathView;
