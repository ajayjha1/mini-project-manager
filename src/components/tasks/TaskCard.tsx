'use client';

import { Task } from '@/features/tasks/tasksSlice';
import { Calendar, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { deleteTask, setCurrentTask } from '@/features/tasks/tasksSlice';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const statusColors = {
  todo: 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  done: 'bg-green-100 text-green-800',
};

const statusLabels = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useAppDispatch();

  const handleSelectTask = () => {
    dispatch(setCurrentTask(task));
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(task._id)).unwrap();
      } catch (error) {
        console.error('Delete task error:', error);
      }
    }
    setShowMenu(false);
  };

  const handleEdit = () => {
    onEdit(task);
    setShowMenu(false);
  };

  const projectTitle = typeof task.projectId === 'object' ? task.projectId.title : 'Unknown Project';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1 cursor-pointer" onClick={handleSelectTask}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {task.title}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}>
                {statusLabels[task.status]}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {task.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Due {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">{projectTitle}</span>
            </div>
          </div>
          
          <div className="relative ml-4">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={handleEdit}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
