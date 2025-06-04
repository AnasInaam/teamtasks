import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Paperclip,
  MoreHorizontal,
  ChevronLeft,
  Kanban,
} from 'lucide-react';
import TaskCard from '../components/ui/TaskCard';
import { TaskPriority, TaskStatus } from '../types/task';

// Mock project data
const mockProject = {
  id: '1',
  name: 'Website Redesign',
  description: 'Complete overhaul of the company website with a modern design and improved user experience.',
  teamName: 'Design Team',
  progress: 75,
  startDate: '2025-05-01',
  dueDate: '2025-06-15',
  taskCount: 12,
  completedTasks: 9,
  teamMembers: [
    { id: '1', name: 'John Doe', role: 'Project Lead', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    { id: '2', name: 'Jane Smith', role: 'Designer', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    { id: '4', name: 'Sarah Wilson', role: 'Developer', avatar: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
  ],
};

// Mock tasks
const mockTasks = [
  {
    id: '1',
    title: 'Design homepage mockup',
    description: 'Create high-fidelity mockup for the new homepage design',
    status: 'done' as TaskStatus,
    priority: 'high' as TaskPriority,
    dueDate: '2025-05-10',
    assignees: [
      { id: '2', name: 'Jane Smith', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
    commentCount: 3,
    attachmentCount: 2,
  },
  {
    id: '2',
    title: 'Implement responsive layout',
    description: 'Develop responsive layout for all screen sizes',
    status: 'in-progress' as TaskStatus,
    priority: 'medium' as TaskPriority,
    dueDate: '2025-05-20',
    assignees: [
      { id: '4', name: 'Sarah Wilson', avatar: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
    commentCount: 2,
    attachmentCount: 0,
  },
  {
    id: '3',
    title: 'Content migration',
    description: 'Migrate existing content to new design structure',
    status: 'todo' as TaskStatus,
    priority: 'low' as TaskPriority,
    dueDate: '2025-06-01',
    assignees: [
      { id: '1', name: 'John Doe', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
    commentCount: 1,
    attachmentCount: 1,
  },
];

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'timeline' | 'files'>('overview');
  
  // In a real app, we would fetch the project data based on the ID
  const project = mockProject;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            to="/projects"
            className="mr-4 p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {project.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {project.teamName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link
            to={`/kanban/${project.id}`}
            className="btn btn-secondary"
          >
            <Kanban size={18} className="mr-1.5" />
            Kanban Board
          </Link>
          <button className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
      
      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card flex items-center">
          <div className="mr-4 bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full">
            <Clock size={20} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Date</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Date(project.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="mr-4 bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
            <Users size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Members</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {project.teamMembers.length}
            </p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="mr-4 bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
            <MessageSquare size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasks</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {project.completedTasks} / {project.taskCount}
            </p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="mr-4 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
            <Paperclip size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {project.progress}%
            </p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tasks'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'timeline'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'files'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Files
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Description
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {project.description}
                </p>
              </div>
              
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Tasks
                </h2>
                <div className="space-y-3">
                  {mockTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'tasks' && (
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  All Tasks
                </h2>
                <button className="btn btn-primary">
                  Add Task
                </button>
              </div>
              <div className="space-y-3">
                {mockTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'timeline' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Project Timeline
              </h2>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Start Date
                  </p>
                  <p className="text-base text-gray-900 dark:text-white">
                    {new Date(project.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="h-1 flex-1 mx-4 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className="h-1 bg-primary-500 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Due Date
                  </p>
                  <p className="text-base text-gray-900 dark:text-white">
                    {new Date(project.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'files' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Project Files
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                No files uploaded yet.
              </p>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Members */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Team Members
            </h2>
            <div className="space-y-4">
              {project.teamMembers.map((member) => (
                <div key={member.id} className="flex items-center">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Project Progress */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Progress
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Overall Progress
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-primary-500"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tasks Completed
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {project.completedTasks}/{project.taskCount}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `${(project.completedTasks / project.taskCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;