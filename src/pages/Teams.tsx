import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, SortAsc, Grid, List, Users, AlertCircle } from 'lucide-react';
import { useTeams } from '../hooks/useTeams';

const Teams: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const { teams, isLoading, error } = useTeams({
    page,
    pageSize,
    searchTerm: searchTerm.trim() || undefined
  });

  // Pagination controls
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => p + 1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary-500 mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <AlertCircle size={48} className="text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Error loading teams</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </p>
      </div>
    );
  }

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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to first page on search
            }}
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
      {teams && teams.length > 0 ? (
        <>
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {teams.map((team) => (
              <Link
                key={team.id || ''}
                to={`/teams/${team.id}`}
                className="card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {team.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {team.members?.[0]?.user?.name ? `Led by ${team.members[0].user.name}` : 'No leader assigned'}
                    </p>
                  </div>
                  <div className="bg-primary-100 dark:bg-primary-900/30 px-3 py-1 rounded-full text-xs font-medium text-primary-800 dark:text-primary-300">
                    {team.members?.length || 0} members
                  </div>
                </div>
                
                {team.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {team.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex -space-x-2">
                    {team.members?.slice(0, 3).map((member) => (
                      <img
                        key={member.user.id}
                        src={member.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user.name)}&background=random`}
                        alt={member.user.name}
                        title={`${member.user.name} - ${member.user.role || 'Member'}`}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                      />
                    ))}
                    {(team.members?.length || 0) > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 border-2 border-white dark:border-gray-800">
                        +{team.members!.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-8 gap-4">
            <button className="btn btn-secondary" onClick={handlePrev} disabled={page === 1}>Previous</button>
            <span className="self-center">Page {page}</span>
            <button className="btn btn-secondary" onClick={handleNext} disabled={!teams || teams.length < pageSize}>Next</button>
          </div>
        </>
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