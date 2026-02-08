import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppData, Project, TodoItem } from '../types';
import { sampleData } from '../sampleData';
import { todayISO } from '../utils/date';
import { createId } from '../utils/id';

const STORAGE_KEY = 'project_cockpit_appdata';

const defaultTodo = (): TodoItem => ({
  id: createId(),
  text: '',
  done: false,
  order: 1,
  created_at: todayISO(),
  updated_at: todayISO(),
  note: ''
});

const defaultProject = (): Project => ({
  id: createId(),
  parent_id: null,
  title: 'Untitled Project',
  description: '',
  status: 'backlog',
  horizon: 'core',
  area: [],
  priority: 5,
  cost: 3,
  value: 3,
  leverage: 3,
  certainty: 3,
  next_todos: [],
  updated_at: todayISO(),
  notes: ''
});

const normalizeTodo = (todo: Partial<TodoItem>): TodoItem => ({
  ...defaultTodo(),
  ...todo,
  id: typeof todo.id === 'string' ? todo.id : createId(),
  text: typeof todo.text === 'string' ? todo.text : '',
  done: Boolean(todo.done),
  order: typeof todo.order === 'number' ? todo.order : 1,
  created_at: typeof todo.created_at === 'string' ? todo.created_at : todayISO(),
  updated_at: typeof todo.updated_at === 'string' ? todo.updated_at : todayISO(),
  note: typeof todo.note === 'string' ? todo.note : ''
});

const normalizeProject = (project: Partial<Project>): Project => ({
  ...defaultProject(),
  ...project,
  id: typeof project.id === 'string' ? project.id : createId(),
  parent_id: project.parent_id ?? null,
  title: typeof project.title === 'string' ? project.title : 'Untitled Project',
  description: typeof project.description === 'string' ? project.description : '',
  status: project.status ?? 'backlog',
  horizon: project.horizon ?? 'core',
  area: Array.isArray(project.area) ? project.area.filter(Boolean) : [],
  priority: typeof project.priority === 'number' ? project.priority : 5,
  cost: typeof project.cost === 'number' ? project.cost : 3,
  value: typeof project.value === 'number' ? project.value : 3,
  leverage: typeof project.leverage === 'number' ? project.leverage : 3,
  certainty: typeof project.certainty === 'number' ? project.certainty : 3,
  next_todos: Array.isArray(project.next_todos)
    ? project.next_todos.map(normalizeTodo).sort((a, b) => a.order - b.order)
    : [],
  updated_at: typeof project.updated_at === 'string' ? project.updated_at : todayISO(),
  notes: typeof project.notes === 'string' ? project.notes : ''
});

const normalizeAppData = (data: Partial<AppData>): AppData => {
  if (typeof data.version !== 'number') {
    throw new Error('Invalid data: missing version');
  }
  return {
    version: data.version,
    projects: Array.isArray(data.projects) ? data.projects.map(normalizeProject) : [],
    updated_at: typeof data.updated_at === 'string' ? data.updated_at : todayISO()
  };
};

const loadAppData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return sampleData;
  }
  try {
    const parsed = JSON.parse(stored) as AppData;
    return normalizeAppData(parsed);
  } catch (error) {
    console.error('Failed to parse stored data', error);
    return sampleData;
  }
};

interface AppDataContextValue {
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
  updateProjects: (updater: (projects: Project[]) => Project[]) => void;
  addProject: (project?: Partial<Project>) => Project;
  updateProject: (projectId: string, updater: (project: Project) => Project) => void;
  deleteProject: (projectId: string) => void;
  duplicateProject: (projectId: string) => Project | null;
  resetSample: () => void;
  importData: (raw: unknown) => void;
  exportData: () => string;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appData, setAppData] = useState<AppData>(() => loadAppData());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  }, [appData]);

  const updateProjects = (updater: (projects: Project[]) => Project[]) => {
    setAppData((prev) => ({
      ...prev,
      projects: updater(prev.projects),
      updated_at: todayISO()
    }));
  };

  const addProject = (project: Partial<Project> = {}) => {
    const newProject = normalizeProject({ ...project, updated_at: todayISO() });
    updateProjects((projects) => [...projects, newProject]);
    return newProject;
  };

  const updateProject = (projectId: string, updater: (project: Project) => Project) => {
    updateProjects((projects) =>
      projects.map((project) =>
        project.id === projectId
          ? updater({ ...project, updated_at: todayISO() })
          : project,
      ),
    );
  };

  const deleteProject = (projectId: string) => {
    updateProjects((projects) => {
      const target = projects.find((project) => project.id === projectId);
      if (!target) {
        return projects;
      }
      if (target.parent_id === null) {
        return projects.filter((project) => project.id !== projectId && project.parent_id !== projectId);
      }
      return projects.filter((project) => project.id !== projectId);
    });
  };

  const duplicateProject = (projectId: string) => {
    const source = appData.projects.find((project) => project.id === projectId);
    if (!source) {
      return null;
    }
    const copy = normalizeProject({
      ...source,
      id: createId(),
      title: `${source.title} (copy)`,
      parent_id: source.parent_id,
      updated_at: todayISO(),
      next_todos: source.next_todos.map((todo) => ({
        ...todo,
        id: createId(),
        created_at: todayISO(),
        updated_at: todayISO()
      }))
    });
    updateProjects((projects) => [...projects, copy]);
    return copy;
  };

  const resetSample = () => {
    setAppData(sampleData);
  };

  const importData = (raw: unknown) => {
    const parsed = normalizeAppData(raw as Partial<AppData>);
    setAppData({
      ...parsed,
      updated_at: todayISO()
    });
  };

  const exportData = () => JSON.stringify(appData, null, 2);

  const value = useMemo(
    () => ({
      appData,
      setAppData,
      updateProjects,
      addProject,
      updateProject,
      deleteProject,
      duplicateProject,
      resetSample,
      importData,
      exportData
    }),
    [appData],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
};

export const buildEmptyProject = (parentId: string | null = null): Project => ({
  ...defaultProject(),
  id: createId(),
  parent_id: parentId,
  updated_at: todayISO(),
  next_todos: []
});
