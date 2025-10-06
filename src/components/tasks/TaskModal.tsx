'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { createTask, updateTask, clearError } from '@/features/tasks/tasksSlice';
import { fetchProjects } from '@/features/projects/projectsSlice';
import { Task, TaskStatus } from '@/features/tasks/tasksSlice';
import { X } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['todo', 'in-progress', 'done']),
  dueDate: z.string().min(1, 'Due date is required'),
  projectId: z.string().min(1, 'Project is required'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  mode: 'create' | 'edit';
  defaultProjectId?: string;
}

export default function TaskModal({ isOpen, onClose, task, mode, defaultProjectId }: TaskModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'todo',
      dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
      projectId: task?.projectId ? (typeof task.projectId === 'string' ? task.projectId : task.projectId._id) : defaultProjectId || '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchProjects());
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (task && mode === 'edit') {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate.split('T')[0],
        projectId: typeof task.projectId === 'string' ? task.projectId : task.projectId._id,
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'todo',
        dueDate: '',
        projectId: defaultProjectId || '',
      });
    }
  }, [task, mode, reset, defaultProjectId]);

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    dispatch(clearError());

    try {
      const taskData = {
        title: data.title,
        description: data.description,
        status: data.status as TaskStatus,
        dueDate: data.dueDate,
        projectId: data.projectId,
      };

      if (mode === 'create') {
        await dispatch(createTask(taskData)).unwrap();
      } else if (task) {
        await dispatch(updateTask({ id: task._id, taskData })).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Task operation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'create' ? 'Create New Task' : 'Edit Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                {...register('title')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-gray-900"
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-gray-900"
                placeholder="Enter task description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <select
                {...register('projectId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.title}
                  </option>
                ))}
              </select>
              {errors.projectId && (
                <p className="mt-1 text-sm text-red-600">{errors.projectId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                {...register('dueDate')}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : mode === 'create' ? 'Create Task' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
