import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, MoreHorizontal, X, Search, Filter } from 'lucide-react';
import TaskCard from '../components/ui/TaskCard';
import { TaskPriority, TaskStatus } from '../types/task';

// Column type
interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

// Mock data
const mockTasks = [
  {
    id: '1',
    title: 'Finalize homepage design',
    description: 'Review and approve the final homepage design with stakeholders',
    status: 'todo' as TaskStatus,
    priority: 'high' as TaskPriority,
    dueDate: '2025-05-25',
    assignees: [
      { id: '1', name: 'John Doe', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '2', name: 'Jane Smith', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
    commentCount: 5,
    attachmentCount: 2,
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Set up JWT authentication and role-based access control',
    status: 'in-progress' as TaskStatus,
    priority: 'medium' as TaskPriority,
    dueDate: '2025-05-28',
    assignees: [
      { id: '3', name: 'Mike Johnson', avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
    commentCount: 2,
    attachmentCount: 0,
  },
  {
    id: '3',
    title: 'Create marketing materials',
    description: 'Prepare email templates, social media posts, and landing page copy',
    status: 'review' as TaskStatus,
    priority: 'low' as TaskPriority,
    dueDate: '2025-05-30',
    assignees: [
      { id: '4', name: 'Sarah Wilson', avatar: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '5', name: 'Alex Brown', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
    commentCount: 8,
    attachmentCount: 3,
  },
  {
    id: '4',
    title: 'Database optimization',
    description: 'Optimize database queries and indexes for better performance',
    status: 'done' as TaskStatus,
    priority: 'high' as TaskPriority,
    dueDate: '2025-05-20',
    assignees: [
      { id: '3', name: 'Mike Johnson', avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '7', name: 'Chris Lee', avatar: 'https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
    commentCount: 3,
    attachmentCount: 1,
  },
  {
    id: '5',
    title: 'API documentation',
    description: 'Create comprehensive API documentation with examples',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    dueDate: '2025-06-02',
    assignees: [
      { id: '5', name: 'Alex Brown', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
    commentCount: 0,
    attachmentCount: 0,
  },
  {
    id: '6',
    title: 'User testing',
    description: 'Conduct user testing sessions and gather feedback',
    status: 'in-progress' as TaskStatus,
    priority: 'high' as TaskPriority,
    dueDate: '2025-06-05',
    assignees: [
      { id: '2', name: 'Jane Smith', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '4', name: 'Sarah Wilson', avatar: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { id: '8', name: 'Jessica Taylor', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
    commentCount: 4,
    attachmentCount: 2,
  },
  {
    id: '7',
    title: 'Mobile responsiveness',
    description: 'Ensure all pages work well on mobile devices',
    status: 'review' as TaskStatus,
    priority: 'medium' as TaskPriority,
    dueDate: '2025-06-01',
    assignees: [
      { id: '1', name: 'John Doe', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
    commentCount: 2,
    attachmentCount: 0,
  },
  {
    id: '8',
    title: 'Security audit',
    description: 'Conduct a security audit and address any vulnerabilities',
    status: 'done' as TaskStatus,
    priority: 'high' as TaskPriority,
    dueDate: '2025-05-18',
    assignees: [
      { id: '7', name: 'Chris Lee', avatar: 'https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
    ],
    commentCount: 6,
    attachmentCount: 4,
  },
];

// Columns configuration
const columns: Column[] = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100 dark:bg-gray-700' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-amber-100 dark:bg-amber-900/30' },
  { id: 'review', title: 'Review', color: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'done', title: 'Done', color: 'bg-green-100 dark:bg-green-900/30' },
];

// Mock project data
const mockProjects = {
  '1': { name: 'Website Redesign', teamName: 'Design Team' },
  '2': { name: 'Mobile App', teamName: 'Engineering' },
  '3': { name: 'Product Launch', teamName: 'Marketing' },
};

const KanbanBoard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskColumn, setNewTaskColumn] = useState<TaskStatus | null>(null);
  const newTaskInputRef = useRef<HTMLInputElement>(null);
  const project = mockProjects[projectId as keyof typeof mockProjects] || { name: 'Unknown Project', teamName: 'Unknown Team' };
  
  // Filter tasks by project and search term
  const filteredTasks = mockTasks.filter(task => 
    (searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );
  
  // Group tasks by status
  const tasksByStatus = columns.reduce((acc, column) => {
    acc[column.id] = filteredTasks.filter(task => task.status === column.id);
    return acc;
  }, {} as Record<TaskStatus, typeof mockTasks>);
  
  // Start adding a new task
  const handleAddTask = (columnId: TaskStatus) => {
    setNewTaskColumn(columnId);
    setIsAddingTask(true);
    
    // Focus the input after it's rendered
    setTimeout(() => {
      if (newTaskInputRef.current) {
        newTaskInputRef.current.focus();
      }
    }, 0);
  };
  
  // Cancel adding a new task
  const cancelAddTask = () => {
    setIsAddingTask(false);
    setNewTaskColumn(null);
  };
  
  // Create a new task
  const createNewTask = (columnId: TaskStatus) => {
    // In a real app, this would save the task to the backend
    // For now, just hide the form
    cancelAddTask();
  };

  return (
    <div className="h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {project.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {project.teamName} • Kanban Board
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-grow w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="search"
              className="input py-2 pl-10 w-full md:w-60"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="btn btn-secondary">
            <Filter size={18} className="mr-1.5" />
            Filter
          </button>
          
          <button className="btn btn-primary">
            <Plus size={18} className="mr-1.5" />
            Add Task
          </button>
        </div>
      </div>
      
      {/* Kanban Board */}
      <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-72 flex flex-col"
          >
            {/* Column Header */}
            <div className={`rounded-t-lg ${column.color} px-3 py-2 flex justify-between items-center`}>
              <div className="flex items-center">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {column.title}
                </h3>
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 rounded-full">
                  {tasksByStatus[column.id]?.length || 0}
                </span>
              </div>
              <button className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-600">
                <MoreHorizontal size={16} />
              </button>
            </div>
            
            {/* Column Content */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-b-lg p-3 flex-1 flex flex-col min-h-[500px]">
              {/* Tasks */}
              <div className="flex-1 space-y-2">
                {tasksByStatus[column.id]?.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                
                {/* Add Task Form */}
                {isAddingTask && newTaskColumn === column.id && (
                  <div className="bg-white dark:bg-gray-700 rounded-md p-3 shadow-sm border border-gray-200 dark:border-gray-600 animate-slide-in">
                    <input
                      ref={newTaskInputRef}
                      type="text"
                      className="input w-full mb-2"
                      placeholder="Task title"
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <button
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        onClick={cancelAddTask}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-3 py-1 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
                        onClick={() => createNewTask(column.id)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Add Task Button */}
              {(!isAddingTask || newTaskColumn !== column.id) && (
                <button
                  className="mt-2 flex items-center justify-center py-2 rounded-md border border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-primary-600 hover:border-primary-500 dark:hover:text-primary-400 dark:hover:border-primary-500 transition-colors"
                  onClick={() => handleAddTask(column.id)}
                >
                  <Plus size={16} className="mr-1" />
                  Add Task
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;