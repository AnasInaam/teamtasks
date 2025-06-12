// TODO: This Sidebar currently uses mock data for teams and projects.
// - Replace all mockTeams and mockProjects with real data from Supabase.
// - Implement data fetching using hooks and display loading/error states.
// - Add backend-connected actions for adding teams/projects, etc.
// - Remove this comment after full backend integration.

import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ListTodo,
  Calendar,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Sidebar Props
interface SidebarProps {
  onClose: () => void;
}

// Team type
interface Team {
  id: string;
  name: string;
}

// Project type
interface Project {
  id: string;
  name: string;
  teamId: string;
}

// TODO: Connect to backend for teams and projects data
// const mockTeams: Team[] = [...];
// const mockProjects: Project[] = [...];

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { logout, user } = useAuth();
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({
    '1': true, // First team expanded by default
  });

  const toggleTeam = (teamId: string) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  // Filter projects by team
  const getTeamProjects = (teamId: string) => {
    return mockProjects.filter((project) => project.teamId === teamId);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary-600 dark:text-primary-500"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <polyline points="16 11 18 13 22 9"></polyline>
          </svg>
          <span className="font-bold text-gray-900 dark:text-white">TeamTasks</span>
        </Link>
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-6">
          {/* Main Navigation */}
          <div>
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => 
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-400' 
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <LayoutDashboard size={18} className="mr-2" />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/projects"
                  className={({ isActive }) => 
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-400' 
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <Briefcase size={18} className="mr-2" />
                  Projects
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/teams"
                  className={({ isActive }) => 
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-400' 
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <Users size={18} className="mr-2" />
                  Teams
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tasks"
                  className={({ isActive }) => 
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-400' 
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <ListTodo size={18} className="mr-2" />
                  My Tasks
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/calendar"
                  className={({ isActive }) => 
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-400' 
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <Calendar size={18} className="mr-2" />
                  Calendar
                </NavLink>
              </li>
            </ul>
          </div>
          
          {/* Teams and Projects */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Teams
              </h3>
              <button className="p-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700">
                <Plus size={14} />
              </button>
            </div>
            
            <ul className="space-y-1">
              {mockTeams.map((team) => (
                <li key={team.id} className="px-1">
                  <div
                    className="flex items-center justify-between px-2 py-1.5 text-sm font-medium text-gray-700 rounded-md cursor-pointer hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={() => toggleTeam(team.id)}
                  >
                    <span>{team.name}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        expandedTeams[team.id] ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                  
                  {expandedTeams[team.id] && (
                    <ul className="mt-1 pl-5 space-y-1">
                      {getTeamProjects(team.id).map((project) => (
                        <li key={project.id}>
                          <NavLink
                            to={`/projects/${project.id}`}
                            className={({ isActive }) => 
                              `flex items-center px-2 py-1.5 rounded-md text-sm transition-colors ${
                                isActive 
                                  ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-400' 
                                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                              }`
                            }
                          >
                            {project.name}
                          </NavLink>
                        </li>
                      ))}
                      <li>
                        <button className="flex items-center px-2 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                          <Plus size={14} className="mr-1" />
                          Add Project
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              ))}
              <li>
                <button className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Plus size={18} className="mr-2" />
                  New Team
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      
      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <img
            src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'}
            alt={user?.name || 'User avatar'}
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {/* Navigate to settings */}}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={logout}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;