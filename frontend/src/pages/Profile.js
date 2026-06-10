// import React, { useEffect, useState } from 'react';
// import HamburgerMenu from './HamburgerMenu';
// import './Profile.css';

// function Profile() {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user'));

//     if (storedUser?.username) {
//       setLoading(true);
//       fetch(`http://localhost:5000/profile/${storedUser.username}`)
//         .then(res => {
//           if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//           return res.json();
//         })
//         .then(data => {
//           setProfile(data);
//           setError(null);
//         })
//         .catch(err => {
//           console.error('Failed to fetch profile:', err);
//           setError('Failed to load profile.');
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//       setError('No user logged in.');
//     }
//   }, []); // ← Empty dependency array means this only runs once

//   return (
//     <div className="profile-page">
//       <HamburgerMenu />
//       <div className="profile-container">
//         <h2>👤 Profile Details</h2>
//         {loading && <p className="loading-message">Loading profile...</p>}
//         {error && <p className="error-message">{error}</p>}
//         {!loading && !error && profile && (
//           <div>
//             <p className="profile-detail"><strong>Name:</strong> {profile.name}</p>
//             <p className="profile-detail"><strong>Email:</strong> {profile.email}</p>
//             <p className="profile-detail"><strong>Phone:</strong> {profile.phone}</p>
//             <p className="profile-detail"><strong>Address:</strong> {profile.street}, {profile.city}, {profile.country}</p>
//             <p className="profile-detail"><strong>Join Date:</strong> {profile.join_date}</p>
//             <p className="profile-detail"><strong>Membership Status:</strong> {profile.status_name}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Profile;


