import React from 'react';
import { 
  User, 
  Mail, 
  Briefcase, 
  Award, 
  MapPin, 
  Link as LinkIcon, 
  Github, 
  Linkedin,
  Plus,
  Pencil,
  FileText,
  Target
} from 'lucide-react';
import { useApp } from '../AppContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const ProfileView: React.FC = () => {
  const { user } = useApp();

  return (
    <div className="flex-1 overflow-auto bg-brand-bg p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-brand-border shadow-sm overflow-hidden">
          <div className="h-24 bg-brand-sidebar border-b border-brand-border" />
          <div className="px-8 pb-8">
            <div className="flex justify-between items-end -mt-10 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-xl p-1 shadow-md border border-brand-border">
                  <div className="w-full h-full bg-orange-100 rounded-lg overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-brand-accent text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-90 transition-all flex items-center gap-2">
                <Pencil className="w-3 h-3" />
                Edit Profile
              </button>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-brand-text tracking-tight">{user.name}</h2>
              <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  {user.title} • Pro Plan
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  SF / Remote
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
               <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"><Github className="w-4 h-4 text-slate-600" /></button>
               <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"><Linkedin className="w-4 h-4 text-slate-600" /></button>
               <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"><LinkIcon className="w-4 h-4 text-slate-600" /></button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
             <div className="flex items-center justify-between">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <Award className="w-4 h-4 text-indigo-500" />
                 Skill Profile
               </h3>
               <button className="text-xs font-bold text-indigo-600 hover:underline">Manage</button>
             </div>
             <div className="flex flex-wrap gap-2">
               {user.skills.map((skill) => (
                 <span key={skill} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-100">
                   {skill}
                 </span>
               ))}
               <button className="px-3 py-1.5 border border-dashed border-slate-300 text-slate-400 rounded-xl text-xs font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all">
                 + Add Skill
               </button>
             </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
             <div className="flex items-center justify-between">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <Target className="w-4 h-4 text-emerald-500" />
                 Job Preferences
               </h3>
               <button className="text-xs font-bold text-indigo-600 hover:underline">Edit</button>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Job Types</span>
                   <span className="text-sm font-semibold text-slate-800 capitalize">{user.preferences.jobType.join(', ')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Expected Salary</span>
                   <span className="text-sm font-semibold text-slate-800">{user.preferences.salaryRange}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Preferred Locations</span>
                   <span className="text-sm font-semibold text-slate-800">{user.preferences.location}</span>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                Resume Summary
              </h3>
           </div>
           <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
             {user.bio}
           </p>
        </div>

      </div>
    </div>
  );
};

export default ProfileView;
