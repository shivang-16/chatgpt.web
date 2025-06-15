
export const users: any[] = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
  },
];

export const tags: any[] = [
  { id: '1', name: 'Research', color: 'bg-[#F6C67B] text-[#1F1D2B]' },
  { id: '2', name: 'Design', color: 'bg-[#7DD1E3] text-[#1F1D2B]' },
  { id: '3', name: 'Development', color: 'bg-[#B18BDD] text-[#1F1D2B]' },
];

export const initialColumns: any[] = [
  {
    id: 'backlog',
    title: 'BACKLOG',
    count: 15,
    tasks: [
      {
        id: '1',
        title: 'Draw interfaces about profile section',
        description: 'High priority',
        priority: 'High',
        date: 'Today',
        assignees: [users[0], users[1]],
      },
      {
        id: '2',
        title: 'Getting user feedback',
        description: 'Low priority',
        priority: 'Low',
        date: 'Tomorrow',
        assignees: [users[2]],
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'IN PROGRESS',
    count: 3,
    tasks: [
      {
        id: '3',
        title: 'Test new prototype',
        description: 'Low priority',
        priority: 'Low',
        date: 'Today',
        assignees: [users[0]],
      },
    ],
  },
  {
    id: 'done',
    title: 'DONE',
    count: 5,
    tasks: [
      {
        id: '4',
        title: 'Change color palette to more bright',
        description: 'High priority',
        priority: 'High',
        date: 'Today',
        assignees: [users[1]],
      },
    ],
  },
  {
    id: 'archived',
    title: 'ARCHIVED',
    count: 2,
    tasks: [
      {
        id: '5',
        title: 'New strategy',
        description: 'Low priority',
        priority: 'Low',
        date: 'Apr 20, 2024',
        assignees: [users[2]],
      },
    ],
  },
];