import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, SortAsc, Grid, List, AlertCircle } from 'lucide-react';
import ProjectCard from '../components/ui/ProjectCard';
import { useProjects } from '../hooks/useProjects';

const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const { projects, isLoading, error, deleteProject } = useProjects({
    page,
    pageSize,
    searchTerm: searchTerm.trim() || undefined
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Pagination controls
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => p + 1);

  // Delete handler
  const handleDelete = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    setDeletingId(projectId);
    try {
      await deleteProject.mutateAsync(projectId);
    } finally {
      setDeletingId(null);
    }
  };

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
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Error loading projects</h3>
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
            Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all your team's projects
          </p>
        </div>
        
        <Link 
          to="/projects/new"
          className="btn btn-primary inline-flex whitespace-nowrap"
        >
          <Plus size={18} className="mr-1" />
          New Project
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
            placeholder="Search projects..."
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
      
      {/* Project Grid */}
      {projects && projects.length > 0 ? (
        <>
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {projects.map((project) => (
              <div key={project.id || ''} className="relative group">
                <ProjectCard
                  project={{
                    id: project.id || '',
                    name: project.name,
                    description: project.description || undefined,
                    teamName: project.team?.name || 'No Team',
                    progress: project.progress || 0,
                    dueDate: project.due_date || undefined, // Fix: ensure undefined, not null
                    taskCount: project.taskCount ?? 0,
                    teamMembers: project.team?.members?.map(member => ({
                      id: member.user.id,
                      name: member.user.name,
                      avatar: member.user.avatar_url || undefined
                    })) || []
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    to={`/projects/${project.id}/edit`}
                    className="btn btn-xs btn-secondary"
                    title="Edit Project"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-xs btn-danger"
                    title="Delete Project"
                    disabled={deletingId === project.id}
                    onClick={() => handleDelete(project.id)}
                  >
                    {deletingId === project.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-8 gap-4">
            <button className="btn btn-secondary" onClick={handlePrev} disabled={page === 1}>Previous</button>
            <span className="self-center">Page {page}</span>
            <button className="btn btn-secondary" onClick={handleNext} disabled={!projects || projects.length < pageSize}>Next</button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <Search size={48} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No projects found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm ? "We couldn't find any projects matching your search." : "Get started by creating your first project."}
          </p>
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="btn btn-secondary"
            >
              Clear filters
            </button>
          ) : (
            <Link
              to="/projects/new"
              className="btn btn-primary"
            >
              <Plus size={18} className="mr-1" />
              Create Project
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;