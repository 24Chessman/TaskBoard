// UsersTable props: users (array from the API), meId (the signed-in admin's id), onRoleChange(user, newRole),
// onDelete(user). A table with avatar and name, email, role badge, joined date and two icon buttons per row
// (change role, delete), both disabled on the admin's own row. The wrapper scrolls sideways on small screens
// and is focusable so a keyboard can scroll it.
import { Trash2, UserCog } from 'lucide-react';
import { formatDate, localDateKey } from '../../utils/dates.js';
import Avatar from '../Avatar.jsx';
import Badge from '../Badge.jsx';
import IconButton from '../IconButton.jsx';

const th = 'px-4 py-3 text-left font-medium text-fg-secondary';

const UsersTable = ({ users, meId, onRoleChange, onDelete }) => (
  <div
    role="region"
    aria-label="Users table, scrolls sideways on small screens"
    tabIndex={0}
    className="overflow-x-auto rounded-lg border border-line bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring"
  >
    <table className="min-w-full divide-y divide-line text-sm">
      <caption className="sr-only">All users</caption>
      <thead className="bg-surface-muted">
        <tr>
          <th scope="col" className={th}>Name</th>
          <th scope="col" className={th}>Email</th>
          <th scope="col" className={th}>Role</th>
          <th scope="col" className={th}>Joined</th>
          <th scope="col" className={`${th} text-right`}>Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {users.map((user) => {
          const isSelf = user._id === meId;
          const isAdmin = user.role === 'admin';
          return (
            <tr key={user._id}>
              <th scope="row" className="whitespace-nowrap px-4 py-3 text-left font-medium text-fg">
                <span className="flex items-center gap-3">
                  <Avatar user={user} size="md" />
                  <span>
                    {user.name}
                    {isSelf && <span className="ml-1 font-normal text-fg-secondary">(you)</span>}
                  </span>
                </span>
              </th>
              <td className="px-4 py-3 text-fg-secondary">{user.email}</td>
              <td className="px-4 py-3">
                <Badge variant={isAdmin ? 'primary' : 'neutral'}>{isAdmin ? 'Admin' : 'User'}</Badge>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-fg-secondary">
                {formatDate(localDateKey(new Date(user.createdAt)))}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <IconButton
                    icon={UserCog}
                    label={isAdmin ? `Make ${user.name} a regular user` : `Make ${user.name} an admin`}
                    disabled={isSelf}
                    onClick={() => onRoleChange(user, isAdmin ? 'user' : 'admin')}
                  />
                  <IconButton
                    icon={Trash2}
                    label={`Delete ${user.name}`}
                    variant="danger"
                    disabled={isSelf}
                    onClick={() => onDelete(user)}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default UsersTable;
