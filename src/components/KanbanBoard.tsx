import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { Project } from '../types';
import { STATUS_LABELS, STATUS_ORDER } from '../constants';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onMoveProject: (projectId: string, status: Project['status']) => void;
}

export const KanbanBoard = ({ projects, onSelectProject, onMoveProject }: KanbanBoardProps) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const subprojectLookup = projects.reduce<Record<string, number>>((acc, project) => {
    if (project.parent_id) {
      acc[project.parent_id] = (acc[project.parent_id] ?? 0) + 1;
    }
    return acc;
  }, {});

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeStatus = active.data.current?.status as Project['status'] | undefined;
    let targetStatus = over.data.current?.status as Project['status'] | undefined;
    if (!targetStatus && typeof over.id === 'string') {
      targetStatus = over.id as Project['status'];
    }
    if (!activeStatus || !targetStatus || activeStatus === targetStatus) {
      return;
    }
    onMoveProject(active.id as string, targetStatus);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {STATUS_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            title={STATUS_LABELS[status]}
            projects={projects.filter((project) => project.status === status)}
            onSelectProject={onSelectProject}
            subprojectLookup={subprojectLookup}
          />
        ))}
      </div>
    </DndContext>
  );
};
