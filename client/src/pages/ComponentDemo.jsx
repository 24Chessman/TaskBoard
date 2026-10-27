// Temporary dev page, development only
import { useState } from 'react';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Input from '../components/Input.jsx';
import Loader from '../components/Loader.jsx';
import Modal from '../components/Modal.jsx';
import Pagination from '../components/Pagination.jsx';
import Select from '../components/Select.jsx';
import Textarea from '../components/Textarea.jsx';
import { useToast } from '../context/ToastContext.jsx';

const Section = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="text-lg font-semibold">{title}</h2>
    {children}
  </section>
);

const ComponentDemo = () => {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [page, setPage] = useState(1);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Component demo</h1>

      <Section title="Button">
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Form fields">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="max-w-md space-y-4">
            <Input label="Title" placeholder="Task title" />
            <Select label="Priority" defaultValue="medium">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
            <Textarea label="Description" rows={3} />
          </div>
          <div className="max-w-md space-y-4">
            <Input label="Title (error)" error="Title is required" />
            <Select label="Priority (error)" error="Pick a priority">
              <option value="">Select...</option>
              <option value="low">Low</option>
            </Select>
            <Textarea label="Description (error)" rows={3} error="Description is too long" />
          </div>
        </div>
      </Section>

      <Section title="Card">
        <Card>Card content goes here.</Card>
      </Section>

      <Section title="Badge">
        <div className="flex flex-wrap gap-2">
          <Badge>Neutral</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      </Section>

      <Section title="Loader">
        <Loader />
      </Section>

      <Section title="ErrorMessage">
        <ErrorMessage message="Could not load projects." onRetry={() => showToast('Retrying...', 'success')} />
      </Section>

      <Section title="EmptyState">
        <EmptyState
          title="No projects yet"
          message="Create your first project to get started."
          actionLabel="Create project"
          onAction={() => showToast('Create project clicked', 'success')}
        />
      </Section>

      <Section title="Modal and ConfirmDialog">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            Open confirm dialog
          </Button>
        </div>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Demo modal">
          <p className="text-sm text-slate-500">Press Esc or click the overlay to close.</p>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </div>
        </Modal>
        <ConfirmDialog
          isOpen={confirmOpen}
          title="Delete task?"
          message="This cannot be undone."
          onConfirm={() => {
            setConfirmOpen(false);
            showToast('Deleted', 'success');
          }}
          onCancel={() => setConfirmOpen(false)}
        />
      </Section>

      <Section title="Toast">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => showToast('Saved successfully', 'success')}>Success toast</Button>
          <Button variant="danger" onClick={() => showToast('Something went wrong', 'error')}>
            Error toast
          </Button>
        </div>
      </Section>

      <Section title="Pagination">
        <Pagination page={page} totalPages={5} onPageChange={setPage} />
      </Section>
    </div>
  );
};

export default ComponentDemo;
