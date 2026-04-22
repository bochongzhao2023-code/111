import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  Target, 
  Zap, 
  Users, 
  Award, 
  HelpCircle,
  Lightbulb,
  ArrowUpRight,
  TrendingUp,
  BrainCircuit,
  MessageCircle
} from 'lucide-react';
import { ANALYTICS_DATA } from '../constants';
import { cn } from '../lib/utils';
import { useApp } from '../AppContext';
import { geminiService } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

const AnalyticsView: React.FC = () => {
  const { applications } = useApp();
  const [insightLoading, setInsightLoading] = useState<string | null>(null);
  const [activeInsight, setActiveInsight] = useState<{title: string, text: string} | null>(null);

  const stats = [
    { label: 'Resume Pass Rate', value: '42%', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50', metric: 'pass_rate' },
    { label: 'Interview Rate', value: '18%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', metric: 'interview_rate' },
    { label: 'Success Rate', value: '8%', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50', metric: 'success_rate' },
    { label: 'Offer Rate', value: '3%', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', metric: 'offer_rate' },
  ];

  const handleFetchInsight = async (label: string) => {
    setInsightLoading(label);
    const text = await geminiService.getMetricInsights(label, { applications: applications.length });
    setActiveInsight({ title: label, text });
    setInsightLoading(null);
  };

  return (
    <div className="flex-1 overflow-auto bg-brand-bg p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-brand-text tracking-tight">Performance Analytics</h2>
            <p className="text-gray-500 text-xs font-medium">Real-time tracking of your job hunting funnel</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-brand-border shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-brand-muted" />
            <span className="text-[10px] font-bold text-brand-text">Last 30 Days</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <motion.div 
              whileHover={{ y: -2 }}
              key={stat.label} 
              className="bg-white p-5 rounded-xl border border-brand-border shadow-sm relative overflow-hidden group cursor-pointer"
              onClick={() => handleFetchInsight(stat.label)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg", "bg-brand-sidebar border border-brand-border")}>
                  <stat.icon className={cn("w-4 h-4", "text-brand-muted")} />
                </div>
                {insightLoading === stat.label ? (
                   <div className="animate-spin rounded-full h-3 w-3 border-2 border-brand-accent border-t-transparent" />
                ) : (
                  <BrainCircuit className="w-3.5 h-3.5 text-brand-muted opacity-40 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <div className="text-2xl font-bold text-brand-text mb-1 tracking-tight">{stat.value}</div>
              <div className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">{stat.label}</div>
              <div className="mt-3 flex items-center gap-1 text-[9px] text-green-600 font-bold">
                 <TrendingUp className="w-3 h-3" />
                 <span>+2.4% vs last mo</span>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {activeInsight && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-brand-accent text-white p-6 rounded-xl shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <BrainCircuit className="w-32 h-32" />
              </div>
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-orange-300" />
                  <h3 className="font-bold text-sm tracking-tight">AI Insights: {activeInsight.title}</h3>
                </div>
                <p className="text-gray-300 text-[11px] leading-relaxed font-medium">
                  {activeInsight.text}
                </p>
                <button 
                  onClick={() => setActiveInsight(null)}
                  className="w-fit px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded text-[10px] font-bold transition-all border border-white/10"
                >
                  Close Insight
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xs font-bold text-brand-text uppercase tracking-widest">Application Volume</h3>
               <div className="text-[9px] font-bold text-brand-text bg-brand-sidebar px-2 py-0.5 rounded border border-brand-border">30-Day Trend</div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ANALYTICS_DATA}>
                  <defs>
                    <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.05}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1EF" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9A9A97', fontSize: 9, fontWeight: 600 }}
                    interval={5}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E9E9E7', fontSize: '10px', boxShadow: 'none' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#000000" 
                    fillOpacity={1} 
                    fill="url(#colorApp)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xs font-bold text-brand-text uppercase tracking-widest">Conversion History</h3>
               <div className="flex gap-3">
                 <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-sm bg-brand-accent" />
                   <span className="text-[9px] font-bold text-brand-muted uppercase">Interviews</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-sm bg-[#448361]" />
                   <span className="text-[9px] font-bold text-brand-muted uppercase">Offers</span>
                 </div>
               </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ANALYTICS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1EF" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9A9A97', fontSize: 9, fontWeight: 600 }}
                    interval={5}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E9E9E7', fontSize: '10px', boxShadow: 'none' }}
                  />
                  <Bar dataKey="interviews" fill="#000000" radius={[2, 2, 0, 0]} barSize={8} />
                  <Bar dataKey="offers" fill="#448361" radius={[2, 2, 0, 0]} barSize={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
function Calendar(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}
