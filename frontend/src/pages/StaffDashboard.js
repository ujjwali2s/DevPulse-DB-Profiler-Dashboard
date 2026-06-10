import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffTopBar from './StaffTopBar';
import './StaffDashboard.css';

function StaffDashboard() {
  const [username, setUsername] = useState('');
  const [branchId, setBranchId] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUsername(user.username);
      
      // Fetch profile to get branch ID
      const fetchProfile = async () => {
        try {
          const res = await fetch(`http://localhost:5000/staff-main/staffProfile?username=${user.username}`);
          const data = await res.json();
          if (res.ok) {
            setProfile(data);
            setBranchId(data.branch_id);
          }
        } catch (err) {
          console.error('Failed to fetch profile:', err);
        }
      };
      
      fetchProfile();
    }
  }, []);

  const handleSearch = () => {
    
    navigate('/staff-search-availability', { state: { branchId } });
  };

  return (
    <div className="staff-dashboard-container">
      <StaffTopBar />
      <div className="staff-dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Staff Dashboard</h1>
          <div className="dashboard-subtitle">Welcome back, {username || 'Staff Member'}</div>
        </div>

        <div className="dashboard-info-card">
          <div className="info-section">
            <h2 className="section-title">Your Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Username</span>
                <span className="info-value">{username || 'Loading...'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Branch ID</span>
                <span className="info-value">{branchId || 'Loading...'}</span>
              </div>
            </div>
          </div>

          <div className="actions-section">
            <h2 className="section-title">Quick Actions</h2>
            <div className="actions-grid">
              <button className="action-button primary" onClick={handleSearch}>
                <span className="button-icon">🔍</span>
                Search Book Availability
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
