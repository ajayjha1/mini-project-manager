import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  projectId: string | { _id: string; title: string };
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    projectId: string | null;
    status: TaskStatus | null;
  };
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const initialState: TasksState = {
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  filters: {
    projectId: null,
    status: null,
  },
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params: { projectId?: string; status?: TaskStatus; sortBy?: string; sortOrder?: string } = {}, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams();
      if (params.projectId) searchParams.append('projectId', params.projectId);
      if (params.status) searchParams.append('status', params.status);
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

      const response = await axios.get(`/api/tasks?${searchParams.toString()}`);
      return response.data.tasks;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: { title: string; description: string; status: TaskStatus; dueDate: string; projectId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/tasks', taskData);
      return response.data.task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }: { id: string; taskData: { title: string; description: string; status: TaskStatus; dueDate: string; projectId: string } }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/tasks/${id}`, taskData);
      return response.data.task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete task');
    }
  }
);

export const fetchTask = createAsyncThunk(
  'tasks/fetchTask',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/tasks/${id}`);
      return response.data.task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch task');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentTask: (state, action: PayloadAction<Task | null>) => {
      state.currentTask = action.payload;
    },
    setFilters: (state, action: PayloadAction<{ projectId?: string | null; status?: TaskStatus | null }>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSorting: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    clearFilters: (state) => {
      state.filters = {
        projectId: null,
        status: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask && state.currentTask._id === action.payload._id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
        if (state.currentTask && state.currentTask._id === action.payload) {
          state.currentTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single task
      .addCase(fetchTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentTask, setFilters, setSorting, clearFilters } = tasksSlice.actions;
export default tasksSlice.reducer;
