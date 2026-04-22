import React, { useState } from 'react';
import { AppProvider } from './AppContext';
import Sidebar, { ViewType } from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ApplicationView from './components/ApplicationView';
import AnalyticsView from './components/AnalyticsView';
import LearningPathView from './components/LearningPathView';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import ApplicationModal from './components/ApplicationModal';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [showModal, setShowModal] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView onNewApp={() => setShowModal(true)} setView={setActiveView} />;
      case 'applications':
        return <ApplicationView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'learning':
        return <LearningPathView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onNewApp={() => setShowModal(true)} setView={setActiveView} />;
    }
  };

  return (
    <AppProvider>
      <div className="flex h-screen w-full bg-white font-sans text-slate-900 overflow-hidden">
        <Sidebar 
          activeView={activeView} 
          setActiveView={setActiveView} 
          onNewApp={() => setShowModal(true)}
        />
        
        <main className="flex-1 flex flex-col min-w-0 bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="flex-1 h-full min-h-0"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {showModal && (
            <ApplicationModal onClose={() => setShowModal(false)} />
          )}
        </AnimatePresence>
      </div>
    </AppProvider>
  );
}
