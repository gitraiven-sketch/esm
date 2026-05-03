import AdminLayout from './AdminLayout';
import Topbar from '../../components/Topbar';
import { useState } from 'react';

const SettingsPage = ({ logout }) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <AdminLayout>
      <Topbar title="Settings" onLogout={logout} />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-glass p-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <input placeholder="First name" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
            <input placeholder="Last name" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
            <input placeholder="Email" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
            <button className="rounded-3xl bg-primary px-5 py-3 text-white">Save profile</button>
          </div>
        </div>
        <div className="card-glass p-6">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
              <span>Dark mode</span>
              <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            </label>
            <label className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
              <span>Email notifications</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
              <span>Realtime alerts</span>
              <input type="checkbox" defaultChecked />
            </label>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
