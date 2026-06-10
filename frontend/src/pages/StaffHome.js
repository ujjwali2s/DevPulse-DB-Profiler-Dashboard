import React from 'react';
import StaffTopBar from './StaffTopBar';
import StatisticsDashboard from './StatisticsDashboard'; // make sure path is correct
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

function StaffHome() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();

  // Dynamic greeting logic
  const hour = new Date().getHours();
  let greetingTime = 'Hello';
  if (hour < 12) greetingTime = 'Good morning';
  else if (hour < 18) greetingTime = 'Good afternoon';
  else greetingTime = 'Good evening';

  const greetingText = `${greetingTime}, ${user.username || 'Staff'}!`;
  const welcomeMessage = `Welcome back to your dashboard. Ready to manage your library today? 📚`;

  return React.createElement(
    'div',
    { className: 'dashboard-container' },
    React.createElement(StaffTopBar, null),
    React.createElement(
      'div',
      { className: 'dashboard-content', style: { paddingTop: '100px' } },
      React.createElement(
        'div',
        { className: 'dashboard-greeting-container' },
        React.createElement(
          'h2',
          { className: 'dashboard-greeting' },
          greetingText
        ),
      React.createElement(
        'p',
        { className: 'dashboard-welcome-message' },
        welcomeMessage
      )
    ),
    // 💡 Add statistics dashboard below
    React.createElement(
      'div',
      { style: { marginTop: '40px' } },
      React.createElement(StatisticsDashboard, { userRole: 'staff' })
    )
    )
  );
}

export default StaffHome;
