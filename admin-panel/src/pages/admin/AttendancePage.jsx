import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import Topbar from '../../components/Topbar';
import api from '../../api/apiClient';

const AttendancePage = ({ logout }) => {
  const [attendance, setAttendance] = useState([]);
  const [dateRange, setDateRange] = useState('');

  useEffect(() => {
    api.get('/attendance/history').then((res) => setAttendance(res.data)).catch(console.error);
  }, []);

  const filtered = attendance.filter((item) => item.date.includes(dateRange));

  return (
    <AdminLayout>
      <Topbar title="Attendance" onLogout={logout} />
      <div className="card-glass p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Attendance Records</h2>
            <p className="text-slate-500">Track check-ins, check-outs and late status.</p>
          </div>
          <input
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            placeholder="Filter by date"
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-separate border-spacing-0">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Check In</th>
                <th className="px-4 py-3">Check Out</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {(filtered.length ? filtered : attendance).map((row) => (
                <tr key={row._id} className="border-b border-slate-200">
                  <td className="px-4 py-4">{row.user?.firstName} {row.user?.lastName}</td>
                  <td className="px-4 py-4">{row.date}</td>
                  <td className="px-4 py-4">{row.checkIn ? new Date(row.checkIn).toLocaleTimeString() : '-'}</td>
                  <td className="px-4 py-4">{row.checkOut ? new Date(row.checkOut).toLocaleTimeString() : '-'}</td>
                  <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs ${row.status === 'late' ? 'bg-amber-100 text-amber-800' : row.status === 'absent' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AttendancePage;
