import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import Topbar from '../../components/Topbar';
import api from '../../api/apiClient';
import { FaCheckCircle, FaTimesCircle, FaClipboardList, FaFileContract } from 'react-icons/fa';

const ApprovalsPage = ({ logout }) => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadPendingAdmins();
  }, []);

  const loadPendingAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/pending-admins');
      setPending(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (adminId) => {
    try {
      setProcessing(adminId);
      await api.post(`/auth/approve-admin/${adminId}`);
      setPending(pending.filter((admin) => admin._id !== adminId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Unable to approve admin');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (adminId) => {
    if (!window.confirm('Are you sure you want to reject this admin registration? This action cannot be undone.')) {
      return;
    }
    try {
      setProcessing(adminId);
      await api.post(`/auth/reject-admin/${adminId}`);
      setPending(pending.filter((admin) => admin._id !== adminId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Unable to reject admin');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <AdminLayout>
      <Topbar title="Admin Approvals" onLogout={logout} />
      <div className="card-glass p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Pending Admin Approvals</h2>
            <p className="text-slate-500">Review and activate new administrator accounts.</p>
          </div>
          <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold">
            {pending.length} pending
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading pending admins...</p>
        ) : pending.length === 0 ? (
          <div className="text-center py-12">
            <FaClipboardList className="mx-auto text-4xl text-slate-300 mb-4" />
            <p className="text-slate-500">No pending admin approvals</p>
            <p className="text-sm text-slate-400">New admin registrations will appear here for review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((admin) => (
              <div
                key={admin._id}
                className="rounded-3xl border border-slate-200 p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{admin.firstName} {admin.lastName}</h3>
                      <p className="text-slate-500 text-sm">{admin.email}</p>
                      <div className="mt-3 space-y-2">
                        <div>
                          <p className="text-xs text-slate-500">Role</p>
                          <p className="font-medium">{admin.jobTitle} / {admin.department}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Joining date</p>
                          <p className="font-medium">{admin.joinedAt ? new Date(admin.joinedAt).toLocaleDateString() : 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Professional summary</p>
                          <p className="text-sm text-slate-700 line-clamp-2">{admin.jobDescription || 'No summary provided.'}</p>
                        </div>
                        {admin.signedContractUrl && (
                          <div>
                            <p className="text-xs text-slate-500">Signed contract</p>
                            <a
                              href={admin.signedContractUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary text-sm font-semibold hover:underline flex items-center gap-2"
                            >
                              <FaFileContract />
                              {admin.signedContractFileName || 'View contract'}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 sm:flex-col">
                  <button
                    onClick={() => handleApprove(admin._id)}
                    disabled={processing === admin._id}
                    className="flex-1 sm:flex-none rounded-3xl bg-emerald-600 px-6 py-3 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-50"
                  >
                    <FaCheckCircle className="inline mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(admin._id)}
                    disabled={processing === admin._id}
                    className="flex-1 sm:flex-none rounded-3xl bg-red-600 px-6 py-3 text-white font-medium hover:bg-red-700 transition disabled:opacity-50"
                  >
                    <FaTimesCircle className="inline mr-2" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ApprovalsPage;
