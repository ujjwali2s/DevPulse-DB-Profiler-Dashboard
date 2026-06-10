import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage({ setLoggedInMemberId }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  console.log('entering loginpage');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        const user = result.user;

        // ✅ Flatten user object
        const flatUser = {
          username: user.username,
          userType: user.userType,
          member_id: user.memberInfo?.member_id,
          staff_id: user.staffInfo?.staff_id,
          branchId: user.staffInfo?.branch_id || null
        };

        // ✅ Store clean user info in localStorage
        localStorage.setItem('user', JSON.stringify(flatUser));
        localStorage.setItem('username', flatUser.username);

        console.log('Logged in userType:', flatUser.userType);

        if (flatUser.userType === 'Staff') {
          localStorage.setItem('staff_id', flatUser.staff_id); // consistent key name
          navigate('/staff-home');
        } else {
          localStorage.setItem('memberId', flatUser.member_id); // consistent with App.js
          setLoggedInMemberId(flatUser.member_id);               // ✅ update App state
          navigate('/member/dashboard');
        }

      } else {
        setMessage(`❌ ${result.error || 'Login failed'}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage('❌ Something went wrong.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>🔐 Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default LoginPage;

