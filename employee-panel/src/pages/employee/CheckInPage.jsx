import { useState } from 'react';
import EmployeeLayout from './EmployeeLayout';
import Topbar from '../../components/Topbar';
import api from '../../api/apiClient';

const CheckInPage = ({ logout }) => {
  const [status, setStatus] = useState('');

  const handleCheckIn = async () => {
    try {
      const res = await api.post('/attendance/checkin');
      setStatus('Checked in at ' + new Date(res.data.checkIn).toLocaleTimeString());
    } catch (err) {
      setStatus('Unable to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await api.post('/attendance/checkout');
      setStatus('Checked out at ' + new Date(res.data.checkOut).toLocaleTimeString());
    } catch (err) {
      setStatus('Unable to check out');
    }
  };

  return (
    <EmployeeLayout>
      <Topbar title="Check In / Out" onLogout={logout} />
      <div className="card-glass p-6">
        <h2 className="text-xl font-semibold mb-3">Daily attendance</h2>
        <p className="text-slate-500 mb-6">Use secure one-click time tracking for today.</p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button onClick={handleCheckIn} className="rounded-3xl bg-primary px-6 py-4 text-white hover:bg-darkblue transition">Check In</button>
          <button onClick={handleCheckOut} className="rounded-3xl bg-slate-100 px-6 py-4 text-slate-700 hover:bg-slate-200 transition">Check Out</button>
        </div>
        {status && <p className="mt-5 rounded-3xl bg-slate-50 px-4 py-3 text-slate-700">{status}</p>}
      </div>
    </EmployeeLayout>
  );
};

export default CheckInPage;
