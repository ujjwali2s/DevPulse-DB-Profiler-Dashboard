import React, { useEffect, useState } from 'react';
import TopBar from './TopBar';
import './Notifications.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.username || '';

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/notifications?username=${username}`);
        //const res = await fetch(`http://localhost:5000/request/notifications?username=${username}`);

        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        // Add read status if not present (assuming new notifications are unread)
        const notificationsWithStatus = data.map(noti => ({
          ...noti,
          is_read: noti.read_status || false
        }));
        
        setNotifications(notificationsWithStatus);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, [username]);

  const markAsRead = async (notiId) => {
    try {
      // Update local state immediately for better UX
      setNotifications(prev => 
        prev.map(noti => 
          noti.noti_id === notiId ? { ...noti, read_status: true } : noti
        )
      );
      
      // API call to mark as read (implement this endpoint on your backend)
      await fetch(`http://localhost:5000/notifications/${notiId}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const getNotificationType = (message) => {
    if (message.toLowerCase().includes('return')) return 'type-return';
    if (message.toLowerCase().includes('due')) return 'type-due';
    if (message.toLowerCase().includes('overdue')) return 'type-overdue';
    if (message.toLowerCase().includes('approved')) return 'type-approval';
    return '';
  };

  return (
    <>
      <TopBar />
      <div className="notifications-container">
        <h2 className="notifications-header">Your Notifications</h2>
        
        <div className="notifications-content">
          {loading ? (
            <div className="notifications-loading">
              <div className="loading-spinner"></div>
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="no-notifications">
              No notifications to display
            </div>
          ) : (
            <ul className="notifications-list">
              {notifications.map(noti => (
                <li 
                  key={noti.noti_id} 
                  className={`notification-item ${noti.read_status ? 'read' : 'unread'} ${getNotificationType(noti.message)}`}
                >
                  <div className="notification-message">
                    {noti.message}
                  </div>
                  <div className="notification-date">
                    {new Date(noti.sent_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {!noti.is_read && (
                    <div className="notification-actions">
                      <button 
                        className="mark-read-btn"
                        onClick={() => markAsRead(noti.noti_id)}
                      >
                        Mark as Read
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default Notifications;
