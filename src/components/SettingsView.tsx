import React from 'react';
import { 
  Bell, 
  ShieldCheck, 
  Eye, 
  Moon, 
  Sun, 
  MessageSquare, 
  Database,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { useApp } from '../AppContext';
import { cn } from '../lib/utils';

const SettingsView: React.FC = () => {
  const { settings, setSettings } = useApp();

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      title: 'AI Connectivity',
      icon: Cpu,
      items: [
        { id: 'aiInsights', label: 'Enable AI Insights', description: 'Deep analysis of metrics and trend diagnoses.', active: settings.aiInsights },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { id: 'notifications', label: 'Deadline Alerts', description: 'Get notified 48 hours before an application deadline.', active: settings.notifications },
      ]
    },
    {
      title: 'App Preferences',
      icon: Eye,
      items: [
        { id: 'publicProfile', label: 'Public Profile Visibility', description: 'Allow recruiters to find your profile summary.', active: false },
      ]
    }
  ];

  return (
    <div className="flex-1 overflow-auto bg-brand-bg p-8">
      <div className="max-w-3xl mx-auto space-y-12">
        <div>
          <h2 className="text-xl font-bold text-brand-text tracking-tight">Settings</h2>
          <p className="text-gray-500 text-xs font-medium">Customize your CareerJump experience</p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
               <div className="flex items-center gap-2 px-2 text-gray-400">
                  <section.icon className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{section.title}</span>
               </div>
               
               <div className="bg-white border border-brand-border rounded-xl shadow-sm divide-y divide-[#F1F1EF] overflow-hidden">
                  {section.items.map((item) => (
                    <div key={item.id} className="p-5 flex items-center justify-between hover:bg-brand-bg transition-colors">
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-brand-text">{item.label}</label>
                          <p className="text-[11px] text-gray-500 font-medium">{item.description}</p>
                       </div>
                       <button 
                         onClick={() => item.id in settings && toggleSetting(item.id as keyof typeof settings)}
                         className={cn(
                           "relative w-9 h-5 rounded-full transition-all duration-300 focus:outline-none",
                           item.active ? "bg-[#448361]" : "bg-brand-border"
                         )}
                       >
                          <div className={cn(
                            "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm",
                            item.active ? "translate-x-4" : "translate-x-0"
                          )} />
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-red-50 border border-red-100 rounded-xl space-y-4">
           <h3 className="text-[10px] font-bold text-red-900 uppercase tracking-widest">Danger Zone</h3>
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <p className="text-xs font-bold text-red-800">Wipe All App Data</p>
                 <p className="text-[10px] text-red-600/70 font-medium font-medium">This action is irreversible. All applications will be deleted.</p>
              </div>
              <button className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm">
                Reset App
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
