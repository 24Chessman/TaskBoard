// Temporary dev page, development only: form fields in their normal, icon, error and disabled states.
import { useState } from 'react';
import { Search } from 'lucide-react';
import Input from '../components/Input.jsx';
import Select from '../components/Select.jsx';
import Textarea from '../components/Textarea.jsx';
import Section from './Section.jsx';

const DemoForms = () => {
  const [text, setText] = useState('');

  return (
    <Section title="Form fields">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <Input label="Name" placeholder="Task title" />
          <Input label="Search" leadingIcon={Search} type="search" placeholder="Search projects" />
          <Select label="Priority" defaultValue="medium">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
          <Textarea label="Description" rows={3} value={text} onChange={(event) => setText(event.target.value)} />
          <Input label="Disabled" disabled defaultValue="Cannot edit" />
        </div>
        <div className="space-y-4">
          <Input label="Name (error)" error="Name is required" />
          <Input label="Search (error)" leadingIcon={Search} error="Enter at least 2 characters" />
          <Select label="Priority (error)" error="Pick a priority">
            <option value="">Select...</option>
            <option value="low">Low</option>
          </Select>
          <Textarea label="Description (error)" rows={3} error="Description is too long" />
        </div>
      </div>
    </Section>
  );
};

export default DemoForms;
