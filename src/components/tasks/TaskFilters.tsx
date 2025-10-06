'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setFilters, setSorting, clearFilters, fetchTasks } from '@/features/tasks/tasksSlice';
import { TaskStatus } from '@/features/tasks/tasksSlice';
import { Filter, SortAsc, SortDesc } from 'lucide-react';

export default function TaskFilters() {
  const dispatch = useAppDispatch();
  const { filters, sortBy, sortOrder, projects } = useAppSelector((state) => ({
    filters: state.tasks.filters,
    sortBy: state.tasks.sortBy,
    sortOrder: state.tasks.sortOrder,
    projects: state.projects.projects,
  }));

  const handleFilterChange = (key: 'projectId' | 'status', value: string | null) => {
    const newFilters = { ...filters, [key]: value };
    dispatch(setFilters(newFilters));
    dispatch(fetchTasks({ 
      projectId: newFilters.projectId || undefined,
      status: newFilters.status || undefined,
      sortBy, 
      sortOrder 
    }));
  };

  const handleSortChange = (newSortBy: string) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setSorting({ sortBy: newSortBy, sortOrder: newSortOrder }));
    dispatch(fetchTasks({ 
      projectId: filters.projectId || undefined,
      status: filters.status || undefined,
      sortBy: newSortBy, 
      sortOrder: newSortOrder 
    }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(fetchTasks({ sortBy, sortOrder }));
  };

  const hasActiveFilters = filters.projectId || filters.status;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filters.projectId || ''}
            onChange={(e) => handleFilterChange('projectId', e.target.value || null)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>

          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value as TaskStatus || null)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-auto">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          
          <div className="flex space-x-1">
            {[
              { key: 'createdAt', label: 'Created' },
              { key: 'dueDate', label: 'Due Date' },
              { key: 'status', label: 'Status' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleSortChange(key)}
                className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-md transition-colors ${
                  sortBy === key
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{label}</span>
                {sortBy === key && (
                  sortOrder === 'asc' ? (
                    <SortAsc className="h-3 w-3" />
                  ) : (
                    <SortDesc className="h-3 w-3" />
                  )
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
