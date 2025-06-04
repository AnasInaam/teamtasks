export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeIds: string[];
  creatorId: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  attachmentCount: number;
}

export interface TaskWithAssignees extends Task {
  assignees: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}