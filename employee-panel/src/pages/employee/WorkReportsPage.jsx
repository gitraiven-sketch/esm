import { useEffect, useState } from 'react';
import EmployeeLayout from './EmployeeLayout';
import Topbar from '../../components/Topbar';
import api from '../../api/apiClient';

const WorkReportsPage = ({ logout }) => {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({ title: '', summary: '' });

  useEffect(() => {
    api.get('/reports/dashboard').then((res) => setReports([{ id: 1, title: 'Weekly sprint summary', status: 'submitted' }])).catch(console.error);
  }, []);

  const submitReport = () => {
    setReports([{ id: Date.now(), title: form.title, status: 'submitted' }, ...reports]);
    setForm({ title: '', summary: '' });
  };

  return (
    <EmployeeLayout>
      <Topbar title="Work Reports" onLogout={logout} />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="card-glass p-6">
          <h2 className="text-xl font-semibold mb-4">Submit your report</h2>
          <div className="space-y-4">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Report title" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
            <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Summary" rows="5" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
            <button onClick={submitReport} className="rounded-3xl bg-primary px-5 py-3 text-white">Submit report</button>
          </div>
        </div>
        <div className="card-glass p-6">
          <h2 className="text-xl font-semibold mb-4">Recent reports</h2>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">{report.title}</div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 text-xs">{report.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default WorkReportsPage;
