// TODO: This ProjectDetails page currently lacks real data integration.
// - Replace all mockProject and mockTasks with real data from Supabase.
// - Implement data fetching using hooks and display loading/error states.
// - Add backend-connected actions for adding tasks, editing project, etc.
// - Remove this comment after full backend integration.

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Paperclip,
  MoreHorizontal,
  ChevronLeft,
  Kanban,
} from 'lucide-react';
import TaskCard from '../components/ui/TaskCard';
import { TaskPriority, TaskStatus } from '../types/task';

// TODO: Connect to backend for project and tasks data
// const mockProject = {...};
// const mockTasks = [...];

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'timeline' | 'files'>('overview');

  // TODO: Fetch project and tasks data from backend using id
  // const project = ...
  // const tasks = ...

  return (
    <div>
      {/* TODO: Render real project details, tasks, timeline, and files from backend */}
    </div>
  );
};

export default ProjectDetails;