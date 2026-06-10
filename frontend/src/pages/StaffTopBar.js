// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaHome, FaCalendarAlt, FaClipboardList, FaExchangeAlt, FaSearch } from 'react-icons/fa';
// import StaffHamburgerMenu from './StaffHamburgerMenu';
// import './StaffTopBar.css';

// const StaffTopBar = () => {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleSearch = () => {
//     if (searchTerm.trim()) {
//       navigate(`/search-availability?query=${encodeURIComponent(searchTerm)}`);
      
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   return (
//     <div className="staff-topbar">
//       {/* Logo */}
//       <div className="staff-topbar-logo" onClick={() => navigate('/staff-home')}>
//         <div className="paper-trail-logo">
//           <span className="paper-trail-text">Paper</span>
//           <span className="trail-text">Trail</span>
//           <div className="floating-paper"></div>
//           <div className="floating-paper"></div>
//           <div className="floating-paper"></div>
//           <div className="mini-book"></div>
//           <div className="mini-book"></div>
//           <div className="pencil"></div>
//           <div className="pencil"></div>
//           <div className="ink-drop"></div>
//           <div className="ink-drop"></div>
//           <div className="paper-plane"></div>
//         </div>
//         <div className="sparkle"></div>
//       </div>

//       {/* Search Section */}
//       <div className="staff-search-section">
//         <div className="staff-search-container">
//           <input
//             type="text"
//             placeholder="Search available copies..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="staff-search-input"
//           />
//           <button 
//             onClick={handleSearch}
//             className="staff-search-button"
//             aria-label="Search"
//           >
//             <FaSearch />
//           </button>
//         </div>
//       </div>

//       {/* Navigation Icons */}
//       <div className="staff-nav-icons">
//         <button
//           className="staff-nav-icon"
//           onClick={() => navigate('/staff-home')}
//           title="Home"
//           aria-label="Home"
//         >
//           <FaHome />
//         </button>

//         <button
//           className="staff-nav-icon"
//           onClick={() => navigate('/staff-schedule')}
//           title="Schedule"
//           aria-label="Schedule"
//         >
//           <FaCalendarAlt />
//         </button>

//         <button
//           className="staff-nav-icon"
//           onClick={() => navigate('/staff-requests')}
//           title="See Requests"
//           aria-label="See Requests"
//         >
//           <FaClipboardList />
//         </button>

//         <button
//           className="staff-nav-icon"
//           onClick={() => navigate('/staff-return-requests')}
//           title="Process Returns/Lost"
//           aria-label="Process Returns and Lost Items"
//         >
//           <FaExchangeAlt />
//         </button>
//       </div>

//       {/* Hamburger Menu */}
//       <div className="staff-hamburger-wrapper">
//         <StaffHamburgerMenu />
//       </div>
//     </div>
//   );
// };

// export default StaffTopBar;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaClipboardList, FaExchangeAlt, FaSearch } from 'react-icons/fa';
import StaffHamburgerMenu from './StaffHamburgerMenu';
import './StaffTopBar.css';

const StaffTopBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const branchId = 1; // Replace with actual logic or pass as prop

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setMessage('');
      setBooks([]);
      return;
    }

    if (!branchId) {
      setMessage('Branch ID not found.');
      setBooks([]);
      return;
    }

    setLoading(true);
    setMessage('Searching...');
    try {
      const response = await fetch(
        `http://localhost:5000/staff/staffbooksearch?title=${encodeURIComponent(searchTerm)}&branchId=${branchId}`
      );
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Error during search');
        setBooks([]);
      } else {
        setBooks(data);
        setMessage(data.length === 0 ? 'No books found.' : '');
      }
    } catch (err) {
      setMessage('Network error');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="staff-topbar">
      {/* Logo */}
      <div className="staff-topbar-logo" onClick={() => navigate('/staff-home')}>
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
      </div>

      {/* Search Section */}
      <div className="staff-search-section">
        <div className="staff-search-container">
          <input
            type="text"
            placeholder="Search available copies..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!e.target.value.trim()) {
                setBooks([]);
                setMessage('');
              }
            }}
            onKeyPress={handleKeyPress}
            className="staff-search-input"
          />
          <button onClick={handleSearch} className="staff-search-button" aria-label="Search">
            <FaSearch />
          </button>
        </div>

        {(books.length > 0 || message) && (
          <div className="staff-search-results">
            {loading ? (
              <div className="search-loading">Loading...</div>
            ) : message ? (
              <div className="search-message">{message}</div>
            ) : (
              <ul className="search-results-list">
                {books.map((book) => (
                  <li key={book.book_id} className="search-result-item">
                    <strong>{book.title}</strong> — Available: {book.available_copies}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Navigation Icons */}
      <div className="staff-nav-icons">
        <button className="staff-nav-icon" onClick={() => navigate('/staff-home')} title="Home">
          <FaHome />
        </button>
        <button className="staff-nav-icon" onClick={() => navigate('/staff-schedule')} title="Schedule">
          <FaCalendarAlt />
        </button>
        <button className="staff-nav-icon" onClick={() => navigate('/staff-requests')} title="See Requests">
          <FaClipboardList />
        </button>
        <button
          className="staff-nav-icon"
          onClick={() => navigate('/staff-return-requests')}
          title="Process Returns and Lost Items"
        >
          <FaExchangeAlt />
        </button>
      </div>

      {/* Hamburger Menu */}
      <div className="staff-hamburger-wrapper">
        <StaffHamburgerMenu />
      </div>
    </div>
  );
};

export default StaffTopBar;
