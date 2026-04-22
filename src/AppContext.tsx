import React, { createContext, useContext, useState, useEffect } from 'react';
import { Application, UserProfile, Settings } from './types';
import { DEMO_APPLICATIONS, INITIAL_USER } from './constants';

interface AppContextType {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  addApplication: (app: Omit<Application, 'id'>) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>(DEMO_APPLICATIONS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    aiInsights: true,
    theme: 'light',
  });

  const addApplication = (app: Omit<Application, 'id'>) => {
    const newApp: Application = {
      ...app,
      id: Math.random().toString(36).substring(7),
    };
    setApplications((prev) => [newApp, ...prev]);
  };

  const updateApplication = (id: string, updates: Partial<Application>) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updates, lastUpdated: new Date().toISOString() } : app))
    );
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        applications,
        setApplications,
        user,
        setUser,
        settings,
        setSettings,
        addApplication,
        updateApplication,
        deleteApplication,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
