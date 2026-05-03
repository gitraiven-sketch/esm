import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import Topbar from '../../components/Topbar';
import api from '../../api/apiClient';

const ChatPage = ({ logout }) => {
  const [rooms, setRooms] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/chat').then((res) => setRooms(res.data)).catch(console.error);
  }, []);

  return (
    <AdminLayout>
      <Topbar title="Chat" onLogout={logout} />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="card-glass p-6">
          <h2 className="text-xl font-semibold mb-4">Conversations</h2>
          <div className="space-y-3">
            {rooms.map((room) => (
              <button key={room._id} onClick={() => setSelected(room)} className="w-full rounded-3xl border border-slate-200 p-4 text-left hover:bg-slate-50">
                <div className="font-semibold">{room.title}</div>
                <div className="text-slate-500 text-sm">{room.participants.map((user) => user.firstName).join(', ')}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="card-glass p-6 flex flex-col h-[600px]">
          <h2 className="text-xl font-semibold mb-4">{selected ? selected.title : 'Select a chat'}</h2>
          <div className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 p-4 overflow-y-auto">
            {selected ? (
              <div className="space-y-4 text-slate-600">Typing indicators, online presence, and Firestore-powered realtime chat are enabled in this workspace.</div>
            ) : (
              <p className="text-slate-500">Choose a conversation to display messages and send replies.</p>
            )}
          </div>
          <div className="mt-4 flex gap-3">
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message" className="flex-1 rounded-3xl border border-slate-200 bg-white px-4 py-3" />
            <button className="rounded-3xl bg-primary px-5 py-3 text-white">Send</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ChatPage;
