import { useEffect, useMemo, useRef, useState } from 'react';
import { KanbanBoard } from './components/KanbanBoard';
import { ProjectDrawer } from './components/ProjectDrawer';
import { STATUS_ORDER, STATUS_LABELS, HORIZON_LABELS } from './constants';
import { useAppData, buildEmptyProject } from './store/useAppData';
import { Project } from './types';

const matchesSearch = (project: Project, query: string) => {
  const value = `${project.title} ${project.description} ${project.notes}`.toLowerCase();
  return value.includes(query.toLowerCase());
};

const App = () => {
  const { appData, addProject, updateProject, importData, exportData, resetSample } = useAppData();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [horizonFilter, setHorizonFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<'priority' | 'updated_at'>('priority');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const topLevelProjects = useMemo(
    () => appData.projects.filter((project) => project.parent_id === null),
    [appData.projects],
  );

  const allAreas = useMemo(() => {
    const areaSet = new Set<string>();
    appData.projects.forEach((project) => project.area.forEach((area) => areaSet.add(area)));
    return Array.from(areaSet).sort();
  }, [appData.projects]);

  const filteredProjects = useMemo(() => {
    return topLevelProjects
      .filter((project) => (searchQuery ? matchesSearch(project, searchQuery) : true))
      .filter((project) => (statusFilter === 'all' ? true : project.status === statusFilter))
      .filter((project) => (horizonFilter === 'all' ? true : project.horizon === horizonFilter))
      .filter((project) => (areaFilter === 'all' ? true : project.area.includes(areaFilter)))
      .sort((a, b) => {
        if (sortKey === 'priority') {
          return b.priority - a.priority;
        }
        return b.updated_at.localeCompare(a.updated_at);
      });
  }, [topLevelProjects, searchQuery, statusFilter, horizonFilter, areaFilter, sortKey]);

  const doingCount = topLevelProjects.filter((project) => project.status === 'doing').length;

  const selectedProject = appData.projects.find((project) => project.id === selectedProjectId) ?? null;

  useEffect(() => {
    if (selectedProjectId && !selectedProject) {
      setSelectedProjectId(null);
    }
  }, [selectedProjectId, selectedProject]);

  const handleCreateProject = () => {
    const newProject = addProject(buildEmptyProject(null));
    setSelectedProjectId(newProject.id);
  };

  const handleImport = async (file: File) => {
    const confirmed = window.confirm('导入将覆盖当前数据，确定继续吗？');
    if (!confirmed) return;
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      importData(parsed);
      setSelectedProjectId(null);
    } catch (error) {
      alert('导入失败：JSON 格式或字段不正确。');
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'projects.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleResetSample = () => {
    if (!window.confirm('确定重置为示例数据吗？')) return;
    resetSample();
    setSelectedProjectId(null);
  };

  const handleMoveProject = (projectId: string, status: Project['status']) => {
    updateProject(projectId, (current) => ({ ...current, status }));
  };

  return (
    <div className="app">
      <header className="toolbar">
        <div className="toolbar-left">
          <h1>Project Cockpit</h1>
          <button type="button" onClick={handleCreateProject}>
            New Project
          </button>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All Status</option>
            {STATUS_ORDER.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          <select value={horizonFilter} onChange={(event) => setHorizonFilter(event.target.value)}>
            <option value="all">All Horizon</option>
            {Object.entries(HORIZON_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select value={areaFilter} onChange={(event) => setAreaFilter(event.target.value)}>
            <option value="all">All Area</option>
            {allAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          <select value={sortKey} onChange={(event) => setSortKey(event.target.value as 'priority' | 'updated_at')}>
            <option value="priority">Sort: Priority</option>
            <option value="updated_at">Sort: Updated</option>
          </select>
        </div>
        <div className="toolbar-right">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="file-input"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                handleImport(file);
              }
              event.target.value = '';
            }}
          />
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            Import JSON
          </button>
          <button type="button" onClick={handleExport}>
            Export JSON
          </button>
          <button type="button" onClick={handleResetSample}>
            Reset Sample
          </button>
        </div>
      </header>

      {doingCount > 1 && (
        <div className="wip-warning">⚠️ Doing 列项目超过 1，请注意 WIP 限制。</div>
      )}

      <main className="main">
        <KanbanBoard
          projects={filteredProjects}
          onSelectProject={(id) => setSelectedProjectId(id)}
          onMoveProject={handleMoveProject}
        />
      </main>

      <ProjectDrawer
        project={selectedProject}
        onClose={() => setSelectedProjectId(null)}
        onSelectProject={(id) => setSelectedProjectId(id)}
      />
    </div>
  );
};

export default App;
