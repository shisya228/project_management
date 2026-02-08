import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { Project } from '../types';
import { diffDaysFromToday } from '../utils/date';
import { HORIZON_LABELS } from '../constants';

interface KanbanCardProps {
  project: Project;
  subprojectCount: number;
  openTodosCount: number;
  onClick: (projectId: string) => void;
}

export const KanbanCard = ({ project, subprojectCount, openTodosCount, onClick }: KanbanCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
    data: { type: 'card', status: project.status }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const staleDays = diffDaysFromToday(project.updated_at);
  const isStale = staleDays > 7;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`kanban-card ${isDragging ? 'is-dragging' : ''} ${isStale ? 'is-stale' : ''}`}
      onClick={() => onClick(project.id)}
      {...attributes}
      {...listeners}
    >
      <div className="card-header">
        <h4>{project.title}</h4>
        <span className="priority">P{project.priority.toFixed(1)}</span>
      </div>
      <div className="card-meta">
        <span className="chip">{HORIZON_LABELS[project.horizon]}</span>
        <span className="chip">
          {project.area.slice(0, 2).join(', ')}
          {project.area.length > 2 ? ` +${project.area.length - 2}` : ''}
        </span>
      </div>
      <div className="card-stats">
        <span>Todos: {openTodosCount}</span>
        <span>Sub: {subprojectCount}</span>
      </div>
      <div className="card-footer">
        <span>更新 {project.updated_at}</span>
        {isStale && <span className="stale-flag">⚠️</span>}
      </div>
    </div>
  );
};
