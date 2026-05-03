import { useEffect, useState } from 'react';
import EmployeeLayout from './EmployeeLayout';
import Topbar from '../../components/Topbar';
import api from '../../api/apiClient';

const AnnouncementsPage = ({ logout }) => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    api.get('/announcements').then((res) => setAnnouncements(res.data)).catch(console.error);
  }, []);

  return (
    <EmployeeLayout>
      <Topbar title="Announcements" onLogout={logout} />
      <div className="grid gap-6 lg:grid-cols-2">
        {announcements.map((announcement) => (
          <div key={announcement._id} className="card-glass p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">{announcement.title}</h2>
              {announcement.pinned && <span className="rounded-full bg-primary px-3 py-1 text-white text-xs">Pinned</span>}
            </div>
            <p className="mt-3 text-slate-600">{announcement.body}</p>
            <p className="mt-4 text-sm text-slate-500">Posted by {announcement.createdBy?.firstName} {announcement.createdBy?.lastName}</p>
          </div>
        ))}
      </div>
    </EmployeeLayout>
  );
};

export default AnnouncementsPage;
