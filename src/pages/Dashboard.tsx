// TODO: This Dashboard page currently lacks real data integration.
// - Replace all mockStats, mockProjects, mockTasks, recentActivities, and upcomingEvents with real data from Supabase.
// - Implement data fetching using hooks and display loading/error states.
// - Add backend-connected actions for adding projects/tasks.
// - Remove this comment after full backend integration.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Users,
  Briefcase,
  CalendarDays,
  PlusCircle,
  ArrowRightCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/ui/TaskCard';
import { TaskPriority, TaskStatus } from '../types/task';

// TODO: Connect to backend for stats, projects, tasks, activities, and events
// const mockStats = [...];
// const mockProjects = [...];
// const mockTasks = [...];
// const recentActivities = [...];
// const upcomingEvents = [...];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });

  // TODO: Replace with real event formatting if needed
  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // TODO: Render real stats, projects, tasks, activities, and events from backend
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {greeting}, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's an overview of your team's progress
        </p>
      </div>
      {/* TODO: Add backend-connected stats, projects, tasks, activities, and events here */}
    </div>
  );
};

export default Dashboard;