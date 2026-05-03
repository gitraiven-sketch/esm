import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaCalendarCheck, FaHistory, FaBullhorn, FaFileContract, FaClipboardList, FaComments, FaChartLine, FaCog } from 'react-icons/fa';

const menu = [
  { label: 'Dashboard', path: '/employee', icon: FaHome },
  { label: 'Check In/Out', path: '/employee/checkin', icon: FaCalendarCheck },
  { label: 'Attendance', path: '/employee/attendance', icon: FaHistory },
  { label: 'Announcements', path: '/employee/announcements', icon: FaBullhorn },
  { label: 'Contracts', path: '/employee/contracts', icon: FaFileContract },
  { label: 'Leave Requests', path: '/employee/leaves', icon: FaClipboardList },
  { label: 'Chat', path: '/employee/chat', icon: FaComments },
  { label: 'Work Reports', path: '/employee/reports', icon: FaChartLine },
  { label: 'Settings', path: '/employee/settings', icon: FaCog }
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <motion.aside className="w-72 min-h-screen sticky top-0 bg-white/90 backdrop-blur-xl border-r border-slate-200/80 p-6" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
      <div className="mb-10">
        <h2 className="text-xl font-semibold">EMS Employee</h2>
        <p className="text-slate-500">Personal hub for daily work.</p>
      </div>
      <nav className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 rounded-3xl px-4 py-3 transition ${active ? 'bg-primary text-white shadow-lg' : 'text-slate-700 hover:bg-slate-100'}`}>
              <Icon />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
