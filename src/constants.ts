import { Application, UserProfile, Status, JobLocation } from './types';
import { v4 as uuidv4 } from 'uuid';
import { subDays, format } from 'date-fns';

const COMPANIES = [
  'TechFlow', 'CloudScale', 'InnovateAI', 'GreenByte', 'DataSphere', 
  'NexGen Solutions', 'Apex Systems', 'Lumina Tech', 'Quantum Labs', 
  'Vanguard Digital', 'Starlight Media', 'Echo Software', 'Titan Robotics'
];

const TITLES = [
  'Senior Frontend Engineer', 'Product Manager', 'Data Scientist', 
  'UX/UI Designer', 'Full Stack Developer', 'Cloud Architect', 
  'DevOps Engineer', 'Machine Learning Engineer', 'Marketing Strategist'
];

const LOCATIONS = ['San Francisco', 'New York', 'Remote', 'London', 'Berlin', 'Austin', 'Singapore'];

const STATUSES: Status[] = ['applied', 'screening', 'interview', 'offer', 'rejected'];

export const INITIAL_USER: UserProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  title: 'Full Stack Engineer',
  bio: 'Passionate builder with 5+ years of experience in React, Node.js, and TypeScript. Looking for scale-up opportunities.',
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Tailwind CSS', 'Next.js'],
  preferences: {
    location: 'San Francisco/Remote',
    jobType: ['remote', 'hybrid', 'onsite'],
    salaryRange: '$140k - $180k'
  }
};

const generateRandomApplications = (count: number): Application[] => {
  return Array.from({ length: count }).map((_, i) => {
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const appliedDate = subDays(new Date(), Math.floor(Math.random() * 60)).toISOString();
    const requirements = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL', 'System Design'];
    const matchScore = 60 + Math.floor(Math.random() * 40);
    const deadline = Math.random() > 0.5 ? subDays(new Date(), -Math.floor(Math.random() * 14)).toISOString() : undefined;
    
    // Calculate priority: Score + Urgency
    let urgencyBonus = 0;
    if (deadline) {
       const daysLeft = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
       urgencyBonus = Math.max(0, 30 - daysLeft * 2);
    }
    
    return {
      id: uuidv4(),
      company: COMPANIES[Math.floor(Math.random() * COMPANIES.length)],
      title: TITLES[Math.floor(Math.random() * TITLES.length)],
      description: 'Exciting role in a fast-paced environment...',
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
      jobLocation: ['remote', 'hybrid', 'onsite'][Math.floor(Math.random() * 3)] as JobLocation,
      status: status,
      priority: Math.min(100, matchScore + urgencyBonus),
      matchScore: matchScore,
      appliedDate: appliedDate,
      lastUpdated: subDays(new Date(), Math.floor(Math.random() * 5)).toISOString(),
      deadline: deadline,
      requirements: requirements.slice(0, 3 + Math.floor(Math.random() * 4)),
      missingSkills: ['Kubernetes', 'Redis'].slice(0, Math.floor(Math.random() * 2)),
      notes: 'Initial outreach via LinkedIn.',
      salary: '$150k',
    };
  });
};

export const DEMO_APPLICATIONS = generateRandomApplications(45);

export const ANALYTICS_DATA = Array.from({ length: 30 }).map((_, i) => {
  const date = subDays(new Date(), 29 - i);
  return {
    date: format(date, 'MMM dd'),
    applications: Math.floor(Math.random() * 5),
    interviews: Math.floor(Math.random() * 2),
    offers: Math.random() > 0.95 ? 1 : 0,
    rejections: Math.floor(Math.random() * 2),
  };
});
