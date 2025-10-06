'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchProjects } from '@/features/projects/projectsSlice';
import { fetchTasks } from '@/features/tasks/tasksSlice';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/layout/Header';
import ProjectList from '@/components/projects/ProjectList';
import TaskList from '@/components/tasks/TaskList';
import { Project } from '@/features/projects/projectsSlice';
import { ArrowLeft } from 'lucide-react';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { currentProject } = useAppSelector((state) => state.projects);
  const [activeTab, setActiveTab] = useState<'projects' | 'tasks'>('projects');

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  // const handleProjectSelect = (project: Project) => {
  //   dispatch({ type: 'projects/setCurrentProject', payload: project });
  //   setActiveTab('tasks');
  // };

  const handleBackToProjects = () => {
    dispatch({ type: 'projects/setCurrentProject', payload: null });
    setActiveTab('projects');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentProject ? (
            <div>
              <div className="flex items-center mb-6">
                <button
                  onClick={handleBackToProjects}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mr-4"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Projects</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{currentProject.title}</h1>
                  <p className="text-gray-600 mt-1">{currentProject.description}</p>
                </div>
              </div>
              <TaskList projectId={currentProject._id} />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600 mt-2">Manage your projects and tasks</p>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab('projects')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      activeTab === 'projects'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    Projects
                  </button>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      activeTab === 'tasks'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    All Tasks
                  </button>
                </div>
              </div>

              {activeTab === 'projects' ? <ProjectList /> : <TaskList />}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
