import { FaBell, FaSignOutAlt } from 'react-icons/fa';

const Topbar = ({ title, onLogout }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
    <div>
      <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
      <p className="text-slate-500">Your personalized employee workspace.</p>
    </div>
    <div className="flex items-center gap-3">
      <button className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 hover:bg-slate-100 transition flex items-center gap-2">
        <FaBell /> Notifications
      </button>
      <button onClick={onLogout} className="rounded-2xl bg-primary px-4 py-3 text-white hover:bg-darkblue transition flex items-center gap-2">
        <FaSignOutAlt /> Logout
      </button>
    </div>
  </div>
);

export default Topbar;
