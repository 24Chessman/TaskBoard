// ProductRows (no props): the four alternating feature rows (Board, Task details, Roles, Activity) and the one
// line about the dashboard. Each row has an outcome h2, a short paragraph, plain facts and a decorative mock.
// The rows with ids "product" and "roles" are the targets of the header links.
import ActivityMock from './mocks/ActivityMock.jsx';
import BoardMock from './mocks/BoardMock.jsx';
import DrawerMock from './mocks/DrawerMock.jsx';
import RolesMock from './mocks/RolesMock.jsx';
import FeatureRow from './FeatureRow.jsx';

const ProductRows = () => (
  <>
    <FeatureRow
      id="product"
      title="See every task in its column"
      text="Tasks move through To Do, In Progress, Review and Done. Search or filter by priority, assignee, label and due date, and the filters stay in the address bar."
      facts={[
        'Priority, labels, due date and assignee on every card',
        'Overdue tasks are marked in red with an icon and the word Overdue',
        'Filter and search without leaving the board',
      ]}
      mock={<BoardMock showFilters columnIds={['todo', 'in_progress']} />}
    />
    <FeatureRow
      title="Everything about a task in one place"
      text="Open a task to edit its details and read the discussion in one view. Comments show who wrote them and when."
      facts={['Status, priority, assignee, labels and due date', 'Comments with the author and the time', 'Deleting a task asks you to confirm']}
      mock={<DrawerMock />}
      reverse
    />
    <FeatureRow
      id="roles"
      title="Owners decide, members do"
      text="Whoever creates a project owns it. Owners manage settings and members, members work on tasks, and admins can open every project and manage users."
      facts={[
        'A project always keeps at least one owner',
        'The server checks permissions too, not only the page',
        'Admins can change roles and remove users',
      ]}
      mock={<RolesMock />}
    />
    <FeatureRow
      title="A history nobody has to write"
      text="Task, comment and member changes are recorded as they happen, newest first and grouped by day."
      facts={['Who did what, with a relative time', 'The full date and time on hover', 'Twenty entries per page, with page links']}
      mock={<ActivityMock />}
      reverse
    />
    <p className="mx-auto max-w-7xl px-4 pb-16 text-sm text-fg-secondary sm:px-6 lg:px-8">Dashboard charts are on the way.</p>
  </>
);

export default ProductRows;
