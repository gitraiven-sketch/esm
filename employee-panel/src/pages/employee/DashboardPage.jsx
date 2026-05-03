import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import EmployeeLayout from './EmployeeLayout';
import Topbar from '../../components/Topbar';
import api from '../../api/apiClient';

const DashboardPage = ({ logout }) => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get('/reports/dashboard').then((res) => setStats(res.data)).catch(console.error);
  }, []);

  return (
    <EmployeeLayout>
      <Topbar title="Employee Dashboard" onLogout={logout} />
      <div className="grid gap-6 xl:grid-cols-3">
        {[
          { label: 'Check-in today', value: stats.present || 0 },
          { label: 'Approved leaves', value: stats.onLeave || 0 },
          { label: 'Sick cases', value: stats.sick || 0 }
        ].map((card) => (
          <motion.div key={card.label} className="card-glass p-6" whileHover={{ y: -4 }}>
            <p className="text-slate-500 uppercase tracking-[0.2em] text-xs">{card.label}</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{card.value}</p>
          </motion.div>
        ))}
      </div>
      <div className="card-glass mt-6 p-6">
        <h2 className="text-xl font-semibold mb-4">Action center</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {['Check in', 'Request leave', 'View contracts'].map((item) => (
            <div key={item} className="rounded-3xl border border-slate-200 p-5"> 
              <p className="font-semibold">{item}</p>
              <p className="text-slate-500 mt-2">Quick access from your employee panel.</p>
            </div>
          ))}
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default DashboardPage;
