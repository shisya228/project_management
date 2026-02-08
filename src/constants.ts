import { ProjectHorizon, ProjectStatus } from './types';

export const STATUS_ORDER: ProjectStatus[] = [
  'backlog',
  'next',
  'doing',
  'waiting',
  'done',
  'archived'
];

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  backlog: 'Backlog',
  next: 'Next',
  doing: 'Doing',
  waiting: 'Waiting',
  done: 'Done',
  archived: 'Archived'
};

export const HORIZON_LABELS: Record<ProjectHorizon, string> = {
  core: 'Core',
  platform: 'Platform',
  explore: 'Explore'
};
