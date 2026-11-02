// Temporary dev page, development only: buttons and icon buttons in every variant, size and state.
import { Pencil, Plus, RefreshCw, Trash2, X } from 'lucide-react';
import Button from '../components/Button.jsx';
import IconButton from '../components/IconButton.jsx';
import Section from './Section.jsx';

const DemoButtons = () => (
  <>
    <Section title="Button: variants">
      <div className="flex flex-wrap gap-2">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </Section>

    <Section title="Button: sizes, left icon, loading, disabled">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button leftIcon={Plus}>Add task</Button>
        <Button variant="secondary" leftIcon={RefreshCw} size="sm">
          Refresh
        </Button>
        <Button variant="danger" leftIcon={Trash2}>
          Delete
        </Button>
        <Button loading>Saving</Button>
        <Button disabled>Disabled</Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
      </div>
    </Section>

    <Section title="IconButton: always has a label (tooltip and screen reader name)">
      <div className="flex flex-wrap items-center gap-2">
        <IconButton icon={Pencil} label="Edit" />
        <IconButton icon={Trash2} label="Delete" />
        <IconButton icon={RefreshCw} label="Refresh" />
        <IconButton icon={X} label="Close" size="sm" />
        <IconButton icon={Plus} label="Add" variant="primary" />
        <IconButton icon={Plus} label="Add (secondary)" variant="secondary" />
        <IconButton icon={Trash2} label="Delete (danger)" variant="danger" />
        <IconButton icon={Pencil} label="Edit (disabled)" disabled />
      </div>
    </Section>
  </>
);

export default DemoButtons;
