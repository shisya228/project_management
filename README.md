# Project Cockpit

Project Cockpit 是一个基于 Vite + React + TypeScript 的个人项目管理 SPA。它提供 Kanban 视图、项目详情编辑、Next TODO 管理、子项目拆分、以及本地数据导入导出能力。

## 功能概览

- Kanban 主视图（仅展示顶层项目）
- 详情面板：编辑标题、描述、状态、优先级、成本/价值等字段
- Next TODO 管理：新增、编辑、完成、删除、排序、批量选择
- 子项目管理（仅一层）
- Split Selected Todos into Subproject
- localStorage 持久化 + JSON 导入导出

## 安装依赖

```bash
npm install
```

## 启动开发环境

```bash
npm run dev
```

## 构建

```bash
npm run build
```

## 数据持久化

- 应用启动时优先读取 `localStorage`。
- 如果没有数据，则加载内置示例数据（含 12 个顶层项目 + 4 个子项目）。

## 导入 / 导出说明

- **导入**：点击 `Import JSON`，选择 `AppData` 格式的 JSON 文件。导入会覆盖当前数据并写入 localStorage，导入时有二次确认。
- **导出**：点击 `Export JSON` 直接下载 `projects.json`。

## 数据格式（AppData）

```json
{
  "version": 1,
  "updated_at": "YYYY-MM-DD",
  "projects": [
    {
      "id": "string",
      "parent_id": "string | null",
      "title": "string",
      "description": "string",
      "status": "backlog | next | doing | waiting | done | archived",
      "horizon": "core | platform | explore",
      "area": ["AI", "Knowledge"],
      "priority": 0,
      "cost": 1,
      "value": 1,
      "leverage": 1,
      "certainty": 1,
      "next_todos": [
        {
          "id": "string",
          "text": "string",
          "done": false,
          "order": 1,
          "created_at": "YYYY-MM-DD",
          "updated_at": "YYYY-MM-DD",
          "note": "string"
        }
      ],
      "updated_at": "YYYY-MM-DD",
      "notes": "string"
    }
  ]
}
```

## 关键交互规则

- Kanban 只展示 `parent_id === null` 的顶层项目。
- 子项目只能在父项目详情面板中创建与管理，子项目不能再创建子项目。
- 修改项目或 todo 时会更新对应项目的 `updated_at` 和 AppData 的 `updated_at`。
- 删除父项目时，会同时删除其子项目。
