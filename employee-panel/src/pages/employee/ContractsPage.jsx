import { useEffect, useState } from 'react';
import EmployeeLayout from './EmployeeLayout';
import Topbar from '../../components/Topbar';
import api from '../../api/apiClient';

const ContractsPage = ({ logout }) => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    api.get('/contracts').then((res) => setContracts(res.data)).catch(console.error);
  }, []);

  return (
    <EmployeeLayout>
      <Topbar title="Contracts" onLogout={logout} />
      <div className="card-glass p-6">
        <h2 className="text-xl font-semibold mb-4">Your contracts</h2>
        <div className="space-y-4">
          {contracts.map((contract) => (
            <div key={contract._id} className="rounded-3xl border border-slate-200 p-4 sm:flex sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold">{contract.title}</h3>
                <p className="text-slate-500">Uploaded by {contract.uploadedBy}</p>
              </div>
              <a href={contract.fileUrl} target="_blank" rel="noreferrer" className="rounded-3xl bg-primary px-4 py-2 text-white">Download</a>
            </div>
          ))}
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default ContractsPage;
