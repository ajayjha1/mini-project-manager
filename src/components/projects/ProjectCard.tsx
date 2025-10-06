'use client';

import { Project } from '@/features/projects/projectsSlice';
import { Calendar, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { deleteProject, setCurrentProject } from '@/features/projects/projectsSlice';
import { fetchTasks } from '@/features/tasks/tasksSlice';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
}

export default function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useAppDispatch();

  const handleSelectProject = () => {
    dispatch(setCurrentProject(project));
    dispatch(fetchTasks({ projectId: project._id }));
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      try {
        await dispatch(deleteProject(project._id)).unwrap();
      } catch (error) {
        console.error('Delete project error:', error);
      }
    }
    setShowMenu(false);
  };

  const handleEdit = () => {
    onEdit(project);
    setShowMenu(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1 cursor-pointer" onClick={handleSelectProject}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {project.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {project.description}
            </p>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="relative">
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
