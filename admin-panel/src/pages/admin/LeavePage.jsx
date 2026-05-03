import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import Topbar from '../../components/Topbar';
import api from '../../api/apiClient';

const LeavePage = ({ logout }) => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    api.get('/leaves').then((res) => setLeaves(res.data)).catch(console.error);
  }, []);

  const updateStatus = async (id, url) => {
    try {
      const res = await api.put(url);
      setLeaves(leaves.map((item) => (item._id === id ? res.data : item)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <Topbar title="Leave Requests" onLogout={logout} />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="card-glass p-6">
          <h2 className="text-xl font-semibold mb-4">Pending leave requests</h2>
          <div className="space-y-4">
            {leaves.map((leave) => (
              <div key={leave._id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{leave.user?.firstName} {leave.user?.lastName}</h3>
                    <p className="text-slate-500">{leave.type} leave · {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs ${leave.status === 'pending' ? 'bg-amber-100 text-amber-800' : leave.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{leave.status}</span>
                </div>
                <p className="mt-3 text-slate-600">{leave.reason}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {leave.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(leave._id, `/leaves/approve/${leave._id}`)} className="rounded-3xl bg-emerald-500 px-4 py-2 text-white">Approve</button>
                      <button onClick={() => updateStatus(leave._id, `/leaves/reject/${leave._id}`)} className="rounded-3xl bg-red-500 px-4 py-2 text-white">Reject</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card-glass p-6">
          <h3 className="text-lg font-semibold mb-3">Leave reports</h3>
          <div className="space-y-4 text-slate-600">
            <p>Monitor requests from all employees.</p>
            <p>Filter by pending, approved or rejected status.</p>
            <p>Use notifications to keep teams aligned.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LeavePage;
