// Fake, generic sample data for the landing page mocks. Nothing here is a real customer, project or number.
export const PEOPLE = {
  ava: { name: 'Ava Chen' },
  sam: { name: 'Sam Okoye' },
  lee: { name: 'Lee Park' },
};

export const BOARD_COLUMNS = [
  {
    id: 'todo',
    title: 'To Do',
    cards: [
      { title: 'Draft homepage copy', priority: 'medium', labels: ['content'], due: 'Nov 5', who: PEOPLE.ava },
      { title: 'Audit old docs pages', priority: 'low', labels: ['docs'], due: 'Nov 9', who: PEOPLE.sam },
    ],
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    cards: [
      { title: 'Set up analytics', priority: 'high', labels: ['infra'], due: 'Nov 4', who: PEOPLE.lee },
      { title: 'Design pricing table', priority: 'medium', labels: ['design', 'content'], due: 'Nov 7', who: PEOPLE.ava },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [{ title: 'Choose hosting plan', priority: 'low', labels: ['infra'], due: 'Oct 28', who: PEOPLE.sam }],
  },
];
