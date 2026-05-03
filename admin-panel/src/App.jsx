import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { endpoints } from '@shared/config/api';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/admin/DashboardPage';
import EmployeesPage from './pages/admin/EmployeesPage';
import ApprovalsPage from './pages/admin/ApprovalsPage';
import AttendancePage from './pages/admin/AttendancePage';
import LeavePage from './pages/admin/LeavePage';
import ContractsPage from './pages/admin/ContractsPage';
import ReportsPage from './pages/admin/ReportsPage';
import ChatPage from './pages/admin/ChatPage';
import NotificationsPage from './pages/admin/NotificationsPage';
import SettingsPage from './pages/admin/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [token, setToken] = useState(localStorage.getItem('ems_admin_token'));
  const location = useLocation();

  const auth = useMemo(() => ({ token, setToken }), [token]);

  const login = (tokenValue) => {
    localStorage.setItem('ems_admin_token', tokenValue);
    setToken(tokenValue);
  };

  const logout = () => {
    localStorage.removeItem('ems_admin_token');
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-surface text-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={login} />} />
            <Route path="/register" element={<RegisterPage onLogin={login} />} />
            <Route path="/admin" element={<ProtectedRoute token={token} />}> 
              <Route index element={<DashboardPage logout={logout} />} />
              <Route path="employees" element={<EmployeesPage logout={logout} />} />
              <Route path="approvals" element={<ApprovalsPage logout={logout} />} />
              <Route path="attendance" element={<AttendancePage logout={logout} />} />
              <Route path="leaves" element={<LeavePage logout={logout} />} />
              <Route path="contracts" element={<ContractsPage logout={logout} />} />
              <Route path="reports" element={<ReportsPage logout={logout} />} />
              <Route path="chat" element={<ChatPage logout={logout} />} />
              <Route path="notifications" element={<NotificationsPage logout={logout} />} />
              <Route path="settings" element={<SettingsPage logout={logout} />} />
            </Route>
            <Route path="*" element={<Navigate to={token ? '/admin' : '/login'} />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
