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

// Mock Data
const mockStats = [
  { id: '1', label: 'Total Tasks', value: 48, icon: <BarChart3 size={18} className="text-primary-500" /> },
  { id: '2', label: 'Completed', value: 32, icon: <CheckCircle2 size={18} className="text-green-500" /> },
  { id: '3', label: 'In Progress', value: 12, icon: <Clock size={18} className="text-amber-500" /> },
  { id: '4', label: 'Team Members', value: 8, icon: <Users size={18} className="text-blue-500" /> },
];

const mockProjects = [
  { id: '1', name: 'Website Redesign', progress: 75, taskCount: 12, dueDate: '2025-06-15', teamName: 'Design Team' },
  { id: '2', name: 'Mobile App', progress: 40, taskCount: 24, dueDate: '2025-07-30', teamName: 'Engineering' },
  { id: '3', name: 'Product Launch', progress: 25, taskCount: 18, dueDate: '2025-08-10', teamName: 'Marketing' },
];

const mockTasks = [
  {
    id: '1',
    title: 'Finalize homepage design',
    description: 'Review and approve the final homepage design with stakeholders',
    status: 'in-progress' as TaskStatus,
    priority: 'high' as TaskPriority,
    dueDate: '2025-05-25',
    assignees: [
      { id: '1', name: 'John Doe', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '2', name: 'Jane Smith', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
    commentCount: 5,
    attachmentCount: 2,
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Set up JWT authentication and role-based access control',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    dueDate: '2025-05-28',
    assignees: [
      { id: '3', name: 'Mike Johnson', avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
    commentCount: 2,
    attachmentCount: 0,
  },
  {
    id: '3',
    title: 'Create marketing materials',
    description: 'Prepare email templates, social media posts, and landing page copy',
    status: 'review' as TaskStatus,
    priority: 'low' as TaskPriority,
    dueDate: '2025-05-30',
    assignees: [
      { id: '4', name: 'Sarah Wilson', avatar: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '5', name: 'Alex Brown', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
    commentCount: 8,
    attachmentCount: 3,
  },
];

const recentActivities = [
  {
    id: '1',
    user: { id: '1', name: 'John Doe', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    action: 'completed',
    task: 'Create wireframes for homepage',
    project: 'Website Redesign',
    timestamp: '2h ago',
  },
  {
    id: '2',
    user: { id: '2', name: 'Jane Smith', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    action: 'commented on',
    task: 'API integration for user profiles',
    project: 'Mobile App',
    timestamp: '4h ago',
  },
  {
    id: '3',
    user: { id: '3', name: 'Mike Johnson', avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    action: 'created',
    task: 'Social media campaign proposal',
    project: 'Product Launch',
    timestamp: '1d ago',
  },
  {
    id: '4',
    user: { id: '4', name: 'Sarah Wilson', avatar: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    action: 'assigned',
    task: 'User testing coordination',
    project: 'Mobile App',
    timestamp: '1d ago',
  },
];

const upcomingEvents = [
  {
    id: '1',
    title: 'Weekly Project Review',
    date: '2025-05-26T10:00:00',
    duration: 60, // minutes
    attendees: [
      { id: '1', name: 'John Doe', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '2', name: 'Jane Smith', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '3', name: 'Mike Johnson', avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
  },
  {
    id: '2',
    title: 'Design Team Sync',
    date: '2025-05-27T14:30:00',
    duration: 45, // minutes
    attendees: [
      { id: '1', name: 'John Doe', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '4', name: 'Sarah Wilson', avatar: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
  },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });

  // Format date for events
  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for events
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

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
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat) => (
          <div key={stat.id} className="card flex items-center">
            <div className="mr-4 bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Projects & Tasks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects */}
        <div className="lg:col-span-2 card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Briefcase size={18} className="mr-2" />
              Active Projects
            </h2>
            <Link
              to="/projects"
              className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View all
              <ArrowRightCircle size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {mockProjects.map((project) => (
              <div key={project.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {project.teamName} • {project.taskCount} tasks
                    </p>
                  </div>
                  <div className="bg-primary-100 dark:bg-primary-900/30 px-2 py-1 rounded-full text-xs font-medium text-primary-800 dark:text-primary-300">
                    {project.progress}%
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        project.progress >= 75
                          ? 'bg-green-500'
                          : project.progress >= 40
                          ? 'bg-amber-500'
                          : 'bg-primary-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock size={14} className="mr-1" />
                    Due {new Date(project.dueDate).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
            
            <Link
              to="/projects/new"
              className="flex items-center justify-center py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-primary-600 hover:border-primary-500 dark:hover:text-primary-400 dark:hover:border-primary-500 transition-colors"
            >
              <PlusCircle size={18} className="mr-2" />
              Add New Project
            </Link>
          </div>
        </div>
        
        {/* My Tasks */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <CheckCircle2 size={18} className="mr-2" />
              My Tasks
            </h2>
            <Link
              to="/tasks"
              className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View all
              <ArrowRightCircle size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {mockTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            
            <Link
              to="/tasks/new"
              className="flex items-center justify-center py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-primary-600 hover:border-primary-500 dark:hover:text-primary-400 dark:hover:border-primary-500 transition-colors"
            >
              <PlusCircle size={18} className="mr-2" />
              Add New Task
            </Link>
          </div>
        </div>
      </div>
      
      {/* Activity & Calendar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 py-2">
                <img
                  src={activity.user.avatar}
                  alt={activity.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.user.name}</span>{' '}
                    <span className="text-gray-600 dark:text-gray-400">{activity.action}</span>{' '}
                    <span className="font-medium">{activity.task}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.project} • {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Calendar */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <CalendarDays size={18} className="mr-2" />
              Upcoming Events
            </h2>
            <Link
              to="/calendar"
              className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View calendar
            </Link>
          </div>
          
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatEventDate(event.date)} • {formatEventTime(event.date)} ({event.duration} min)
                    </p>
                  </div>
                </div>
                
                <div className="mt-2 flex -space-x-2">
                  {event.attendees.map((attendee) => (
                    <img
                      key={attendee.id}
                      src={attendee.avatar}
                      alt={attendee.name}
                      title={attendee.name}
                      className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;