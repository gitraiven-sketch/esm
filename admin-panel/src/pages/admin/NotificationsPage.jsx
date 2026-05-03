import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import Topbar from '../../components/Topbar';
import api from '../../api/apiClient';

const NotificationsPage = ({ logout }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get('/notifications').then((res) => setNotifications(res.data)).catch(console.error);
  }, []);

  const markRead = async (id) => {
    try {
      const res = await api.put(`/notifications/read/${id}`);
      setNotifications(notifications.map((item) => (item._id === id ? res.data : item)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <Topbar title="Notifications" onLogout={logout} />
      <div className="card-glass p-6">
        <h2 className="text-xl font-semibold mb-4">Realtime notifications</h2>
        <div className="space-y-4">
          {notifications.map((item) => (
            <div key={item._id} className="rounded-3xl border border-slate-200 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-slate-500">{item.description}</p>
              </div>
              <button onClick={() => markRead(item._id)} className={`rounded-3xl px-4 py-2 ${item.read ? 'bg-slate-100 text-slate-600' : 'bg-primary text-white'}`}>
                {item.read ? 'Read' : 'Mark read'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default NotificationsPage;
