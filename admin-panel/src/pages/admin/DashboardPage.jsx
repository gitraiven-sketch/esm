import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from './AdminLayout';
import Topbar from '../../components/Topbar';
import DashboardCard from '../../components/DashboardCard';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from 'recharts';
import api from '../../api/apiClient';

const DashboardPage = ({ logout }) => {
  const [stats, setStats] = useState({ employees: 0, present: 0, absent: 0, sick: 0, onLeave: 0 });
  const [graph, setGraph] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/reports/dashboard');
        setStats(response.data);
        setGraph([
          { day: 'Mon', value: 30 },
          { day: 'Tue', value: 42 },
          { day: 'Wed', value: 34 },
          { day: 'Thu', value: 48 },
          { day: 'Fri', value: 52 },
          { day: 'Sat', value: 28 }
        ]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <AdminLayout>
      <Topbar title="Admin Dashboard" onLogout={logout} />
      <div className="grid gap-5 xl:grid-cols-5">
        <DashboardCard title="Total Employees" value={stats.employees} detail="Active employees in system" accent="" />
        <DashboardCard title="Present Today" value={stats.present} detail="Checked in and productive" />
        <DashboardCard title="Absent Today" value={stats.absent} detail="Employees currently absent" />
        <DashboardCard title="Sick" value={stats.sick} detail="Employees on sick leave" />
        <DashboardCard title="On Leave" value={stats.onLeave} detail="Employees on approved leave" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <motion.div className="card-glass p-6 xl:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Attendance Trends</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={graph}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#2563EB" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="card-glass p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full rounded-3xl bg-primary px-5 py-4 text-white shadow-lg">Add employee</button>
            <button className="w-full rounded-3xl bg-slate-100 px-5 py-4 text-slate-700">Review leave requests</button>
            <button className="w-full rounded-3xl bg-slate-100 px-5 py-4 text-slate-700">Publish announcement</button>
          </div>
        </motion.div>

        <motion.div className="card-glass p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Summary</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[{ name: 'Present', value: stats.present }, { name: 'Absent', value: stats.absent }, { name: 'Leave', value: stats.onLeave }]}> 
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Bar dataKey="value" fill="#2563EB" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
