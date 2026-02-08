import { Project } from '../types';

interface SubprojectListProps {
  subprojects: Project[];
  onSelect: (id: string) => void;
  onCreate: () => void;
  canCreate: boolean;
}

export const SubprojectList = ({ subprojects, onSelect, onCreate, canCreate }: SubprojectListProps) => {
  return (
    <div className="subproject-section">
      <div className="subproject-header">
        <h4>Subprojects</h4>
        <button type="button" onClick={onCreate} disabled={!canCreate}>
          Create Subproject
        </button>
      </div>
      {!canCreate && <div className="hint">子项目不支持再嵌套</div>}
      <ul className="subproject-list">
        {subprojects.length === 0 && <li className="empty">暂无子项目</li>}
        {subprojects.map((subproject) => (
          <li key={subproject.id} onClick={() => onSelect(subproject.id)}>
            <div className="subproject-title">{subproject.title}</div>
            <div className="subproject-meta">
              <span>{subproject.status}</span>
              <span>P{subproject.priority.toFixed(1)}</span>
              <span>Todos: {subproject.next_todos.filter((todo) => !todo.done).length}</span>
              <span>更新 {subproject.updated_at}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
