import { useEffect, useState } from 'react';
import EmployeeLayout from './EmployeeLayout';
import Topbar from '../../components/Topbar';
import api from '../../api/apiClient';

const LeaveRequestsPage = ({ logout }) => {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ type: 'paid', startDate: '', endDate: '', reason: '' });

  useEffect(() => {
    api.get('/leaves').then((res) => setRequests(res.data)).catch(console.error);
  }, []);

  const submitRequest = async () => {
    try {
      const res = await api.post('/leaves/request', form);
      setRequests([res.data, ...requests]);
      setForm({ type: 'paid', startDate: '', endDate: '', reason: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <EmployeeLayout>
      <Topbar title="Leave Requests" onLogout={logout} />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="card-glass p-6">
          <h2 className="text-xl font-semibold mb-4">Submit a leave request</h2>
          <div className="grid gap-4">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
              <option value="paid">Paid leave</option>
              <option value="sick">Sick leave</option>
              <option value="unpaid">Unpaid leave</option>
            </select>
            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
            <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Reason" rows="4" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
            <button onClick={submitRequest} className="rounded-3xl bg-primary px-5 py-3 text-white">Request leave</button>
          </div>
        </div>
        <div className="card-glass p-6">
          <h2 className="text-xl font-semibold mb-4">Recent requests</h2>
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request._id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{request.type}</span>
                  <span className={`rounded-full px-3 py-1 text-xs ${request.status === 'pending' ? 'bg-amber-100 text-amber-800' : request.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{request.status}</span>
                </div>
                <p className="text-slate-500 mt-2">{new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default LeaveRequestsPage;
