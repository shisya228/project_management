import { useMemo, useState } from 'react';
import { TodoItem } from '../types';

interface TodoListProps {
  todos: TodoItem[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onAddTodo: (text: string) => void;
  onUpdateTodo: (id: string, updates: Partial<TodoItem>) => void;
  onDeleteTodo: (id: string) => void;
  onMoveTodo: (id: string, direction: 'up' | 'down') => void;
}

export const TodoList = ({
  todos,
  selectedIds,
  onToggleSelect,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
  onMoveTodo
}: TodoListProps) => {
  const [newTodoText, setNewTodoText] = useState('');
  const sortedTodos = useMemo(() => [...todos].sort((a, b) => a.order - b.order), [todos]);

  return (
    <div className="todo-section">
      <div className="todo-add">
        <input
          type="text"
          value={newTodoText}
          onChange={(event) => setNewTodoText(event.target.value)}
          placeholder="新增 todo..."
        />
        <button
          type="button"
          onClick={() => {
            if (!newTodoText.trim()) return;
            onAddTodo(newTodoText.trim());
            setNewTodoText('');
          }}
        >
          Add
        </button>
      </div>
      <div className="todo-count">未完成: {sortedTodos.filter((todo) => !todo.done).length}</div>
      <ul className="todo-list">
        {sortedTodos.map((todo, index) => (
          <li key={todo.id} className={`todo-item ${todo.done ? 'done' : ''}`}>
            <div className="todo-main">
              <input
                type="checkbox"
                checked={selectedIds.has(todo.id)}
                onChange={() => onToggleSelect(todo.id)}
                aria-label="Select for split"
              />
              <input
                type="checkbox"
                checked={todo.done}
                onChange={(event) => onUpdateTodo(todo.id, { done: event.target.checked })}
                aria-label="Mark done"
              />
              <input
                type="text"
                value={todo.text}
                onChange={(event) => onUpdateTodo(todo.id, { text: event.target.value })}
              />
            </div>
            <textarea
              value={todo.note}
              onChange={(event) => onUpdateTodo(todo.id, { note: event.target.value })}
              placeholder="备注..."
            />
            <div className="todo-actions">
              <button type="button" onClick={() => onMoveTodo(todo.id, 'up')} disabled={index === 0}>
                ↑
              </button>
              <button
                type="button"
                onClick={() => onMoveTodo(todo.id, 'down')}
                disabled={index === sortedTodos.length - 1}
              >
                ↓
              </button>
              <button type="button" onClick={() => onDeleteTodo(todo.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
