import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  ChevronLeft,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  MessageSquare,
  FileText,
} from 'lucide-react';

// Mock team data
const mockTeam = {
  id: '1',
  name: 'Design Team',
  description: 'Responsible for product design, user experience, and brand identity.',
  leader: {
    id: '1',
    name: 'John Doe',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2',
    role: 'Design Director',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinedDate: '2023-01-15',
  },
  members: [
    {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2',
      role: 'Senior Designer',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 234-5678',
      location: 'New York, NY',
      joinedDate: '2023-03-01',
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      avatar: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2',
      role: 'UI Designer',
      email: 'sarah.wilson@example.com',
      phone: '+1 (555) 345-6789',
      location: 'Los Angeles, CA',
      joinedDate: '2023-05-15',
    },
  ],
  projects: [
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website',
      progress: 75,
      dueDate: '2025-06-15',
    },
    {
      id: '5',
      name: 'Customer Research',
      description: 'User interviews and feedback analysis',
      progress: 85,
      dueDate: '2025-05-31',
    },
  ],
  recentActivity: [
    {
      id: '1',
      user: {
        id: '1',
        name: 'John Doe',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2',
      },
      action: 'completed',
      target: 'Homepage Wireframes',
      project: 'Website Redesign',
      timestamp: '2h ago',
    },
    {
      id: '2',
      user: {
        id: '2',
        name: 'Jane Smith',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2',
      },
      action: 'commented on',
      target: 'User Flow Diagrams',
      project: 'Customer Research',
      timestamp: '4h ago',
    },
    {
      id: '3',
      user: {
        id: '4',
        name: 'Sarah Wilson',
        avatar: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2',
      },
      action: 'created',
      target: 'Design System Documentation',
      project: 'Website Redesign',
      timestamp: '1d ago',
    },
  ],
};

const TeamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'files'>('overview');
  
  // In a real app, we would fetch the team data based on the ID
  const team = mockTeam;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            to="/teams"
            className="mr-4 p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {team.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {team.description}
            </p>
          </div>
        </div>
        
        <button className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700">
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card flex items-center">
          <div className="mr-4 bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full">
            <Users size={20} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Members</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {team.members.length + 1} {/* +1 for leader */}
            </p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="mr-4 bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
            <Briefcase size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {team.projects.length}
            </p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="mr-4 bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
            <MessageSquare size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Activity</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {team.recentActivity.length}
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
            onClick={() => setActiveTab('projects')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'projects'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Projects
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
      
      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Team Leader */}
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Team Leader
                </h2>
                <div className="flex items-start">
                  <img
                    src={team.leader.avatar}
                    alt={team.leader.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {team.leader.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {team.leader.role}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Mail size={16} className="mr-2" />
                        {team.leader.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Phone size={16} className="mr-2" />
                        {team.leader.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <MapPin size={16} className="mr-2" />
                        {team.leader.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Calendar size={16} className="mr-2" />
                        Joined {new Date(team.leader.joinedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {team.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <img
                        src={activity.user.avatar}
                        alt={activity.user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          <span className="font-medium">{activity.user.name}</span>{' '}
                          <span className="text-gray-600 dark:text-gray-400">{activity.action}</span>{' '}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.project} • {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'projects' && (
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Team Projects
                </h2>
                <button className="btn btn-primary">
                  Add Project
                </button>
              </div>
              <div className="space-y-4">
                {team.projects.map((project) => (
                  <div key={project.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {project.description}
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
                        <Calendar size={14} className="mr-1" />
                        Due {new Date(project.dueDate).toLocaleDateString()}
                      </span>
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'files' && (
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Team Files
                </h2>
                <button className="btn btn-primary">
                  Upload Files
                </button>
              </div>
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No files have been uploaded yet
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Members */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Team Members
              </h2>
              <button className="btn btn-secondary">
                Add Member
              </button>
            </div>
            <div className="space-y-4">
              {team.members.map((member) => (
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
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;