export type ProjectStatus = 'backlog' | 'next' | 'doing' | 'waiting' | 'done' | 'archived';
export type ProjectHorizon = 'core' | 'platform' | 'explore';

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  note: string;
}

export interface Project {
  id: string;
  parent_id: string | null;
  title: string;
  description: string;
  status: ProjectStatus;
  horizon: ProjectHorizon;
  area: string[];
  priority: number;
  cost: number;
  value: number;
  leverage: number;
  certainty: number;
  next_todos: TodoItem[];
  updated_at: string;
  notes: string;
}

export interface AppData {
  version: number;
  projects: Project[];
  updated_at: string;
}
