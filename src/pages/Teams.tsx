import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, SortAsc, Grid, List, Users } from 'lucide-react';

// Mock data
const mockTeams = [
  {
    id: '1',
    name: 'Design Team',
    description: 'Responsible for product design, user experience, and brand identity.',
    memberCount: 8,
    projectCount: 5,
    leader: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2',
      role: 'Design Director',
    },
    members: [
      { id: '1', name: 'John Doe', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2', role: 'Design Director' },
      { id: '2', name: 'Jane Smith', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2', role: 'Senior Designer' },
      { id: '4', name: 'Sarah Wilson', avatar: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2', role: 'UI Designer' },
    ],
    recentProjects: [
      { id: '1', name: 'Website Redesign' },
      { id: '5', name: 'Customer Research' },
    ],
  },
  {
    id: '2',
    name: 'Engineering',
    description: 'Core development team responsible for building and maintaining our products.',
    memberCount: 12,
    projectCount: 8,
    leader: {
      id: '3',
      name: 'Mike Johnson',
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2',
      role: 'Tech Lead',
    },
    members: [
      { id: '3', name: 'Mike Johnson', avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2', role: 'Tech Lead' },
      { id: '5', name: 'Alex Brown', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2', role: 'Senior Developer' },
      { id: '7', name: 'Chris Lee', avatar: 'https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2', role: 'Backend Developer' },
    ],
    recentProjects: [
      { id: '2', name: 'Mobile App' },
      { id: '4', name: 'API Development' },
      { id: '6', name: 'Database Migration' },
    ],
  },
  {
    id: '3',
    name: 'Marketing',
    description: 'Handles product marketing, communications, and growth initiatives.',
    memberCount: 6,
    projectCount: 4,
    leader: {
      id: '8',
      name: 'Jessica Taylor',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2',
      role: 'Marketing Director',
    },
    members: [
      { id: '8', name: 'Jessica Taylor', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2', role: 'Marketing Director' },
      { id: '4', name: 'Sarah Wilson', avatar: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2', role: 'Content Strategist' },
      { id: '6', name: 'Emma Davis', avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2', role: 'Social Media Manager' },
    ],
    recentProjects: [
      { id: '3', name: 'Product Launch' },
    ],
  },
];

// View modes
type ViewMode = 'grid' | 'list';

const Teams: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Filter teams based on search term
  const filteredTeams = mockTeams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    team.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Teams
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and collaborate with your teams
          </p>
        </div>
        
        <Link 
          to="/teams/new"
          className="btn btn-primary inline-flex whitespace-nowrap"
        >
          <Plus size={18} className="mr-1" />
          New Team
        </Link>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="search"
            className="input py-2 pl-10"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <button className="btn btn-secondary">
            <Filter size={18} className="mr-1.5" />
            Filter
          </button>
          <button className="btn btn-secondary">
            <SortAsc size={18} className="mr-1.5" />
            Sort
          </button>
          
          {/* View Toggle */}
          <div className="flex rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden">
            <button
              className={`p-2 ${
                viewMode === 'grid' 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              className={`p-2 ${
                viewMode === 'list' 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Teams Grid/List */}
      {filteredTeams.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredTeams.map((team) => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              className="card hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {team.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Led by {team.leader.name}
                  </p>
                </div>
                <div className="bg-primary-100 dark:bg-primary-900/30 px-3 py-1 rounded-full text-xs font-medium text-primary-800 dark:text-primary-300">
                  {team.memberCount} members
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {team.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex -space-x-2">
                  {team.members.map((member) => (
                    <img
                      key={member.id}
                      src={member.avatar}
                      alt={member.name}
                      title={`${member.name} - ${member.role}`}
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                    />
                  ))}
                  {team.memberCount > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 border-2 border-white dark:border-gray-800">
                      +{team.memberCount - 3}
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {team.projectCount} projects
                </div>
              </div>
              
              {team.recentProjects.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Recent Projects
                  </h4>
                  <div className="space-y-1">
                    {team.recentProjects.map((project) => (
                      <div
                        key={project.id}
                        className="text-sm text-gray-600 dark:text-gray-300"
                      >
                        {project.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <Users size={48} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No teams found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            We couldn't find any teams matching your search.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="btn btn-secondary"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Teams;