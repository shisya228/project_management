import { useEffect, useMemo, useState } from 'react';
import { Project, TodoItem } from '../types';
import { STATUS_LABELS, STATUS_ORDER, HORIZON_LABELS } from '../constants';
import { todayISO } from '../utils/date';
import { createId } from '../utils/id';
import { TodoList } from './TodoList';
import { SubprojectList } from './SubprojectList';
import { buildEmptyProject, useAppData } from '../store/useAppData';

interface ProjectDrawerProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject: (id: string) => void;
}

export const ProjectDrawer = ({ project, onClose, onSelectProject }: ProjectDrawerProps) => {
  const { appData, updateProject, updateProjects, addProject, deleteProject, duplicateProject } = useAppData();
  const [selectedTodoIds, setSelectedTodoIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedTodoIds(new Set());
  }, [project?.id]);

  const subprojects = useMemo(
    () => appData.projects.filter((item) => item.parent_id === project?.id),
    [appData.projects, project?.id],
  );

  if (!project) {
    return null;
  }

  const canCreateSubproject = project.parent_id === null;

  const handleToggleSelectTodo = (id: string) => {
    setSelectedTodoIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddTodo = (text: string) => {
    updateProject(project.id, (current) => {
      const maxOrder = Math.max(0, ...current.next_todos.map((todo) => todo.order));
      const newTodo: TodoItem = {
        id: createId(),
        text,
        done: false,
        order: maxOrder + 1,
        created_at: todayISO(),
        updated_at: todayISO(),
        note: ''
      };
      return { ...current, next_todos: [...current.next_todos, newTodo] };
    });
  };

  const handleUpdateTodo = (id: string, updates: Partial<TodoItem>) => {
    updateProject(project.id, (current) => ({
      ...current,
      next_todos: current.next_todos.map((todo) =>
        todo.id === id
          ? { ...todo, ...updates, updated_at: todayISO() }
          : todo,
      )
    }));
  };

  const handleDeleteTodo = (id: string) => {
    updateProject(project.id, (current) => {
      const remaining = current.next_todos.filter((todo) => todo.id !== id);
      return {
        ...current,
        next_todos: remaining.map((todo, index) => ({ ...todo, order: index + 1 }))
      };
    });
    setSelectedTodoIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleMoveTodo = (id: string, direction: 'up' | 'down') => {
    updateProject(project.id, (current) => {
      const sorted = [...current.next_todos].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((todo) => todo.id === id);
      if (index < 0) return current;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= sorted.length) return current;
      const reordered = [...sorted];
      const [moved] = reordered.splice(index, 1);
      reordered.splice(targetIndex, 0, moved);
      return {
        ...current,
        next_todos: reordered.map((todo, idx) => ({ ...todo, order: idx + 1 }))
      };
    });
  };

  const handleSplitTodos = () => {
    if (!canCreateSubproject || selectedTodoIds.size === 0) return;
    const defaultTitle = `子项目：${project.title}`;
    const title = window.prompt('请输入子项目标题', defaultTitle);
    if (!title) return;

    updateProjects((projects) => {
      const parent = projects.find((item) => item.id === project.id);
      if (!parent) return projects;
      const selectedTodos = parent.next_todos.filter((todo) => selectedTodoIds.has(todo.id));
      const remainingTodos = parent.next_todos.filter((todo) => !selectedTodoIds.has(todo.id));
      const newSubproject = {
        ...buildEmptyProject(parent.id),
        title,
        status: parent.status,
        horizon: parent.horizon,
        area: parent.area,
        priority: parent.priority,
        cost: parent.cost,
        value: parent.value,
        leverage: parent.leverage,
        certainty: parent.certainty,
        next_todos: selectedTodos.map((todo, index) => ({
          ...todo,
          order: index + 1,
          updated_at: todayISO()
        })),
        updated_at: todayISO()
      };

      return projects
        .map((item) => {
          if (item.id === parent.id) {
            return {
              ...item,
              next_todos: remainingTodos.map((todo, index) => ({ ...todo, order: index + 1 })),
              updated_at: todayISO()
            };
          }
          return item;
        })
        .concat(newSubproject);
    });
    setSelectedTodoIds(new Set());
  };

  const handleCreateSubproject = () => {
    if (!canCreateSubproject) return;
    const newProject = addProject({
      ...buildEmptyProject(project.id),
      title: `子项目：${project.title}`,
      status: project.status,
      horizon: project.horizon,
      area: project.area
    });
    onSelectProject(newProject.id);
  };

  const handleDeleteProject = () => {
    const message = project.parent_id === null
      ? '删除该父项目将同时删除所有子项目。确定删除吗？'
      : '确定删除该子项目吗？';
    if (!window.confirm(message)) return;
    deleteProject(project.id);
    onClose();
  };

  const handleDuplicateProject = () => {
    const copy = duplicateProject(project.id);
    if (copy) {
      onSelectProject(copy.id);
    }
  };

  return (
    <aside className="drawer">
      <div className="drawer-header">
        <h2>Project Detail</h2>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>

      <section className="drawer-section">
        <h3>Overview</h3>
        <label>
          标题
          <input
            type="text"
            value={project.title}
            onChange={(event) => updateProject(project.id, (current) => ({ ...current, title: event.target.value }))}
          />
        </label>
        <label>
          Description
          <textarea
            value={project.description}
            onChange={(event) =>
              updateProject(project.id, (current) => ({ ...current, description: event.target.value }))
            }
          />
        </label>
        <div className="grid">
          <label>
            Status
            <select
              value={project.status}
              onChange={(event) =>
                updateProject(project.id, (current) => ({ ...current, status: event.target.value as Project['status'] }))
              }
            >
              {STATUS_ORDER.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Horizon
            <select
              value={project.horizon}
              onChange={(event) =>
                updateProject(project.id, (current) => ({ ...current, horizon: event.target.value as Project['horizon'] }))
              }
            >
              {Object.entries(HORIZON_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Area (逗号分隔)
            <input
              type="text"
              value={project.area.join(', ')}
              onChange={(event) =>
                updateProject(project.id, (current) => ({
                  ...current,
                  area: event.target.value
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean)
                }))
              }
            />
          </label>
          <label>
            Priority
            <input
              type="number"
              step="0.1"
              value={project.priority}
              onChange={(event) =>
                updateProject(project.id, (current) => ({ ...current, priority: Number(event.target.value) }))
              }
            />
          </label>
          <label>
            Cost
            <input
              type="number"
              min={1}
              max={5}
              value={project.cost}
              onChange={(event) =>
                updateProject(project.id, (current) => ({ ...current, cost: Number(event.target.value) }))
              }
            />
          </label>
          <label>
            Value
            <input
              type="number"
              min={1}
              max={5}
              value={project.value}
              onChange={(event) =>
                updateProject(project.id, (current) => ({ ...current, value: Number(event.target.value) }))
              }
            />
          </label>
          <label>
            Leverage
            <input
              type="number"
              min={1}
              max={5}
              value={project.leverage}
              onChange={(event) =>
                updateProject(project.id, (current) => ({ ...current, leverage: Number(event.target.value) }))
              }
            />
          </label>
          <label>
            Certainty
            <input
              type="number"
              min={1}
              max={5}
              value={project.certainty}
              onChange={(event) =>
                updateProject(project.id, (current) => ({ ...current, certainty: Number(event.target.value) }))
              }
            />
          </label>
        </div>
        <label>
          Notes
          <textarea
            value={project.notes}
            onChange={(event) => updateProject(project.id, (current) => ({ ...current, notes: event.target.value }))}
          />
        </label>
        <div className="drawer-actions">
          <button type="button" onClick={handleDuplicateProject}>
            Duplicate
          </button>
          <button type="button" className="danger" onClick={handleDeleteProject}>
            Delete Project
          </button>
        </div>
      </section>

      <section className="drawer-section">
        <div className="section-header">
          <h3>Next Actions</h3>
          <button
            type="button"
            onClick={handleSplitTodos}
            disabled={!canCreateSubproject || selectedTodoIds.size === 0}
          >
            Split Selected Todos into Subproject
          </button>
        </div>
        {!canCreateSubproject && <div className="hint">子项目不支持再嵌套</div>}
        <TodoList
          todos={project.next_todos}
          selectedIds={selectedTodoIds}
          onToggleSelect={handleToggleSelectTodo}
          onAddTodo={handleAddTodo}
          onUpdateTodo={handleUpdateTodo}
          onDeleteTodo={handleDeleteTodo}
          onMoveTodo={handleMoveTodo}
        />
      </section>

      <section className="drawer-section">
        <SubprojectList
          subprojects={subprojects}
          onSelect={onSelectProject}
          onCreate={handleCreateSubproject}
          canCreate={canCreateSubproject}
        />
      </section>
    </aside>
  );
};
