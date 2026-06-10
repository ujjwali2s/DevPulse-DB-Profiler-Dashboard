// import React, { useEffect, useState } from 'react';
// import StaffHamburgerMenu from './StaffHamburgerMenu';
// import './DashboardPage.css';

// function StaffProfile() {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const user = JSON.parse(localStorage.getItem('user')) || {};
//   const accountId = user.accountId;

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/staff/profile/${accountId}`);
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || 'Error fetching profile');
//         setProfile(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [accountId]);

//   return (
//     <div className="dashboard-container">
//       <div className="hamburger-wrapper">
//         <StaffHamburgerMenu />
//       </div>
//       <h2 className="dashboard-greeting">👤 Staff Profile</h2>
//       {loading && <p>Loading...</p>}
//       {error && <p>{error}</p>}
//       {profile && (
//         <div>
//           <p><strong>Name:</strong> {profile.name}</p>
//           <p><strong>Email:</strong> {profile.email}</p>
//           <p><strong>Phone:</strong> {profile.phone}</p>
//           <p><strong>Address:</strong> {profile.street}, {profile.city}, {profile.country}</p>
//           <p><strong>Join Date:</strong> {profile.join_date}</p>
//           <p><strong>Designation:</strong> {profile.designation}</p>
//           <p><strong>Branch ID:</strong> {profile.branch_id}</p>
//           <p><strong>Branch Name:</strong> {profile.branch_name}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StaffProfile;

// import React, { useEffect, useState } from 'react';
// import StaffHamburgerMenu from './StaffHamburgerMenu';
// import './DashboardPage.css';

// function StaffProfile() {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const user = JSON.parse(localStorage.getItem('user')) || {};
//   const username = user.username;

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/staff/profile?username=${username}`);
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || 'Error fetching profile');
//         setProfile(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [username]);

//   return (
//     <div className="dashboard-container">
//       <div className="hamburger-wrapper">
//         <StaffHamburgerMenu />
//       </div>
//       <h2 className="dashboard-greeting">👤 Staff Profile</h2>
//       {loading && <p>Loading...</p>}
//       {error && <p>{error}</p>}
//       {profile && (
//         <div>
//           <p><strong>Name:</strong> {profile.name}</p>
//           <p><strong>Email:</strong> {profile.email}</p>
//           <p><strong>Phone:</strong> {profile.phone}</p>
//           <p><strong>Address:</strong> {profile.street}, {profile.city}, {profile.country}</p>
//           <p><strong>Join Date:</strong> {profile.join_date}</p>
//           <p><strong>Designation:</strong> {profile.designation}</p>
//           <p><strong>Branch ID:</strong> {profile.branch_id}</p>
//           <p><strong>Branch Name:</strong> {profile.branch_name}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StaffProfile;





// import React, { useEffect, useState } from 'react';
// import StaffHamburgerMenu from './StaffHamburgerMenu';
// import './Profile.css'; // Use the same styling as member

// function StaffProfile() {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user'));

//     if (storedUser?.username) {
//       fetch(`http://localhost:5000/staff/profile?username=${storedUser.username}`)
//       // fetch(`http://localhost:5000/profile?username=${username}`)
//         .then((res) => {
//           if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//           return res.json();
//         })
//         .then((data) => {
//           setProfile(data);
//           setError(null);
//         })
//         .catch((err) => {
//           console.error('Failed to fetch staff profile:', err);
//           setError('Failed to load profile.');
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//       setError('No staff user logged in.');
//     }
//   }, []);

