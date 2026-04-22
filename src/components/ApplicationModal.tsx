import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Globe, 
  MapPin, 
  Calendar as CalendarIcon,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../AppContext';
import { Status, JobLocation, Application } from '../types';
import { geminiService } from '../services/geminiService';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ApplicationModalProps {
  onClose: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ onClose }) => {
  const { addApplication, user } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Application>>({
    company: '',
    title: '',
    status: 'applied',
    jobLocation: 'remote',
    location: '',
    appliedDate: new Date().toISOString(),
    requirements: [],
    notes: ''
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const parsed = await geminiService.parseJobDescription(base64);
      
      // Calculate match score
      const { score, missing } = await geminiService.calculateMatch(parsed, user);

      setFormData(prev => ({
        ...prev,
        ...parsed,
        jdImage: base64,
        matchScore: score,
        missingSkills: missing,
        priority: score, // Initial priority
      }));
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.title) return;
    
    addApplication({
      ...formData as Application,
      appliedDate: formData.appliedDate || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      priority: formData.priority || 50,
      matchScore: formData.matchScore || 50,
      missingSkills: formData.missingSkills || [],
      requirements: formData.requirements || [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 px-16">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="relative bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-brand-border"
      >
        <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-brand-text tracking-tight">New Application</h2>
            <p className="text-brand-muted text-[10px] font-medium uppercase tracking-widest mt-0.5">Automated AI Entry</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-brand-bg rounded-lg transition-all text-brand-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-brand-bg grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "group relative h-40 border border-brand-border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all",
                loading ? "bg-brand-sidebar border-brand-muted" : "bg-white hover:border-brand-muted hover:bg-gray-50"
              )}
            >
              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-brand-accent border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-bold text-brand-text">AI Parsing...</span>
                </div>
              ) : formData.jdImage ? (
                <div className="absolute inset-0 p-3">
                   <div className="w-full h-full relative rounded-lg overflow-hidden border border-brand-border">
                     <img src={formData.jdImage} className="w-full h-full object-cover opacity-40 grayscale" />
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5">
                        <Sparkles className="w-6 h-6 text-brand-text mb-2" />
                        <span className="text-[10px] font-bold text-brand-text bg-white px-2 py-0.5 rounded shadow-sm border border-brand-border">Parsed by CareerJump AI</span>
                     </div>
                   </div>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 bg-brand-bg rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-brand-border">
                    <Upload className="w-4 h-4 text-brand-muted" />
                  </div>
                  <span className="text-xs font-bold text-brand-text">Upload JD Screenshot</span>
                  <span className="text-[9px] font-bold text-brand-muted mt-1 uppercase tracking-widest">PNG, JPG preferred</span>
                </>
              )}
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-brand-muted uppercase tracking-widest px-1">Company</label>
                  <input 
                    type="text" 
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="e.g. Stripe"
                    className="w-full px-4 py-2 bg-white border border-brand-border rounded-lg text-xs font-bold focus:outline-none focus:border-brand-muted transition-all" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-brand-muted uppercase tracking-widest px-1">Role Title</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Staff Engineer"
                    className="w-full px-4 py-2 bg-white border border-brand-border rounded-lg text-xs font-bold focus:outline-none focus:border-brand-muted transition-all" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                    <label className="text-[9px] font-bold text-brand-muted uppercase tracking-widest px-1">Work Type</label>
                    <select 
                      value={formData.jobLocation}
                      onChange={(e) => setFormData({...formData, jobLocation: e.target.value as JobLocation})}
                      className="w-full px-4 py-2 bg-white border border-brand-border rounded-lg text-xs font-bold focus:outline-none transition-all appearance-none"
                    >
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="onsite">On-site</option>
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-bold text-brand-muted uppercase tracking-widest px-1">City</label>
                    <input 
                       type="text" 
                       value={formData.location}
                       onChange={(e) => setFormData({...formData, location: e.target.value})}
                       placeholder="Location"
                       className="w-full px-4 py-2 bg-white border border-brand-border rounded-lg text-xs font-bold focus:outline-none focus:border-brand-muted transition-all" 
                    />
                 </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 flex flex-col h-full">
            <div className="bg-white p-5 rounded-xl border border-brand-border shadow-sm flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="font-bold text-brand-text text-[11px] flex items-center gap-2 uppercase tracking-widest">
                   <Sparkles className="w-3.5 h-3.5 text-brand-text" />
                   Priority Score
                 </h3>
                 {formData.matchScore && (
                   <div className="text-[10px] font-bold text-brand-text bg-brand-sidebar px-2 py-0.5 rounded border border-brand-border">
                     {formData.matchScore} / 100
                   </div>
                 )}
              </div>
              
              <div className="space-y-4 flex-1 overflow-auto scrollbar-hide">
                 {formData.requirements && formData.requirements.length > 0 ? (
                   <div className="space-y-3">
                      <div className="text-[9px] font-bold text-brand-muted uppercase tracking-widest">Skills Extracted</div>
                      <div className="flex flex-wrap gap-1.5">
                         {formData.requirements.map((req, i) => (
                           <span key={i} className="px-2 py-1 bg-brand-bg rounded text-[10px] font-bold text-brand-text border border-brand-border">
                             {req}
                           </span>
                         ))}
                      </div>
                      
                      {formData.missingSkills && formData.missingSkills.length > 0 && (
                        <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                           <div className="flex items-center gap-2 mb-2">
                             <Info className="w-3 h-3 text-orange-600" />
                             <span className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">Gap Detected</span>
                           </div>
                           <div className="flex flex-wrap gap-1">
                             {formData.missingSkills.map((sk, i) => (
                               <span key={i} className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-[9px] font-bold">
                                 {sk}
                               </span>
                             ))}
                           </div>
                        </div>
                      )}
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-30">
                      <FileText className="w-8 h-8 mb-2 text-brand-muted" />
                      <p className="text-[10px] font-bold text-brand-muted italic uppercase tracking-tighter">Awaiting JD Analysis</p>
                   </div>
                 )}
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              className="w-full py-2 bg-brand-accent text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-90 transition-all border border-brand-accent"
            >
              Confirm & Create
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ApplicationModal;
