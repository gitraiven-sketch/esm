export const formatName = (user) => `${user.firstName || ''} ${user.lastName || ''}`.trim();
export const formatDate = (value) => new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
export const formatTime = (value) => new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
export const truncateText = (text, length = 100) => (text?.length > length ? `${text.slice(0, length)}...` : text);