//   return (
//     <div className="profile-page">
//       <StaffHamburgerMenu />
//       <div className="profile-container">
//         <h2>👤 Staff Profile</h2>
//         {loading && <p className="loading-message">Loading profile...</p>}
//         {error && <p className="error-message">{error}</p>}
//         {!loading && !error && profile && (
//           <div>
//             <p className="profile-detail"><strong>Name:</strong> {profile.name}</p>
//             <p className="profile-detail"><strong>Email:</strong> {profile.email}</p>
//             <p className="profile-detail"><strong>Phone:</strong> {profile.phone}</p>
//             <p className="profile-detail"><strong>Address:</strong> {profile.street}, {profile.city}, {profile.country}</p>
//             <p className="profile-detail"><strong>Join Date:</strong> {profile.join_date}</p>
//             <p className="profile-detail"><strong>Designation:</strong> {profile.designation}</p>
//             <p className="profile-detail"><strong>Branch ID:</strong> {profile.branch_id}</p>
//             <p className="profile-detail"><strong>Branch Name:</strong> {profile.branch_name}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default StaffProfile;




// import React, { useEffect, useState } from 'react';
// import StaffHamburgerMenu from './StaffHamburgerMenu';
// import './DashboardPage.css';

// function StaffProfile() {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // ✅ Get username from localStorage ONCE and store in variable
//   const storedUser = JSON.parse(localStorage.getItem('user')) || {};
//   const username = storedUser.username;

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/staff/profile?username=${username}`);

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || 'Error fetching profile');
//         setProfile(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (username) {
//       fetchProfile();
//     } else {
//       setError('No username found.');
//       setLoading(false);
//     }
//   }, [username]);

//   return (
//     <div className="dashboard-container">
//       <div className="hamburger-wrapper">
//         <StaffHamburgerMenu />
//       </div>
//       <h2 className="dashboard-greeting">👤 Staff Profile</h2>
//       {loading && <p>Loading...</p>}
//       {error && <p>{error}</p>}
//       {profile && (
//         <div>
//           <p><strong>Name:</strong> {profile.name}</p>
//           <p><strong>Email:</strong> {profile.email}</p>
//           <p><strong>Phone:</strong> {profile.phone}</p>
//           <p><strong>Address:</strong> {profile.street}, {profile.city}, {profile.country}</p>
//           <p><strong>Join Date:</strong> {profile.join_date}</p>
//           <p><strong>Designation:</strong> {profile.designation}</p>
//           <p><strong>Branch ID:</strong> {profile.branch_id}</p>
//           <p><strong>Branch Name:</strong> {profile.branch_name}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StaffProfile;


import React, { useEffect, useState } from 'react';
import StaffTopBar from './StaffTopBar';
import './StaffProfile.css';

function StaffProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get username from localStorage ONCE
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const username = storedUser.username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/staff-main/staffProfile?username=${username}`);

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error fetching profile');
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    } else {
      setError('No username found.');
      setLoading(false);
    }
  }, [username]);

  return (
    <div className="staff-profile-container">
      <StaffTopBar />
      <div className="staff-profile-content">
        <div className="profile-header">
          <h1 className="profile-title">Staff Profile</h1>
          <div className="profile-subtitle">Your personal information and details</div>
        </div>

        {loading && (
          <div className="loading-message">Loading profile...</div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        {profile && (
          <div className="profile-card">
            <div className="profile-section">
              <h2 className="section-title">Personal Information</h2>
              <div className="profile-grid">
                <div className="profile-item">
                  <span className="profile-label">Full Name</span>
                  <span className="profile-value">{profile.name}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Email Address</span>
                  <span className="profile-value">{profile.email}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Phone Number</span>
                  <span className="profile-value">{profile.phone}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Address</span>
                  <span className="profile-value">{profile.street}, {profile.city}, {profile.country}</span>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h2 className="section-title">Work Information</h2>
              <div className="profile-grid">
                <div className="profile-item">
                  <span className="profile-label">Designation</span>
                  <span className="profile-value">{profile.designation}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Join Date</span>
                  <span className="profile-value">{new Date(profile.join_date).toLocaleDateString()}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Branch ID</span>
                  <span className="profile-value">{profile.branch_id}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Branch Name</span>
                  <span className="profile-value">{profile.branch_name}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffProfile;
