import { AppData } from './types';
import { todayISO } from './utils/date';

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
};

export const sampleData: AppData = {
  version: 1,
  updated_at: todayISO(),
  projects: [
    {
      id: 'p-alpha',
      parent_id: null,
      title: 'AI Research Cockpit',
      description: 'Build internal AI research tracker for experiments.',
      status: 'doing',
      horizon: 'core',
      area: ['AI', 'Knowledge'],
      priority: 8.6,
      cost: 3,
      value: 5,
      leverage: 4,
      certainty: 3,
      next_todos: [
        {
          id: 't-alpha-1',
          text: 'Audit model benchmark datasets',
          done: false,
          order: 1,
          created_at: daysAgo(10),
          updated_at: daysAgo(2),
          note: 'Focus on eval coverage and bias.'
        },
        {
          id: 't-alpha-2',
          text: 'Draft evaluation rubric',
          done: false,
          order: 2,
          created_at: daysAgo(8),
          updated_at: daysAgo(4),
          note: ''
        },
        {
          id: 't-alpha-3',
          text: 'Sync with infra team on GPU allocation',
          done: true,
          order: 3,
          created_at: daysAgo(6),
          updated_at: daysAgo(1),
          note: 'Confirmed availability next week.'
        }
      ],
      updated_at: daysAgo(2),
      notes: 'Stakeholders want a weekly summary.'
    },
    {
      id: 'p-beta',
      parent_id: null,
      title: 'Platform Observability Upgrade',
      description: 'Improve logs and tracing for core services.',
      status: 'doing',
      horizon: 'platform',
      area: ['Infra', 'Reliability'],
      priority: 7.4,
      cost: 4,
      value: 5,
      leverage: 5,
      certainty: 4,
      next_todos: [
        {
          id: 't-beta-1',
          text: 'Map critical services with missing traces',
          done: false,
          order: 1,
          created_at: daysAgo(5),
          updated_at: daysAgo(3),
          note: ''
        },
        {
          id: 't-beta-2',
          text: 'Define SLO dashboard layout',
          done: false,
          order: 2,
          created_at: daysAgo(4),
          updated_at: daysAgo(3),
          note: 'Include error budget view.'
        },
        {
          id: 't-beta-3',
          text: 'Pilot new alert routing rules',
          done: false,
          order: 3,
          created_at: daysAgo(2),
          updated_at: daysAgo(1),
          note: ''
        }
      ],
      updated_at: daysAgo(3),
      notes: ''
    },
    {
      id: 'p-gamma',
      parent_id: null,
      title: 'Knowledge Base Redesign',
      description: 'Revamp internal knowledge base navigation.',
      status: 'next',
      horizon: 'core',
      area: ['Knowledge', 'Design'],
      priority: 6.2,
      cost: 2,
      value: 4,
      leverage: 3,
      certainty: 4,
      next_todos: [
        {
          id: 't-gamma-1',
          text: 'Interview 3 power users',
          done: false,
          order: 1,
          created_at: daysAgo(9),
          updated_at: daysAgo(7),
          note: ''
        }
      ],
      updated_at: daysAgo(9),
      notes: 'Need quick win on search.'
    },
    {
      id: 'p-delta',
      parent_id: null,
      title: 'Explore AI Pairing',
      description: 'Investigate AI pair programming pilot.',
      status: 'backlog',
      horizon: 'explore',
      area: ['AI', 'DevEx'],
      priority: 5.1,
      cost: 3,
      value: 3,
      leverage: 2,
      certainty: 2,
      next_todos: [],
      updated_at: daysAgo(15),
      notes: ''
    },
    {
      id: 'p-epsilon',
      parent_id: null,
      title: 'Customer Insight Sync',
      description: 'Monthly survey analysis and insights.',
      status: 'waiting',
      horizon: 'core',
      area: ['Research'],
      priority: 4.3,
      cost: 1,
      value: 3,
      leverage: 2,
      certainty: 4,
      next_todos: [
        {
          id: 't-epsilon-1',
          text: 'Collect March survey results',
          done: true,
          order: 1,
          created_at: daysAgo(20),
          updated_at: daysAgo(12),
          note: ''
        }
      ],
      updated_at: daysAgo(12),
      notes: ''
    },
    {
      id: 'p-zeta',
      parent_id: null,
      title: 'Security Review Cycle',
      description: 'Quarterly security assessments.',
      status: 'done',
      horizon: 'platform',
      area: ['Security'],
      priority: 6.8,
      cost: 4,
      value: 5,
      leverage: 3,
      certainty: 5,
      next_todos: [],
      updated_at: daysAgo(1),
      notes: 'Report delivered.'
    },
    {
      id: 'p-eta',
      parent_id: null,
      title: 'Infrastructure Cost Review',
      description: 'Optimize cloud spend across services.',
      status: 'next',
      horizon: 'platform',
      area: ['Infra', 'Finance'],
      priority: 7.9,
      cost: 3,
      value: 4,
      leverage: 4,
      certainty: 3,
      next_todos: [
        {
          id: 't-eta-1',
          text: 'Review top 10 cost drivers',
          done: false,
          order: 1,
          created_at: daysAgo(6),
          updated_at: daysAgo(4),
          note: ''
        }
      ],
      updated_at: daysAgo(4),
      notes: ''
    },
    {
      id: 'p-theta',
      parent_id: null,
      title: 'Partner API v2',
      description: 'Plan v2 for partner APIs.',
      status: 'backlog',
      horizon: 'core',
      area: ['Platform', 'Integrations'],
      priority: 5.7,
      cost: 4,
      value: 4,
      leverage: 3,
      certainty: 2,
      next_todos: [],
      updated_at: daysAgo(11),
      notes: ''
    },
    {
      id: 'p-iota',
      parent_id: null,
      title: 'Customer Success Playbooks',
      description: 'Refresh onboarding playbooks.',
      status: 'waiting',
      horizon: 'core',
      area: ['Customer Success'],
      priority: 3.9,
      cost: 2,
      value: 3,
      leverage: 2,
      certainty: 4,
      next_todos: [],
      updated_at: daysAgo(5),
      notes: ''
    },
    {
      id: 'p-kappa',
      parent_id: null,
      title: 'Explore Knowledge Graph',
      description: 'Prototype knowledge graph for docs.',
      status: 'archived',
      horizon: 'explore',
      area: ['AI', 'Knowledge'],
      priority: 2.3,
      cost: 2,
      value: 2,
      leverage: 2,
      certainty: 1,
      next_todos: [],
      updated_at: daysAgo(30),
      notes: 'Archived until Q4.'
    },
    {
      id: 'p-lambda',
      parent_id: null,
      title: 'Team Enablement Sprint',
      description: 'Enablement sessions for new tooling.',
      status: 'done',
      horizon: 'platform',
      area: ['DevEx'],
      priority: 4.8,
      cost: 2,
      value: 3,
      leverage: 3,
      certainty: 4,
      next_todos: [],
      updated_at: daysAgo(2),
      notes: ''
    },
    {
      id: 'p-mu',
      parent_id: null,
      title: 'AI Documentation Assistant',
      description: 'Build assistant for documentation search.',
      status: 'next',
      horizon: 'core',
      area: ['AI', 'Docs'],
      priority: 6.9,
      cost: 3,
      value: 4,
      leverage: 4,
      certainty: 3,
      next_todos: [
        {
          id: 't-mu-1',
          text: 'Define success metrics',
          done: false,
          order: 1,
          created_at: daysAgo(7),
          updated_at: daysAgo(6),
          note: ''
        },
        {
          id: 't-mu-2',
          text: 'Prototype retrieval flow',
          done: false,
          order: 2,
          created_at: daysAgo(6),
          updated_at: daysAgo(5),
          note: ''
        },
        {
          id: 't-mu-3',
          text: 'Prepare user testing script',
          done: false,
          order: 3,
          created_at: daysAgo(5),
          updated_at: daysAgo(4),
          note: ''
        }
      ],
      updated_at: daysAgo(4),
      notes: ''
    },
    {
      id: 'p-alpha-sub1',
      parent_id: 'p-alpha',
      title: 'Dataset Expansion',
      description: 'Add domain-specific datasets.',
      status: 'next',
      horizon: 'core',
      area: ['AI'],
      priority: 6.1,
      cost: 2,
      value: 4,
      leverage: 3,
      certainty: 3,
      next_todos: [
        {
          id: 't-alpha-sub1-1',
          text: 'Collect finance datasets',
          done: false,
          order: 1,
          created_at: daysAgo(3),
          updated_at: daysAgo(2),
          note: ''
        }
      ],
      updated_at: daysAgo(2),
      notes: ''
    },
    {
      id: 'p-alpha-sub2',
      parent_id: 'p-alpha',
      title: 'Evaluation Dashboard',
      description: 'Dashboard for tracking eval runs.',
      status: 'backlog',
      horizon: 'core',
      area: ['AI', 'Platform'],
      priority: 5.4,
      cost: 3,
      value: 4,
      leverage: 3,
      certainty: 2,
      next_todos: [],
      updated_at: daysAgo(8),
      notes: ''
    },
    {
      id: 'p-beta-sub1',
      parent_id: 'p-beta',
      title: 'Log Schema Alignment',
      description: 'Standardize log metadata for services.',
      status: 'doing',
      horizon: 'platform',
      area: ['Infra'],
      priority: 6.7,
      cost: 3,
      value: 4,
      leverage: 4,
      certainty: 3,
      next_todos: [
        {
          id: 't-beta-sub1-1',
          text: 'Align service owners on schema',
          done: false,
          order: 1,
          created_at: daysAgo(4),
          updated_at: daysAgo(2),
          note: ''
        }
      ],
      updated_at: daysAgo(2),
      notes: ''
    },
    {
      id: 'p-mu-sub1',
      parent_id: 'p-mu',
      title: 'Prototype UX Flow',
      description: 'Validate UX for assistant.',
      status: 'next',
      horizon: 'core',
      area: ['AI', 'Design'],
      priority: 5.8,
      cost: 2,
      value: 4,
      leverage: 3,
      certainty: 3,
      next_todos: [
        {
          id: 't-mu-sub1-1',
          text: 'Sketch user journey',
          done: false,
          order: 1,
          created_at: daysAgo(5),
          updated_at: daysAgo(4),
          note: ''
        }
      ],
      updated_at: daysAgo(4),
      notes: ''
    }
  ]
};
