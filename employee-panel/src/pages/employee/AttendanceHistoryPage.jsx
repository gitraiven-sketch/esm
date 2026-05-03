import { useEffect, useState } from 'react';
import EmployeeLayout from './EmployeeLayout';
import Topbar from '../../components/Topbar';
import api from '../../api/apiClient';

const AttendanceHistoryPage = ({ logout }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get('/attendance/history').then((res) => setHistory(res.data)).catch(console.error);
  }, []);

  return (
    <EmployeeLayout>
      <Topbar title="Attendance History" onLogout={logout} />
      <div className="card-glass p-6">
        <h2 className="text-xl font-semibold mb-4">Your attendance history</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-separate border-spacing-0">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Check In</th>
                <th className="px-4 py-3">Check Out</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id} className="border-b border-slate-200">
                  <td className="px-4 py-4">{item.date}</td>
                  <td className="px-4 py-4">{item.checkIn ? new Date(item.checkIn).toLocaleTimeString() : '-'}</td>
                  <td className="px-4 py-4">{item.checkOut ? new Date(item.checkOut).toLocaleTimeString() : '-'}</td>
                  <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs ${item.status === 'late' ? 'bg-amber-100 text-amber-800' : item.status === 'absent' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default AttendanceHistoryPage;