import React, { useEffect, useState } from 'react';
import TopBar from './TopBar';
import './Profile.css';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [updating, setUpdating] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Modify Profile modal
const [showModifyModal, setShowModifyModal] = useState(false);
const [newUsername, setNewUsername] = useState('');
const [newPassword, setNewPassword] = useState('');
const [modifyError, setModifyError] = useState('');
const [modifyLoading, setModifyLoading] = useState(false);



    // For deactivate account modal
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivatePassword, setDeactivatePassword] = useState('');
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [deactivateError, setDeactivateError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser?.username) {
      setLoading(true);
      fetch(`http://localhost:5000/profile/${storedUser.username}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          setProfile(data);
          setError(null);
        })
        .catch(err => {
          console.error('Failed to fetch profile:', err);
          setError('Failed to load profile.');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError('No user logged in.');
    }
  };

  const handleChangeMembership = () => {
    if (!profile) return;
    const currentStatus = profile.status_name;

    if (currentStatus === 'standard') {
      setModalMessage('Upgrading to premium will cost you 200 taka per month. Are you sure to upgrade?');
    } else {
      setModalMessage('Degrading to standard may restrict you from ordering many books. Are you sure?');
    }

    setShowModal(true);
  };

  const handleConfirmChange = () => {
    if (!profile?.username) return;

    setUpdating(true);
    fetch('http://localhost:5000/profile/change-membership', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: profile.username })
    })
      .then(res => res.json())
      .then(data => {
        setFeedbackMessage(data.message || 'Membership updated.');
        fetchProfile(); // Reload profile
      })
      .catch(err => {
        console.error('Membership change failed:', err);
        setFeedbackMessage('Failed to change membership.');
      })
      .finally(() => {
        setShowModal(false);
        setUpdating(false);
        setTimeout(() => setFeedbackMessage(''), 3000);
      });
  };

  
  // Deactivate account handlers
  const handleDeactivateClick = () => {
    setDeactivatePassword('');
    setDeactivateError('');
    setShowDeactivateModal(true);
  };

  const handleConfirmDeactivate = () => {
    if (!profile?.username) return;

    if (deactivatePassword.trim() === '') {
      setDeactivateError('Please enter your password');
      return;
    }

    setDeactivateLoading(true);
    fetch('http://localhost:5000/profile/deactivate-account', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: profile.username, password: deactivatePassword })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Deactivation failed');
        return data;
      })
      .then(data => {
        alert(data.message);
        // Clear local storage and redirect to login since account is deactivated
        localStorage.removeItem('user');
        window.location.href = '/login';
      })
      .catch(err => {
        setDeactivateError(err.message);
      })
      .finally(() => {
        setDeactivateLoading(false);
       // setShowDeactivateModal(false);
      });
  };



  return (
    <>
      <TopBar />
      <div className="profile-page">
        <div className="profile-container">
        <h2>👤 Profile Details</h2>

        {loading && <p className="loading-message">Loading profile...</p>}
        {error && <p className="error-message">{error}</p>}
        {feedbackMessage && <p className="success-message">{feedbackMessage}</p>}

        {!loading && !error && profile && (
          <div>
            <p className="profile-detail"><strong>Name:</strong> {profile.name}</p>
            <p className="profile-detail"><strong>Email:</strong> {profile.email}</p>
            <p className="profile-detail"><strong>Phone:</strong> {profile.phone}</p>
            <p className="profile-detail"><strong>Address:</strong> {profile.street}, {profile.city}, {profile.country}</p>
            <p className="profile-detail"><strong>Join Date:</strong> {profile.join_date}</p>
            <p className="profile-detail"><strong>Membership Status:</strong> {profile.status_name}</p>

            <button className="membership-button" onClick={handleChangeMembership}>
              Change Membership
            </button>
            <button
          className="membership-button"
          style={{ backgroundColor: '#d32f2f', marginTop: '15px' }}
          onClick={handleDeactivateClick}
        >
          Deactivate Account
        </button>
        <button
  className="membership-button"
  style={{ backgroundColor: '#00796b', marginTop: '15px' }}
  onClick={() => {
    setNewUsername('');
    setNewPassword('');
    setModifyError('');
    setShowModifyModal(true);
  }}
>
  Modify Profile
</button>

          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <p>{modalMessage}</p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleConfirmChange} disabled={updating}>
                {updating ? 'Processing...' : 'Yes'}
              </button>
              <button className="cancel-button" onClick={() => setShowModal(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="modal-overlay" onClick={() => setShowDeactivateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDeactivateModal(false)}>×</button>
            <p>Are you sure you want to deactivate your account? Please enter your password:</p>
            <input
              type="password"
              value={deactivatePassword}
              onChange={e => setDeactivatePassword(e.target.value)}
              placeholder="Password"
              style={{ padding: '8px', width: '90%', marginTop: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              disabled={deactivateLoading}
            />
            {deactivateError && <p style={{ color: 'red', marginTop: '8px' }}>{deactivateError}</p>}
            <div className="modal-buttons" style={{ marginTop: '15px' }}>
              <button
                className="confirm-button"
                onClick={handleConfirmDeactivate}
                disabled={deactivateLoading}
              >
                {deactivateLoading ? 'Processing...' : 'Yes'}
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowDeactivateModal(false)}
                disabled={deactivateLoading}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
     {showModifyModal && (
  <div className="modal-overlay" onClick={() => setShowModifyModal(false)}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setShowModifyModal(false)}>×</button>
      <p>Modify your username and/or password:</p>
      <input
        type="text"
        placeholder="Enter new username"
        value={newUsername}
        onChange={e => setNewUsername(e.target.value)}
        style={{ marginTop: '10px', width: '90%', padding: '8px', borderRadius: '6px' }}
        disabled={modifyLoading}
      />
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        style={{ marginTop: '10px', width: '90%', padding: '8px', borderRadius: '6px' }}
        disabled={modifyLoading}
      />
      {modifyError && <p style={{ color: 'red', marginTop: '8px' }}>{modifyError}</p>}
      <div className="modal-buttons" style={{ marginTop: '15px' }}>
        <button
          className="confirm-button"
          onClick={async () => {
            if (!newUsername && !newPassword) {
              setModifyError('Enter at least one field');
              return;
            }

            setModifyLoading(true);
            try {
              const res = await fetch('http://localhost:5000/profile/modify-account', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  currentUsername: profile.username,
                  newUsername,
                  newPassword
                })
              });

              const data = await res.json();
              if (!res.ok) throw new Error(data.error || 'Update failed');

              alert('Profile updated. Please login again with new credentials.');
              localStorage.removeItem('user');
              window.location.href = '/login';
            } catch (err) {
              setModifyError(err.message);
            } finally {
              setModifyLoading(false);
            }
          }}
          disabled={modifyLoading}
        >
          {modifyLoading ? 'Updating...' : 'Submit'}
        </button>
        <button
          className="cancel-button"
          onClick={() => setShowModifyModal(false)}
          disabled={modifyLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


      </div>
    </>
  );
}


export default Profile;

