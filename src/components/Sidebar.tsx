import React from 'react';
import { 
  LayoutDashboard, 
  Table as TableIcon, 
  Kanban, 
  PieChart, 
  TrendingUp, 
  User, 
  Settings,
  Plus,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';

export type ViewType = 'dashboard' | 'applications' | 'analytics' | 'learning' | 'profile' | 'settings';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  onNewApp: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onNewApp }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'applications', icon: TableIcon, label: 'Applications' },
    { id: 'analytics', icon: PieChart, label: 'Analytics' },
    { id: 'learning', icon: TrendingUp, label: 'Learning Path' },
    { id: 'profile', icon: User, label: 'User Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-[240px] h-full border-r border-brand-border bg-brand-sidebar flex flex-col p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center text-white font-bold italic">
          C
        </div>
        <h1 className="text-lg font-bold text-brand-text tracking-tight">CareerJump</h1>
        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">v2.0</span>
      </div>

      <button
        onClick={onNewApp}
        className="flex items-center justify-center gap-2 w-full py-2 bg-brand-accent hover:opacity-90 text-white rounded-lg transition-all shadow-sm text-xs font-semibold mb-8"
      >
        <Plus className="w-4 h-4" />
        <span>+ New Application</span>
      </button>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as ViewType)}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-200 group text-sm",
              activeView === item.id 
                ? "bg-brand-nav-active font-semibold text-brand-text" 
                : "text-brand-text/70 hover:bg-[#E3E3E1]"
            )}
          >
            <item.icon className={cn(
              "w-4 h-4",
              activeView === item.id ? "text-brand-text" : "text-brand-muted opacity-70 group-hover:opacity-100"
            )} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="pt-4 border-t border-slate-100">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all text-sm font-medium">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
