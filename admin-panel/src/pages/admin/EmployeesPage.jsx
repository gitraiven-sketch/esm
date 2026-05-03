import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import Topbar from '../../components/Topbar';
import api from '../../api/apiClient';
import { FaPlus, FaSearch, FaUser } from 'react-icons/fa';

const EmployeesPage = ({ logout }) => {
  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', department: '', jobTitle: '' });

  useEffect(() => {
    api.get('/employees').then((res) => setEmployees(res.data)).catch(console.error);
  }, []);

  const filtered = employees.filter((employee) => `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(query.toLowerCase()));

  const handleAdd = async () => {
    try {
      const res = await api.post('/employees', { ...form, password: form.password || 'Password123!' });
      setEmployees([res.data, ...employees]);
      setForm({ firstName: '', lastName: '', email: '', password: '', department: '', jobTitle: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleToggleStatus = async (employee) => {
    try {
      const updated = await api.put(`/employees/${employee._id}`, {
        status: employee.status === 'active' ? 'inactive' : 'active'
      });
      const updatedList = employees.map((item) => (item._id === updated.data._id ? updated.data : item));
      setEmployees(updatedList);
      setSelectedEmployee(updated.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <Topbar title="Employees" onLogout={logout} />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="card-glass p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Employee Directory</h2>
              <p className="text-slate-500">Search and manage employee profiles.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search employees"
                  className="pl-10 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 w-full"
                />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {filtered.map((employee) => (
              <button
                type="button"
                key={employee._id}
                onClick={() => handleSelect(employee)}
                className="w-full text-left rounded-3xl border border-slate-200 p-4 hover:border-primary hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{employee.firstName} {employee.lastName}</h3>
                    <p className="text-sm text-slate-500">{employee.jobTitle} · {employee.department}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs ${employee.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {employee.status || 'active'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-glass p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Add Employee</h3>
                <p className="text-slate-500">Quickly add a new employee profile.</p>
              </div>
              <FaPlus className="text-primary" />
            </div>
            <div className="space-y-4">
              {['firstName','lastName','email','password','department','jobTitle'].map((field) => (
                <input
                  key={field}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  placeholder={field.replace(/([A-Z])/g, ' $1')}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              ))}
            </div>
            <button onClick={handleAdd} className="mt-5 w-full rounded-3xl bg-primary px-5 py-3 text-white hover:bg-darkblue transition">Create Employee</button>
          </div>

          <div className="card-glass p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Employee profile</h3>
                <p className="text-slate-500">Review selected employee details and account status.</p>
              </div>
              <FaUser className="text-primary" />
            </div>
            {selectedEmployee ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="font-medium">{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Role</p>
                  <p className="font-medium">{selectedEmployee.jobTitle} / {selectedEmployee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Joined</p>
                  <p className="font-medium">{selectedEmployee.joinedAt ? new Date(selectedEmployee.joinedAt).toLocaleDateString() : 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Professional summary</p>
                  <p className="whitespace-pre-line text-slate-700">{selectedEmployee.jobDescription || 'No summary provided.'}</p>
                </div>
                {selectedEmployee.signedContractUrl && (
                  <div>
                    <p className="text-sm text-slate-500">Signed contract</p>
                    <a href={selectedEmployee.signedContractUrl} target="_blank" rel="noreferrer" className="text-primary font-semibold hover:underline block">
                      {selectedEmployee.signedContractFileName || 'View contract'}
                    </a>
                  </div>
                )}
                <button
                  onClick={() => handleToggleStatus(selectedEmployee)}
                  className={`w-full rounded-3xl px-5 py-3 text-white ${selectedEmployee.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'} transition`}
                >
                  {selectedEmployee.status === 'active' ? 'Ban employee' : 'Reinstate employee'}
                </button>
              </div>
            ) : (
              <p className="text-slate-500">Select an employee from the directory to view profile details and manage access.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EmployeesPage;
