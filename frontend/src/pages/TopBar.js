import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaBookOpen, FaHistory, FaUser, FaHome } from 'react-icons/fa';
import HamburgerMenu from './HamburgerMenu';
import './TopBar.css';

const TopBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.username || '';

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/search/suggestions?query=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    };
    fetchSuggestions();
  }, [query]);

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!username) return;
      try {
        const res = await fetch(`http://localhost:5000/notifications?username=${username}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const unreadNotifications = data.filter(noti => !noti.read_status);
        setUnreadCount(unreadNotifications.length);
      } catch (err) {
        console.error('Error fetching notification count:', err);
      }
    };
    
    fetchUnreadCount();
    
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [username]);

  const handleSelect = (bookId) => {
    setQuery('');
    setSuggestions([]);
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="topbar-container">
      <div className="topbar-left">
        <div className="logo-container">
          <div className="paper-trail-logo">
            <span className="paper-trail-text">Paper</span>
            <span className="trail-text">Trail</span>
            <div className="floating-paper"></div>
            <div className="floating-paper"></div>
            <div className="floating-paper"></div>
            <div className="mini-book"></div>
            <div className="mini-book"></div>
            <div className="pencil"></div>
            <div className="pencil"></div>
            <div className="ink-drop"></div>
            <div className="ink-drop"></div>
            <div className="paper-plane"></div>
          </div>
          <div className="sparkle"></div>
          <div className="sparkle"></div>
          <div className="sparkle"></div>
          <div className="sparkle"></div>
        </div>
      </div>
      
      <div className="topbar-center">
        <input
          type="search"
          className="topbar-search"
          placeholder="Search by title, author, genre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="topbar-suggestions">
            {suggestions.map((book) => (
              <li
                key={book.book_id}
                className="topbar-suggestion-item"
                onClick={() => handleSelect(book.book_id)}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSelect(book.book_id); }}
              >
                {book.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="topbar-right">
        <nav className="topbar-icons">
          <button
            title="Home"
            onClick={() => navigate('/member/dashboard')}
            className="topbar-icon-btn"
            aria-label="Home"
            style={{ padding: '4px' }}
          >
            <FaHome size={5} />
          </button>

          <button
            title="Notifications"
            onClick={() => navigate('/notifications')}
            className="topbar-icon-btn notification-btn"
            aria-label="Notifications"
            style={{ position: 'relative', padding: '4px' }}
          >
            <FaBell size={5} />
            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <button
            title="Your Readlist"
            onClick={() => navigate('/readlist')}
            className="topbar-icon-btn"
            aria-label="Your Readlist"
            style={{ padding: '4px' }}
          >
            <FaBookOpen size={5} />
          </button>

          <button
            title="History"
            onClick={() => navigate('/history')}
            className="topbar-icon-btn"
            aria-label="History"
            style={{ padding: '4px' }}
          >
            <FaHistory size={5} />
          </button>

          <button
            title="Profile"
            onClick={() => navigate('/profile')}
            className="topbar-icon-btn"
            aria-label="Profile"
            style={{ padding: '4px' }}
          >
            <FaUser size={5} />
          </button>
        </nav>
        
        <div className="topbar-hamburger">
          <HamburgerMenu />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
