import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Project, ProjectStatus } from '../types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  status: ProjectStatus;
  title: string;
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  subprojectLookup: Record<string, number>;
}

export const KanbanColumn = ({
  status,
  title,
  projects,
  onSelectProject,
  subprojectLookup
}: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({ id: status, data: { type: 'column', status } });

  return (
    <section className="kanban-column">
      <div className="column-header">
        <h3>{title}</h3>
        <span className="count">{projects.length}</span>
      </div>
      <div ref={setNodeRef} className="column-body">
        <SortableContext items={projects.map((project) => project.id)} strategy={verticalListSortingStrategy}>
          {projects.map((project) => (
            <KanbanCard
              key={project.id}
              project={project}
              subprojectCount={subprojectLookup[project.id] ?? 0}
              openTodosCount={project.next_todos.filter((todo) => !todo.done).length}
              onClick={onSelectProject}
            />
          ))}
        </SortableContext>
      </div>
    </section>
  );
};
