'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchTasks } from '@/features/tasks/tasksSlice';
import { fetchProjects } from '@/features/projects/projectsSlice';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import TaskFilters from './TaskFilters';
import { Task } from '@/features/tasks/tasksSlice';
import { Plus } from 'lucide-react';

interface TaskListProps {
  projectId?: string;
}

export default function TaskList({ projectId }: TaskListProps) {
  const dispatch = useAppDispatch();
  const { tasks, isLoading, error, filters, sortBy, sortOrder } = useAppSelector((state) => state.tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    // Fetch projects first if not already loaded
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    const fetchParams = {
      projectId: projectId || filters.projectId || undefined,
      status: filters.status || undefined,
      sortBy,
      sortOrder,
    };
    
    dispatch(fetchTasks(fetchParams));
  }, [dispatch, projectId, filters.projectId, filters.status, sortBy, sortOrder]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {projectId ? 'Project Tasks' : 'All Tasks'}
        </h2>
        <button
          onClick={handleCreateTask}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
      </div>

      {!projectId && <TaskFilters />}

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500 mb-4">
            {projectId 
              ? 'This project doesn\'t have any tasks yet.' 
              : 'You don\'t have any tasks yet.'
            }
          </p>
          <button
            onClick={handleCreateTask}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEditTask}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
        mode={modalMode}
        defaultProjectId={projectId}
      />
    </div>
  );
}
