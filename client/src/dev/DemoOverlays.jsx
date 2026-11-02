// Temporary dev page, development only: modal, confirm dialog, toasts, drawer, dropdown menu and pagination.
import { useState } from 'react';
import { LogOut, Settings, Trash2, User } from 'lucide-react';
import Avatar from '../components/Avatar.jsx';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Drawer from '../components/Drawer.jsx';
import Dropdown from '../components/Dropdown.jsx';
import Modal from '../components/Modal.jsx';
import Pagination from '../components/Pagination.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Section from './Section.jsx';

const me = { _id: 'me', name: 'Naitik Sutariya' };

const DemoOverlays = () => {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [drawer, setDrawer] = useState(null); // null | 'right' | 'left'
  const [page, setPage] = useState(1);

  const menuItems = [
    { label: 'Profile', icon: User, onSelect: () => showToast('Profile selected', 'success') },
    { label: 'Settings', icon: Settings, onSelect: () => showToast('Settings selected', 'success') },
    { label: 'Not available', icon: Settings, disabled: true },
    { type: 'separator' },
    { label: 'Log out', icon: LogOut, onSelect: () => showToast('Logged out (demo)', 'error') },
  ];

  return (
    <>
      <Section title="Modal and ConfirmDialog (Tab stays inside, Esc closes the top one)">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          <Button variant="danger" leftIcon={Trash2} onClick={() => setConfirmOpen(true)}>
            Open confirm dialog
          </Button>
        </div>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Demo modal">
          <p className="text-sm text-fg-secondary">Press Tab to move around, Esc or click the overlay to close.</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmOpen(true)}>
              Open a dialog on top
            </Button>
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
          <Button variant="secondary" onClick={() => showToast('Something went wrong. Please try again.', 'error')}>
            Error toast
          </Button>
        </div>
      </Section>

      <Section title="Drawer (full width on phones, up to 720px on desktop)">
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setDrawer('right')}>
            Open drawer (right)
          </Button>
          <Button variant="secondary" onClick={() => setDrawer('left')}>
            Open drawer (left)
          </Button>
        </div>
        <Drawer isOpen={drawer !== null} onClose={() => setDrawer(null)} title="Demo drawer" side={drawer || 'right'}>
          <div className="space-y-4">
            <p className="text-sm text-fg-secondary">Focus stays inside while the drawer is open. Esc closes only the top layer.</p>
            <Dropdown label="Drawer menu" triggerContent="Menu inside the drawer" triggerClassName="rounded-md border border-line px-3 py-1.5 text-sm" items={menuItems} align="start" />
            <Button onClick={() => setDrawer(null)}>Close</Button>
          </div>
        </Drawer>
      </Section>

      <Section title="Dropdown menu (arrow keys, Home, End, Esc, outside click)">
        <Dropdown
          label="Open user menu"
          triggerContent={<Avatar user={me} size="md" />}
          triggerClassName="rounded-full"
          header={
            <div>
              <p className="text-sm font-medium text-fg">Naitik Sutariya</p>
              <p className="text-xs text-fg-muted">naitik@example.com</p>
              <Badge variant="primary" className="mt-1">
                Admin
              </Badge>
            </div>
          }
          items={menuItems}
        />
      </Section>

      <Section title="Pagination">
        <Pagination page={page} totalPages={5} onPageChange={setPage} />
      </Section>
    </>
  );
};

export default DemoOverlays;
