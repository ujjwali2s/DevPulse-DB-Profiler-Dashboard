

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HamburgerMenu.css';

const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    setOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    if (!animating) {
      setAnimating(true);
      setOpen(!open);
      setTimeout(() => setAnimating(false), 300);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const menuItems = [
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/member/search', label: 'Search Books', icon: '🔍' },
    { path: '/history', label: 'History', icon: '📚' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/request', label: 'Request', icon: '📝' },
    { path: '/readlist', label: 'Your Current Readlist', icon: '📖' }, // new item merged in
    { path: '/fines', label: 'Fine/Dues', icon: '💰' },
  ];

  return (
    <div className="hamburger-container" ref={menuRef}>
      <div
        className={`hamburger-icon ${open ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') toggleMenu(); }}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </div>

      {open && <div className="hamburger-backdrop" onClick={() => setOpen(false)}></div>}

      <div className={`hamburger-menu ${open ? 'open' : ''}`}>
        <div className="menu-header">
          <h3>Menu</h3>
          <button
            className="close-btn"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <div className="menu-items">
          {menuItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className="menu-item"
              onClick={() => setOpen(false)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              <span className="menu-arrow">›</span>
            </Link>
          ))}

          <div className="menu-divider"></div>

          <button
            className="menu-item logout-btn"
            onClick={handleLogout}
            style={{ animationDelay: `${menuItems.length * 50}ms` }}
          >
            <span className="menu-icon">🚪</span>
            <span className="menu-label">Logout</span>
            <span className="menu-arrow">›</span>
          </button>
        </div>

        <div className="menu-footer">
          <div className="user-info">
            <div className="user-avatar">
              <span>👤</span>
            </div>
            <div className="user-details">
              <p className="user-name">Library Member</p>
              <p className="user-status">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;


