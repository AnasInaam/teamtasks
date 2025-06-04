import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, SortAsc, Grid, List } from 'lucide-react';
import ProjectCard from '../components/ui/ProjectCard';

// Mock data
const mockProjects = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with a modern design and improved user experience.',
    teamName: 'Design Team',
    progress: 75,
    dueDate: '2025-06-15',
    taskCount: 12,
    teamMembers: [
      { id: '1', name: 'John Doe', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '2', name: 'Jane Smith', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '4', name: 'Sarah Wilson', avatar: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Building a cross-platform mobile application for iOS and Android using React Native.',
    teamName: 'Engineering',
    progress: 40,
    dueDate: '2025-07-30',
    taskCount: 24,
    teamMembers: [
      { id: '3', name: 'Mike Johnson', avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '5', name: 'Alex Brown', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '6', name: 'Emma Davis', avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '7', name: 'Chris Lee', avatar: 'https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
  },
  {
    id: '3',
    name: 'Product Launch',
    description: 'Coordinating the launch of our new product including marketing materials, press releases, and event planning.',
    teamName: 'Marketing',
    progress: 25,
    dueDate: '2025-08-10',
    taskCount: 18,
    teamMembers: [
      { id: '1', name: 'John Doe', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '4', name: 'Sarah Wilson', avatar: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '8', name: 'Jessica Taylor', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
  },
  {
    id: '4',
    name: 'API Development',
    description: 'Building a RESTful API for third-party integrations and mobile applications.',
    teamName: 'Engineering',
    progress: 60,
    dueDate: '2025-06-30',
    taskCount: 15,
    teamMembers: [
      { id: '3', name: 'Mike Johnson', avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '7', name: 'Chris Lee', avatar: 'https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
  },
  {
    id: '5',
    name: 'Customer Research',
    description: 'Conducting user interviews and gathering feedback to inform product development.',
    teamName: 'Design Team',
    progress: 85,
    dueDate: '2025-05-31',
    taskCount: 9,
    teamMembers: [
      { id: '2', name: 'Jane Smith', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '8', name: 'Jessica Taylor', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
  },
  {
    id: '6',
    name: 'Database Migration',
    description: 'Migrating from MySQL to PostgreSQL with minimal downtime and data integrity.',
    teamName: 'Engineering',
    progress: 30,
    dueDate: '2025-07-15',
    taskCount: 11,
    teamMembers: [
      { id: '5', name: 'Alex Brown', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '7', name: 'Chris Lee', avatar: 'https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
  },
];

// View modes
type ViewMode = 'grid' | 'list';

const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Filter projects based on search term
  const filteredProjects = mockProjects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.teamName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      
      {/* Project Grid */}
      {filteredProjects.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <Search size={48} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No projects found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            We couldn't find any projects matching your search.
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

export default Projects;