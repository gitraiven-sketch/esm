import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/employee/DashboardPage';
import CheckInPage from './pages/employee/CheckInPage';
import AttendanceHistoryPage from './pages/employee/AttendanceHistoryPage';
import AnnouncementsPage from './pages/employee/AnnouncementsPage';
import ContractsPage from './pages/employee/ContractsPage';
import LeaveRequestsPage from './pages/employee/LeaveRequestsPage';
import ChatPage from './pages/employee/ChatPage';
import WorkReportsPage from './pages/employee/WorkReportsPage';
import SettingsPage from './pages/employee/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { logoutFromFirebase } from './firebase';

function App() {
  const [token, setToken] = useState(localStorage.getItem('ems_employee_token'));
  const location = useLocation();
  const login = (value) => {
    localStorage.setItem('ems_employee_token', value);
    setToken(value);
  };
  const logout = async () => {
    localStorage.removeItem('ems_employee_token');
    setToken(null);
    await logoutFromFirebase();
  };
  const auth = useMemo(() => ({ token, login, logout }), [token]);

  return (
    <div className="min-h-screen bg-surface text-slate-900">
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={login} />} />
            <Route path="/register" element={<RegisterPage onRegister={login} />} />
            <Route path="/employee" element={<ProtectedRoute token={token} />}> 
              <Route index element={<DashboardPage logout={logout} />} />
              <Route path="checkin" element={<CheckInPage logout={logout} />} />
              <Route path="attendance" element={<AttendanceHistoryPage logout={logout} />} />
              <Route path="announcements" element={<AnnouncementsPage logout={logout} />} />
              <Route path="contracts" element={<ContractsPage logout={logout} />} />
              <Route path="leaves" element={<LeaveRequestsPage logout={logout} />} />
              <Route path="chat" element={<ChatPage logout={logout} />} />
              <Route path="reports" element={<WorkReportsPage logout={logout} />} />
              <Route path="settings" element={<SettingsPage logout={logout} />} />
            </Route>
            <Route path="*" element={<Navigate to={token ? '/employee' : '/login'} />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
