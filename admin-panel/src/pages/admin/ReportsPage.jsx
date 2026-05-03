import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import Topbar from '../../components/Topbar';
import api from '../../api/apiClient';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

const ReportsPage = ({ logout }) => {
  const [attendance, setAttendance] = useState([]);
  const [performance, setPerformance] = useState([]);

  useEffect(() => {
    api.get('/reports/attendance').then((res) => setAttendance(res.data)).catch(console.error);
    api.get('/reports/performance').then((res) => setPerformance(res.data.chart)).catch(console.error);
  }, []);

  return (
    <AdminLayout>
      <Topbar title="Reports" onLogout={logout} />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card-glass p-6">
          <h2 className="text-xl font-semibold mb-4">Weekly Attendance</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={attendance}> 
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="_id" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Bar dataKey="count" fill="#2563EB" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card-glass p-6">
          <h2 className="text-xl font-semibold mb-4">Performance Breakdown</h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={performance} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} fill="#2563EB" label>
                {performance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#2563EB', '#60A5FA', '#1E3A8A'][index % 3]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;
