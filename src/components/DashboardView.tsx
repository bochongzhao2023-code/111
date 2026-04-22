import React from 'react';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Calendar,
  ChevronRight,
  Plus,
  Upload
} from 'lucide-react';
import { useApp } from '../AppContext';
import { cn, formatDate } from '../lib/utils';
import { motion } from 'motion/react';

const DashboardView: React.FC<{ onNewApp: () => void, setView: (v: any) => void }> = ({ onNewApp, setView }) => {
  const { applications } = useApp();

  const counts = {
    total: applications.length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const recentApps = [...applications].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()).slice(0, 5);

  return (
    <div className="flex-1 overflow-auto bg-brand-bg p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-brand-text tracking-tight">Welcome back, Alex.</h2>
            <p className="text-gray-500 text-sm font-medium">You have 12 interviews scheduled this week.</p>
          </div>
          <div className="flex items-center gap-3">
             <button
               onClick={onNewApp}
               className="bg-white border border-brand-border text-xs font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-all"
             >
                <span>Upload JD Screenshot</span>
                <Upload className="w-3.5 h-3.5" />
             </button>
             <button 
               onClick={onNewApp}
               className="bg-brand-accent text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-sm hover:opacity-90 transition-all"
             >
                + New Application
             </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Resume Pass Rate', value: '42%', icon: Briefcase, color: 'text-green-600', bg: 'bg-green-500', trend: '+12%' },
            { label: 'Interview Rate', value: '18.5%', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-500', trend: 'Steady' },
            { label: 'Offer Rate', value: '3%', icon: CheckCircle2, color: 'text-red-500', bg: 'bg-red-500', trend: '-2%' },
            { label: 'AI Insight', value: 'Diagnosis', icon: TrendingUp, color: 'text-orange-700', bg: 'bg-orange-500', type: 'insight' },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-4 rounded-xl border border-brand-border transition-all",
                stat.type === 'insight' ? "bg-orange-50 border-orange-100" : "bg-white hover:border-blue-100 hover:bg-[#E1F0F750]"
              )}
            >
              <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">
                {stat.label}
              </div>
              {stat.type === 'insight' ? (
                <div className="text-[11px] leading-relaxed italic text-orange-900">
                  "Your 'System Design' skill is missing in 40% of targets. Consider taking the 'Scalability Foundations' course."
                </div>
              ) : (
                <>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-brand-text">{stat.value}</span>
                    <span className={cn("text-[10px] mb-1 font-bold", stat.color)}>{stat.trend}</span>
                  </div>
                  <div className="h-1 w-full bg-gray-200 rounded-full mt-3 overflow-hidden">
                    <div className={cn("h-full transition-all duration-1000", stat.bg)} style={{ width: stat.value }} />
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Recent Activity</h3>
              <button onClick={() => setView('applications')} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="bg-white border border-brand-border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
              <div className="p-4 border-b border-brand-border flex justify-between items-center bg-white">
                <h3 className="font-bold text-sm text-brand-text">Smart Priority Pipeline</h3>
                <span className="text-[10px] text-gray-400">Updated 2m ago</span>
              </div>
              <div className="overflow-auto scrollbar-hide">
                <table className="w-full text-left">
                  <thead className="bg-[#F7F7F5] border-b border-brand-border text-[10px] uppercase text-gray-500 font-bold">
                    <tr>
                      <th className="px-5 py-3">Company & Role</th>
                      <th className="px-5 py-3 text-center">Score</th>
                      <th className="px-5 py-3">JD Match</th>
                      <th className="px-5 py-3">Applied</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F1EF] text-[11px] font-medium">
                    {recentApps.map((app) => (
                      <tr key={app.id} className="hover:bg-brand-bg transition-colors">
                        <td className="px-5 py-4">
                           <div>
                              <div className="font-bold text-brand-text">{app.company}</div>
                              <div className="text-[10px] text-gray-400">{app.title}</div>
                           </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                           <span className={cn("font-bold", app.priority > 85 ? "text-red-500" : "text-brand-text")}>
                             {app.priority}
                           </span>
                        </td>
                        <td className="px-5 py-4">
                           <span className={cn(
                             "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight",
                             app.matchScore > 80 ? "bg-[#E9F3EB] text-[#2D5D39]" : "bg-[#FBEDDC] text-[#854C0E]"
                           )}>
                             {app.matchScore}% Match
                           </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500">{formatDate(app.appliedDate)}</td>
                        <td className="px-5 py-4">
                           <span className={cn(
                             "px-2 py-0.5 rounded border border-gray-200 font-bold text-[10px] uppercase",
                             app.status === 'offer' ? 'bg-green-50 text-green-700 border-green-100' : 
                             app.status === 'interview' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-50 text-gray-500'
                           )}>
                             {app.status}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions / Priority */}
          <div className="space-y-6">
             <div className="card bg-white border border-brand-border rounded-xl p-4 shadow-sm flex flex-col h-full min-h-[300px]">
                <h3 className="font-bold text-sm text-brand-text mb-4">Habit Tracker</h3>
                <div className="flex gap-2 mb-6">
                  <div className="flex-1">
                    <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Weekly Apps</div>
                    <div className="text-lg font-bold">24 / 30</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-[10px] text-green-600 font-bold">80% Target</div>
                    <div className="grid grid-cols-7 gap-1 mt-1">
                      {[1,2,3,4,5,0,0].map((v, i) => (
                        <div key={i} className={cn("w-2 h-2 rounded-[2px]", v ? "bg-[#448361]" : "bg-brand-border")} />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 flex-1">
                  <div className="p-3 bg-brand-bg rounded-lg border border-brand-border">
                    <div className="text-[11px] font-bold text-gray-700 mb-1">Strategy Suggestion</div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">Apply to at least 3 'Hybrid' roles this week. Your response rate is 2x higher for onsite roles.</p>
                  </div>
                  <div className="p-3 bg-brand-bg rounded-lg border border-brand-border">
                    <div className="text-[11px] font-bold text-gray-700 mb-1">Missing Skills</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                       {['Kubernetes', 'GraphQL'].map(sk => (
                         <span key={sk} className="text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold border border-red-100">{sk}</span>
                       ))}
                    </div>
                  </div>
                </div>
             </div>
             
             <div className="card bg-brand-accent text-white rounded-xl p-4 shadow-sm">
                <h3 className="text-xs font-bold mb-2">AI Resume Audit</h3>
                <p className="text-[10px] text-gray-400 mb-4 font-medium leading-relaxed">Scan your current resume against the latest job descriptions for premium matches.</p>
                <button className="w-full bg-white text-black font-bold py-2 rounded text-[10px] hover:opacity-90 transition-all">
                  START SCAN
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardView;
