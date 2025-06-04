import React from 'react';
import { Clock, MessageSquare, Paperclip, Users } from 'lucide-react';
import { TaskPriority, TaskStatus } from '../../types/task';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    assignees: Array<{
      id: string;
      name: string;
      avatar?: string;
    }>;
    commentCount: number;
    attachmentCount: number;
  };
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  // Priority badge color
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div 
      className="task-card animate-fade-in"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</h3>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>
      
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex -space-x-2">
          {task.assignees.slice(0, 3).map((assignee) => (
            <img
              key={assignee.id}
              className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
              src={assignee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(assignee.name)}&background=random`}
              alt={assignee.name}
              title={assignee.name}
            />
          ))}
          {task.assignees.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 border-2 border-white dark:border-gray-800">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          {task.dueDate && (
            <div className="flex items-center text-xs">
              <Clock size={12} className="mr-1" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          
          {task.commentCount > 0 && (
            <div className="flex items-center text-xs">
              <MessageSquare size={12} className="mr-1" />
              <span>{task.commentCount}</span>
            </div>
          )}
          
          {task.attachmentCount > 0 && (
            <div className="flex items-center text-xs">
              <Paperclip size={12} className="mr-1" />
              <span>{task.attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;