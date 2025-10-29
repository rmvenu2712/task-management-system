import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Priority = 'low' | 'medium' | 'high' | 'none';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  columnId: string;
  projectId: string;
  order: number;
  createdAt: string;
  dueDate?: string;
  isCompleted: boolean;
  completedAt?: string;
  timeSpent: number; // in seconds
  isTimerRunning: boolean;
  lastTimerStart?: number;
  activityLog: ActivityLogEntry[];
  tags: string[];
  dependencies: string[];
  assignedTo?: string;
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface TaskStore {
  tasks: Task[];
  columns: Column[];
  projects: Project[];
  selectedProjectId: string | null;
  userProfile: UserProfile;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'isCompleted' | 'timeSpent' | 'isTimerRunning' | 'activityLog' | 'tags' | 'dependencies'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newColumnId: string, newOrder: number) => void;
  addColumn: (title: string) => void;
  deleteColumn: (id: string) => void;
  reorderTasks: (columnId: string, taskIds: string[]) => void;
  toggleTaskComplete: (id: string) => void;
  startTimer: (id: string) => void;
  stopTimer: (id: string) => void;
  addActivityLog: (id: string, action: string, details?: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setSelectedProject: (id: string | null) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const defaultColumns: Column[] = [
  { id: 'todo', title: 'To Do', order: 0 },
  { id: 'in-progress', title: 'In Progress', order: 1 },
  { id: 'done', title: 'Done', order: 2 },
];

const defaultProjects: Project[] = [
  {
    id: 'default',
    name: 'Getting Started',
    description: 'Welcome to TaskFlow Pro',
    color: 'hsl(var(--primary))',
    createdAt: new Date().toISOString(),
  },
];

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Welcome to TaskFlow! 🎉',
    description: 'Drag and drop tasks between columns to organize your work.',
    priority: 'medium',
    columnId: 'todo',
    projectId: 'default',
    order: 0,
    createdAt: new Date().toISOString(),
    isCompleted: false,
    timeSpent: 0,
    isTimerRunning: false,
    activityLog: [],
    tags: ['welcome'],
    dependencies: [],
  },
  {
    id: '2',
    title: 'Create your first task',
    description: 'Click the "Add Task" button to create a new task.',
    priority: 'high',
    columnId: 'todo',
    projectId: 'default',
    order: 1,
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    isCompleted: false,
    timeSpent: 0,
    isTimerRunning: false,
    activityLog: [],
    tags: ['getting-started'],
    dependencies: [],
  },
  {
    id: '3',
    title: 'Organize with priorities',
    description: 'Use priority labels to highlight important tasks.',
    priority: 'low',
    columnId: 'in-progress',
    projectId: 'default',
    order: 0,
    createdAt: new Date().toISOString(),
    isCompleted: false,
    timeSpent: 0,
    isTimerRunning: false,
    activityLog: [],
    tags: ['tips'],
    dependencies: [],
  },
];

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: defaultTasks,
      columns: defaultColumns,
      projects: defaultProjects,
      selectedProjectId: 'default',
      userProfile: {
        name: 'User',
        email: 'user@taskflow.com',
        role: 'Project Manager',
      },

      addTask: (task) =>
        set((state) => {
          const newTask: Task = {
            ...task,
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            isCompleted: false,
            timeSpent: 0,
            isTimerRunning: false,
            tags: [],
            dependencies: [],
            activityLog: [{
              id: `log-${Date.now()}`,
              action: 'created',
              timestamp: new Date().toISOString(),
            }],
          };
          return { tasks: [...state.tasks, newTask] };
        }),

      updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      moveTask: (taskId, newColumnId, newOrder) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task) return state;

          const tasksInNewColumn = state.tasks.filter(
            (t) => t.columnId === newColumnId && t.id !== taskId
          );

          const updatedTasks = state.tasks.map((t) => {
            if (t.id === taskId) {
              return { ...t, columnId: newColumnId, order: newOrder };
            }
            if (t.columnId === newColumnId) {
              if (t.order >= newOrder) {
                return { ...t, order: t.order + 1 };
              }
            }
            return t;
          });

          return { tasks: updatedTasks };
        }),

      addColumn: (title) =>
        set((state) => ({
          columns: [
            ...state.columns,
            {
              id: `column-${Date.now()}`,
              title,
              order: state.columns.length,
            },
          ],
        })),

      deleteColumn: (id) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id),
          tasks: state.tasks.filter((task) => task.columnId !== id),
        })),

      reorderTasks: (columnId, taskIds) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.columnId === columnId) {
              const newOrder = taskIds.indexOf(task.id);
              return newOrder !== -1 ? { ...task, order: newOrder } : task;
            }
            return task;
          }),
        })),

      toggleTaskComplete: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id === id) {
              const isCompleted = !task.isCompleted;
              const activityLog = [
                ...task.activityLog,
                {
                  id: `log-${Date.now()}`,
                  action: isCompleted ? 'completed' : 'reopened',
                  timestamp: new Date().toISOString(),
                },
              ];
              return {
                ...task,
                isCompleted,
                completedAt: isCompleted ? new Date().toISOString() : undefined,
                activityLog,
                isTimerRunning: false,
              };
            }
            return task;
          }),
        })),

      startTimer: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { 
                  ...task, 
                  isTimerRunning: true, 
                  lastTimerStart: Date.now(),
                  activityLog: [
                    ...task.activityLog,
                    {
                      id: `log-${Date.now()}`,
                      action: 'timer_started',
                      timestamp: new Date().toISOString(),
                    },
                  ],
                }
              : task
          ),
        })),

      stopTimer: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id === id && task.isTimerRunning) {
              const elapsed = task.lastTimerStart 
                ? Math.floor((Date.now() - task.lastTimerStart) / 1000)
                : 0;
              return {
                ...task,
                isTimerRunning: false,
                timeSpent: task.timeSpent + elapsed,
                lastTimerStart: undefined,
                activityLog: [
                  ...task.activityLog,
                  {
                    id: `log-${Date.now()}`,
                    action: 'timer_stopped',
                    timestamp: new Date().toISOString(),
                    details: `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`,
                  },
                ],
              };
            }
            return task;
          }),
        })),

      addActivityLog: (id, action, details) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  activityLog: [
                    ...task.activityLog,
                    {
                      id: `log-${Date.now()}`,
                      action,
                      timestamp: new Date().toISOString(),
                      details,
                    },
                  ],
                }
              : task
          ),
        })),

      addProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...project,
              id: `project-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateProject: (id, updatedProject) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updatedProject } : project
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          tasks: state.tasks.filter((task) => task.projectId !== id),
          selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId,
        })),

      setSelectedProject: (id) =>
        set({ selectedProjectId: id }),

      updateUserProfile: (profile) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile },
        })),
    }),
    {
      name: 'taskflow-storage',
    }
  )
);
