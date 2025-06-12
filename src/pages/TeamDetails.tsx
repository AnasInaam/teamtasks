// TODO: This TeamDetails page currently lacks real data integration.
// - Replace all mockTeam and related mock data with real data from Supabase.
// - Implement data fetching using hooks and display loading/error states.
// - Add backend-connected actions for editing team, adding/removing members, etc.
// - Remove this comment after full backend integration.

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  ChevronLeft
} from 'lucide-react';
import { useTeams } from '../hooks/useTeams';
import { useProjects } from '../hooks/useProjects';

const TeamDetails: React.FC = () => {
  const { id: teamId } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'files'>('overview');

  // Fetch team details
  const { teams, isLoading: teamLoading, error: teamError } = useTeams({ page: 1, pageSize: 1 });
  const team = teams?.find(t => t.id === teamId);

  // Fetch projects for this team
  const { projects, isLoading: projectsLoading, error: projectsError } = useProjects({ page: 1, pageSize: 100, teamId });

  if (teamLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary-500 mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  if (teamError || projectsError) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <Users size={48} className="text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Error loading team details</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {teamError instanceof Error ? teamError.message : projectsError instanceof Error ? projectsError.message : 'An unexpected error occurred'}
        </p>
      </div>
    );
  }
  if (!team) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Team not found</h3>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/teams" className="mr-4 p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">{team.name}</h1>
      </div>
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400 mb-2">{team.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center"><Users size={16} className="mr-1" />{team.members?.length || 0} members</span>
        </div>
      </div>
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 flex gap-6">
        <button className={`pb-2 border-b-2 ${activeTab === 'overview' ? 'border-primary-500 text-primary-700 dark:text-primary-300' : 'border-transparent text-gray-500 dark:text-gray-400'}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`pb-2 border-b-2 ${activeTab === 'projects' ? 'border-primary-500 text-primary-700 dark:text-primary-300' : 'border-transparent text-gray-500 dark:text-gray-400'}`} onClick={() => setActiveTab('projects')}>Projects</button>
        <button className={`pb-2 border-b-2 ${activeTab === 'files' ? 'border-primary-500 text-primary-700 dark:text-primary-300' : 'border-transparent text-gray-500 dark:text-gray-400'}`} onClick={() => setActiveTab('files')}>Files</button>
      </div>
      {activeTab === 'overview' && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Team Members</h2>
          <div className="flex flex-wrap gap-4">
            {team.members && team.members.length > 0 ? (
              team.members.map(member => (
                <div key={member.user.id} className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <img
                    src={member.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user.name)}&background=random`}
                    alt={member.user.name}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">{member.user.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{member.user.role || 'Member'}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 dark:text-gray-400">No members found.</div>
            )}
          </div>
        </div>
      )}
      {activeTab === 'projects' && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Projects</h2>
          {projects && projects.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {projects.map(project => (
                <div key={project.id} className="card p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{project.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">{project.description}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Progress: {project.progress || 0}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">No projects found for this team.</div>
          )}
        </div>
      )}
      {/* Files tab can be implemented with real data */}
    </div>
  );
};

export default TeamDetails;