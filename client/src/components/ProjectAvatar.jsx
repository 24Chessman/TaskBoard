// ProjectAvatar props: name (the project name), size ("sm" | "md" | "lg", default "md"), className.
// A rounded square with the project's initials on a soft colour that depends on the name.
import { colorForName } from '../utils/nameColors.js';
import { getInitials } from './Avatar.jsx';

const sizes = {
  sm: 'h-8 w-8 rounded-md text-xs',
  md: 'h-10 w-10 rounded-lg text-sm',
  lg: 'h-14 w-14 rounded-xl text-lg',
};

const ProjectAvatar = ({ name, size = 'md', className = '' }) => (
  <span
    role="img"
    aria-label={name || 'Project'}
    title={name}
    className={`inline-flex shrink-0 select-none items-center justify-center font-semibold ${sizes[size] || sizes.md} ${colorForName(name)} ${className}`}
  >
    {getInitials(name)}
  </span>
);

export default ProjectAvatar;
