import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  ExternalLink,
  MapPin,
  Calendar,
  Building2,
  Trash2
} from 'lucide-react';
import { useApp } from '../AppContext';
import { Application, Status, JobLocation } from '../types';
import { cn, formatDate } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const ApplicationView: React.FC = () => {
  const { applications, deleteApplication } = useApp();
  const [viewMode, setViewMode] = useState<'table' | 'board'>('table');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = applications.filter(app => 
    app.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors: Record<Status, string> = {
    applied: 'bg-blue-100 text-blue-700',
    screening: 'bg-yellow-100 text-yellow-700',
    interview: 'bg-purple-100 text-purple-700',
    offer: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    draft: 'bg-slate-100 text-slate-700',
  };

  const locationIcons: Record<JobLocation, string> = {
    remote: '🌐',
    hybrid: '🏢',
    onsite: '🏠',
  };

  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col bg-brand-bg">
      <div className="px-8 py-6 border-b border-brand-border bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-brand-text tracking-tight">Applications</h2>
            <p className="text-gray-500 text-xs font-medium">Viewing {applications.length} opportunities</p>
          </div>
          <div className="flex items-center gap-1 bg-brand-bg p-1 rounded-lg border border-brand-border">
            <button 
              onClick={() => setViewMode('table')}
              className={cn(
                "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                viewMode === 'table' ? "bg-white shadow-sm text-brand-text" : "text-gray-400 hover:text-brand-text"
              )}
            >
              Table
            </button>
            <button 
              onClick={() => setViewMode('board')}
              className={cn(
                "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                viewMode === 'board' ? "bg-white shadow-sm text-brand-text" : "text-gray-400 hover:text-brand-text"
              )}
            >
              Board
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input 
              type="text" 
              placeholder="Search companies, roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-brand-bg border border-brand-border rounded-lg text-xs font-medium focus:outline-none focus:border-brand-muted transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-border rounded-lg text-xs font-bold text-brand-text hover:bg-gray-50 shadow-sm transition-all">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <AnimatePresence mode="wait">
          {viewMode === 'table' ? (
            <motion.div 
              key="table"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-brand-border rounded-xl shadow-sm overflow-hidden"
            >
              <table className="w-full text-left">
                <thead className="bg-[#F7F7F5] border-b border-brand-border text-[10px] uppercase text-gray-400 font-bold">
                  <tr>
                    <th className="px-6 py-3">Company & Role</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Score</th>
                    <th className="px-6 py-3">Applied</th>
                    <th className="px-6 py-3">Location</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-sidebar text-[11px] font-medium text-brand-text">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-brand-bg transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-brand-bg border border-brand-border rounded-lg flex items-center justify-center text-xs font-bold text-brand-muted">
                            {app.company[0]}
                          </div>
                          <div>
                            <div className="font-bold">{app.company}</div>
                            <div className="text-[10px] text-gray-400">{app.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight",
                          statusColors[app.status] || 'bg-gray-100 text-gray-600'
                        )}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                          app.matchScore > 80 ? 'bg-[#E9F3EB] text-[#2D5D39]' : 'bg-[#FBEDDC] text-[#854C0E]'
                        )}>
                          {app.matchScore}% Match
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(app.appliedDate)}</td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <span>{locationIcons[app.jobLocation]}</span>
                        <span>{app.location}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteApplication(app.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div 
              key="board"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex gap-6 h-full min-w-max pb-4"
            >
              {(['applied', 'screening', 'interview', 'offer'] as Status[]).map((status) => (
                <div key={status} className="w-80 flex flex-col gap-4">
                  <div className="flex items-center justify-between px-2 bg-[#F1F1EF] py-2 rounded-lg border border-brand-border">
                    <div className="flex items-center gap-2">
                       <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{status}</h3>
                       <span className="text-[10px] font-bold text-gray-400 bg-white px-1.5 py-0.25 rounded border border-brand-border">
                         {filteredApps.filter(a => a.status === status).length}
                       </span>
                    </div>
                    <Plus className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    {filteredApps.filter(a => a.status === status).map((app) => (
                      <motion.div 
                        layoutId={app.id}
                        key={app.id}
                        className="bg-white p-4 rounded-xl border border-brand-border shadow-sm hover:border-gray-300 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-brand-bg rounded-md flex items-center justify-center text-[10px] font-black text-brand-muted border border-brand-border">
                              {app.company[0]}
                            </div>
                            <span className="text-[11px] font-bold text-brand-text group-hover:text-black transition-colors">{app.company}</span>
                          </div>
                          <span className="text-[9px] font-bold text-gray-400 border border-brand-border px-1.5 rounded uppercase">
                            {app.matchScore}%
                          </span>
                        </div>
                        <h4 className="text-[12px] font-bold text-brand-text mb-4 leading-snug">{app.title}</h4>
                        <div className="flex items-center justify-between border-t border-brand-bg pt-3">
                           <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                             <CalendarIcon className="w-3 h-3" />
                             {formatDate(app.appliedDate)}
                           </div>
                           <div className="text-[10px] font-bold text-gray-500">
                             {locationIcons[app.jobLocation]} {app.location}
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ApplicationView;
