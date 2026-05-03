import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import Topbar from '../../components/Topbar';
import api from '../../api/apiClient';

const ContractsPage = ({ logout }) => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    api.get('/contracts').then((res) => setContracts(res.data)).catch(console.error);
  }, []);

  return (
    <AdminLayout>
      <Topbar title="Contracts" onLogout={logout} />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="card-glass p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Contract Library</h2>
              <p className="text-slate-500">Upload, manage and download employee agreements.</p>
            </div>
          </div>
          <div className="space-y-4">
            {contracts.map((contract) => (
              <div key={contract._id} className="rounded-3xl border border-slate-200 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold">{contract.title}</h3>
                  <p className="text-sm text-slate-500">Assigned to {contract.user?.firstName} {contract.user?.lastName}</p>
                </div>
                <a href={contract.fileUrl} target="_blank" rel="noreferrer" className="rounded-3xl bg-primary px-4 py-2 text-white">Download</a>
              </div>
            ))}
          </div>
        </div>
        <div className="card-glass p-6">
          <h3 className="text-lg font-semibold mb-4">Upload Contract</h3>
          <p className="text-slate-500 mb-4">Use backend upload endpoint to save PDF contracts and make them available to employees.</p>
          <form className="space-y-4">
            <input type="text" placeholder="Contract title" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
            <input type="file" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
            <button type="button" className="w-full rounded-3xl bg-primary px-5 py-3 text-white">Upload contract</button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContractsPage;
