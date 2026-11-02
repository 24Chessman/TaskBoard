// Temporary dev page, development only. Shows every shared component and its states. Reachable at
// /dev/components only when import.meta.env.DEV is true (see App.jsx), so it never ships in production builds.
// The sections live in src/dev/ so this file stays short.
import DemoButtons from '../dev/DemoButtons.jsx';
import DemoDisplay from '../dev/DemoDisplay.jsx';
import DemoForms from '../dev/DemoForms.jsx';
import DemoOverlays from '../dev/DemoOverlays.jsx';

const ComponentDemo = () => (
  <div className="space-y-8">
    <h1 className="text-xl font-semibold text-fg">Component demo</h1>
    <DemoButtons />
    <DemoForms />
    <DemoDisplay />
    <DemoOverlays />
  </div>
);

export default ComponentDemo;
