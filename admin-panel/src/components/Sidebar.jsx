import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChartLine, FaUserFriends, FaClock, FaCalendarCheck, FaFileContract, FaComments, FaBell, FaCog, FaCheckCircle } from 'react-icons/fa';

const menu = [
  { label: 'Dashboard', path: '/admin', icon: FaChartLine },
  { label: 'Employees', path: '/admin/employees', icon: FaUserFriends },
  { label: 'Approvals', path: '/admin/approvals', icon: FaCheckCircle },
  { label: 'Attendance', path: '/admin/attendance', icon: FaClock },
  { label: 'Leave Requests', path: '/admin/leaves', icon: FaCalendarCheck },
  { label: 'Contracts', path: '/admin/contracts', icon: FaFileContract },
  { label: 'Reports', path: '/admin/reports', icon: FaChartLine },
  { label: 'Chat', path: '/admin/chat', icon: FaComments },
  { label: 'Notifications', path: '/admin/notifications', icon: FaBell },
  { label: 'Settings', path: '/admin/settings', icon: FaCog }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 min-h-screen sticky top-0 bg-white/90 backdrop-blur-xl border-r border-slate-200/80 p-6"
    >
      <div className="mb-10">
        <div className="text-xl font-semibold text-slate-900">EMS Admin</div>
        <p className="text-sm text-slate-500">Enterprise employee management</p>
      </div>
      <nav className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-3xl px-4 py-3 transition ${
                active ? 'bg-primary text-white shadow-lg' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
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
