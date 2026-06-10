// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './StaffHamburgerMenu.css'; // Make sure you create this CSS file

// function StaffHamburgerMenu() {
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.clear();
//     setOpen(false);
//     navigate('/');
//   };

//   return (
//     <div className="hamburger-container">
//       <div
//         className="hamburger-icon"
//         onClick={() => setOpen(!open)}
//         role="button"
//         tabIndex={0}
//         aria-label="Toggle menu"
//         onKeyDown={(e) => {
//           if (e.key === 'Enter') setOpen(!open);
//         }}
//       >
//         &#9776;
//       </div>

//       {open && (
//         <div className="menu">
//           <Link to="/staff-profile" onClick={() => setOpen(false)}>Profile</Link>
//           <Link to="/staff-schedule" onClick={() => setOpen(false)}>Schedule</Link>
//           <Link to="/staff-requests" onClick={() => setOpen(false)}>See Requests</Link>
//           <Link to="/staff-dashboard" onClick={() => setOpen(false)}>Search Books</Link>
//           <button
//             onClick={handleLogout}
//             style={{
//               padding: '12px 15px',
//               background: 'none',
//               border: 'none',
//               textAlign: 'left',
//               width: '100%',
//               cursor: 'pointer',
//               fontWeight: '500',
//               color: 'black',
//             }}
//           >
//             Logout
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StaffHamburgerMenu;


// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './StaffHamburgerMenu.css';  // Make sure this CSS file exists with styles below

// function StaffHamburgerMenu() {
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.clear();
//     setOpen(false);
//     navigate('/');
//   };

//   return (
//     <div className="hamburger-container">
//       <div
//         className="hamburger-icon"
//         onClick={() => setOpen(!open)}
//         role="button"
//         tabIndex={0}
//         aria-label="Toggle menu"
//         onKeyDown={(e) => { if (e.key === 'Enter') setOpen(!open); }}
//       >
//         &#9776;
//       </div>

//       {open && (
//         <div className="menu">
//           <Link to="/staff-profile" onClick={() => setOpen(false)}>Profile</Link>
//           <Link to="/staff-schedule" onClick={() => setOpen(false)}>Schedule</Link>
//           <Link to="/staff-requests" onClick={() => setOpen(false)}>See Requests</Link>
//           <Link to="/staff-dashboard" onClick={() => setOpen(false)}>Search Books</Link>
//           <button
//             onClick={handleLogout}
//             style={{
//               padding: '12px 15px',
//               background: 'none',
//               border: 'none',
//               textAlign: 'left',
//               width: '100%',
//               cursor: 'pointer',
//               fontWeight: '500',
//               color: 'black',
//             }}
//           >
//             Logout
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StaffHamburgerMenu;

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './StaffHamburgerMenu.css';  // Make sure this CSS file exists with styles below

// function StaffHamburgerMenu() {
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.clear();
//     setOpen(false);
//     navigate('/');
//   };

//   return (
//     <div className="hamburger-container">
//       <div
//         className="hamburger-icon"
//         onClick={() => setOpen(!open)}
//         role="button"
//         tabIndex={0}
//         aria-label="Toggle menu"
//         onKeyDown={(e) => { if (e.key === 'Enter') setOpen(!open); }}
//       >
//         &#9776;
//       </div>

//       {open && (
//         <div className="menu">
//           <Link to="/staff-profile" onClick={() => setOpen(false)}>Profile</Link>
//           <Link to="/staff-schedule" onClick={() => setOpen(false)}>Schedule</Link>
//           <Link to="/staff-requests" onClick={() => setOpen(false)}>See Requests</Link>
//           <Link to="/staff-dashboard" onClick={() => setOpen(false)}>Search Books</Link>
//           <Link to="/staff-add-books" onClick={() => setOpen(false)}>Add Books</Link>

//           <button
//             onClick={handleLogout}
//             style={{
//               padding: '12px 15px',
//               background: 'none',
//               border: 'none',
//               textAlign: 'left',
//               width: '100%',
//               cursor: 'pointer',
//               fontWeight: '500',
//               color: 'black',
//             }}
//           >
//             Logout
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StaffHamburgerMenu;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StaffHamburgerMenu.css';

function StaffHamburgerMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setOpen(false);
    navigate('/');
  };

  return (
    <div className="hamburger-container">
      <div
        className="hamburger-icon"
        onClick={() => setOpen(!open)}
        role="button"
        tabIndex={0}
        aria-label="Toggle menu"
        onKeyDown={(e) => { if (e.key === 'Enter') setOpen(!open); }}
      >
        &#9776;
      </div>

      {open && (
        <div className="menu">
          <Link to="/staff-profile" onClick={() => setOpen(false)}>Profile</Link>
          <Link to="/staff-schedule" onClick={() => setOpen(false)}>Schedule</Link>
          <Link to="/staff-requests" onClick={() => setOpen(false)}>See Requests</Link>
          <Link to="/staff-return-requests" onClick={() => setOpen(false)}>Process Returns/Lost</Link>
          <Link to="/staff-dashboard" onClick={() => setOpen(false)}>Search Books</Link>
          
          {/* Add this new line for Statistics */}
          <Link to="/staff-statistics" onClick={() => setOpen(false)}>Statistics</Link>
          
          <Link to="/staff-add-books" onClick={() => setOpen(false)}>Add Books</Link>

          <button
            onClick={handleLogout}
            style={{
              padding: '12px 15px',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              width: '100%',
              cursor: 'pointer',
              fontWeight: '500',
              color: 'black',
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default StaffHamburgerMenu;
