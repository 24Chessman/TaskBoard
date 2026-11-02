// Profile page (/profile) for the signed-in user: a header block (large avatar, name, email, role, member since)
// and two sections in the Settings pattern (components/profile/): account details (name and email) and change
// password. From 1024px up each section is two columns (title left, form right), below that it stacks.
// The user comes from AuthContext. After a successful save the context user is replaced, so the top bar and
// this header show the new name straight away.
import Avatar from '../components/Avatar.jsx';
import Badge from '../components/Badge.jsx';
import DetailsSection from '../components/profile/DetailsSection.jsx';
import PasswordSection from '../components/profile/PasswordSection.jsx';
import PageHeader from '../components/shell/PageHeader.jsx';
import useAuth from '../hooks/useAuth.js';
import { formatDate, localDateKey } from '../utils/dates.js';

const Profile = () => {
  const { user, updateUser: setSessionUser } = useAuth();

  return (
    <div>
      <PageHeader title="Profile" description="Your account details and password." />
      <div className="flex items-center gap-4 pb-6">
        <span className="[&>span]:h-14 [&>span]:w-14 [&>span]:text-xl">
          <Avatar user={user} size="md" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-fg">{user.name}</p>
          <p className="truncate text-sm text-fg-secondary">{user.email}</p>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-fg-secondary">
            <Badge variant={user.role === 'admin' ? 'primary' : 'neutral'}>
              {user.role === 'admin' ? 'Admin' : 'User'}
            </Badge>
            Member since {formatDate(localDateKey(new Date(user.createdAt)))}
          </p>
        </div>
      </div>
      <div className="divide-y divide-line border-t border-line">
        <DetailsSection user={user} onUpdated={setSessionUser} />
        <PasswordSection user={user} onUpdated={setSessionUser} />
      </div>
    </div>
  );
};

export default Profile;
