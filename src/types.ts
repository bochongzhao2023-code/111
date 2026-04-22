export type Status = 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'draft';

export type JobLocation = 'remote' | 'hybrid' | 'onsite';

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface Application {
  id: string;
  company: string;
  title: string;
  description: string;
  location: string;
  jobLocation: JobLocation;
  status: Status;
  priority: number; // 0-100
  matchScore: number; // 0-100
  appliedDate: string;
  lastUpdated: string;
  deadline?: string;
  requirements: string[];
  missingSkills: string[];
  notes: string;
  salary?: string;
  jdImage?: string; // base64
}

export interface UserProfile {
  name: string;
  email: string;
  title: string;
  bio: string;
  skills: string[];
  preferences: {
    location: string;
    jobType: JobLocation[];
    salaryRange: string;
  };
}

export interface Settings {
  notifications: boolean;
  aiInsights: boolean;
  theme: 'light' | 'dark';
}

export interface MetricData {
  date: string;
  applications: number;
  interviews: number;
  offers: number;
  rejections: number;
}
