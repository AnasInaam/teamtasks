// TODO: This Sidebar currently uses mock data for teams and projects.
// - Replace all mockTeams and mockProjects with real data from Supabase.
// - Implement data fetching using hooks and display loading/error states.
// - Add backend-connected actions for adding teams/projects, etc.
// - Remove this comment after full backend integration.

import React, { useState, useRef } from 'react';
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
import { useTeams } from '../../hooks/useTeams';
import { useProjects } from '../../hooks/useProjects';

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
  team_id: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { logout, user } = useAuth();
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});

  // Fetch all teams (no pagination/search for sidebar)
  const { teams, isLoading: teamsLoading, error: teamsError } = useTeams({ page: 1, pageSize: 100 });
  // Fetch all projects (no pagination/search for sidebar)
  const { projects, isLoading: projectsLoading, error: projectsError } = useProjects({ page: 1, pageSize: 100 });

  const toggleTeam = (teamId: string) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  // Filter projects by team
  const getTeamProjects = (teamId: string) => {
    return (projects || []).filter((project) => project.team_id === teamId);
  };

  // Only after all hooks, do early returns
  if (teamsLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary-500 mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  if (teamsError || projectsError) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <Users size={48} className="text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Error loading sidebar data</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {teamsError instanceof Error ? teamsError.message : 'An unexpected error occurred'}
        </p>
      </div>
    );
  }

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
              {(teams || []).map((team) => (
                <li key={team.id} className="px-1">
                  <div className="flex items-center justify-between px-2 py-1.5 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                    <NavLink
                      to={`/teams/${team.id}`}
                      className={({ isActive }) =>
                        `flex-1 min-w-0 truncate ${isActive ? 'text-primary-700 dark:text-primary-400 font-semibold' : ''}`
                      }
                    >
                      {team.name}
                    </NavLink>
                    <button
                      type="button"
                      className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleTeam(team.id); }}
                      tabIndex={-1}
                    >
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${expandedTeams[team.id] ? 'transform rotate-180' : ''}`}
                      />
                    </button>
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
                        <Link
                          to={`/projects/new?teamId=${team.id}`}
                          className="flex items-center px-2 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                          <Plus size={14} className="mr-1" />
                          Add Project
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              ))}
              <li>
                <Link
                  to="/teams/new"
                  className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Plus size={18} className="mr-2" />
                  New Team
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      
      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <ProfileDropdown user={user} logout={logout} />
      </div>
    </div>
  );
};

// ProfileDropdown subcomponent for accessibility and focus management
interface ProfileDropdownProps {
  user: any;
  logout: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, logout }) => {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const firstItemRef = React.useRef<HTMLAnchorElement>(null);
  const lastItemRef = React.useRef<HTMLButtonElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuId = 'profile-menu';

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Focus management and keyboard navigation
  React.useEffect(() => {
    if (!open) return;
    // Focus first item on open
    firstItemRef.current?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      } else if (event.key === 'Tab') {
        // Trap focus within menu
        if (document.activeElement === lastItemRef.current && !event.shiftKey) {
          event.preventDefault();
          firstItemRef.current?.focus();
        } else if (document.activeElement === firstItemRef.current && event.shiftKey) {
          event.preventDefault();
          lastItemRef.current?.focus();
        }
      } else if (event.key === 'ArrowDown') {
        if (document.activeElement === firstItemRef.current) {
          lastItemRef.current?.focus();
          event.preventDefault();
        }
      } else if (event.key === 'ArrowUp') {
        if (document.activeElement === lastItemRef.current) {
          firstItemRef.current?.focus();
          event.preventDefault();
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        className="flex items-center space-x-3 w-full focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label="Open profile menu"
        id="profile-menu-button"
        type="button"
      >
        <img
          src={user?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'}
          alt={user?.name ? `${user.name}'s avatar` : 'User avatar'}
          className="h-9 w-9 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
        </div>
        <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50"
          role="menu"
          aria-label="Profile menu"
          aria-labelledby="profile-menu-button"
          id={menuId}
        >
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
            role="menuitem"
            tabIndex={0}
            ref={firstItemRef}
          >
            Profile
          </Link>
          <button
            onClick={() => { setOpen(false); logout(); }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            role="menuitem"
            tabIndex={0}
            ref={lastItemRef}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;