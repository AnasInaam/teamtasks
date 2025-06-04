import React from 'react';
import { Link } from 'react-router-dom';
import { Kanban, BarChart, Clock } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string;
    teamName: string;
    progress: number;
    dueDate?: string;
    taskCount: number;
    teamMembers: Array<{
      id: string;
      name: string;
      avatar?: string;
    }>;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="card animate-fade-in hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {project.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {project.teamName}
          </p>
        </div>
        <div className="bg-primary-100 dark:bg-primary-900/30 px-3 py-1 rounded-full text-xs font-medium text-primary-800 dark:text-primary-300">
          {project.taskCount} tasks
        </div>
      </div>
      
      {project.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {project.description}
        </p>
      )}
      
      <div className="mt-2 mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {project.progress}%
          </span>
        </div>
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
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex -space-x-2">
          {project.teamMembers.slice(0, 4).map((member) => (
            <img
              key={member.id}
              className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800"
              src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
              alt={member.name}
              title={member.name}
            />
          ))}
          {project.teamMembers.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 border-2 border-white dark:border-gray-800">
              +{project.teamMembers.length - 4}
            </div>
          )}
        </div>
        
        {project.dueDate && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock size={16} className="mr-1" />
            <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to={`/kanban/${project.id}`}
          className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 transition-colors"
        >
          <Kanban size={16} className="mr-1.5" />
          Kanban
        </Link>
        
        <Link
          to={`/projects/${project.id}`}
          className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-primary-100 hover:bg-primary-200 text-primary-700 dark:bg-primary-900/30 dark:hover:bg-primary-800/40 dark:text-primary-300 transition-colors"
        >
          <BarChart size={16} className="mr-1.5" />
          Overview
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;