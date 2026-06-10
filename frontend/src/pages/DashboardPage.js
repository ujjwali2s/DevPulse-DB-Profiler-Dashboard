// // import React, { useEffect, useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import HamburgerMenu from './HamburgerMenu';
// // import './DashboardPage.css';

// // const DashboardPage = () => {
// //   const user = JSON.parse(localStorage.getItem('user')) || {};
// //   const memberId = user.member_id;
// //   const navigate = useNavigate();

// //   const [recentBorrows, setRecentBorrows] = useState([]);
// //   const [popularBooks, setPopularBooks] = useState([]);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     if (!memberId) {
// //       setError('User not logged in');
// //       return;
// //     }

// //     fetch(`http://localhost:5000/member-dashboard/borrowed/${memberId}`)
// //       .then((res) => res.ok ? res.json() : Promise.reject(res))
// //       .then((data) => setRecentBorrows(data))
// //       .catch((err) => {
// //         console.error('Error fetching borrowed books:', err);
// //         setError('Failed to load recent borrowed books');
// //       });

// //     fetch('http://localhost:5000/member-dashboard/popular')
// //       .then((res) => res.ok ? res.json() : Promise.reject(res))
// //       .then((data) => setPopularBooks(data))
// //       .catch((err) => {
// //         console.error('Error fetching popular books:', err);
// //         setError('Failed to load popular books');
// //       });
// //   }, [memberId]);

// //   const goToBook = (bookId) => navigate(`/book/${bookId}`);
// //   const goToHistory = () => navigate('/history');

// //   const renderBookCards = (books, context = '') => (
// //     <div className="book-row">
// //       {books.map((book, idx) => {
// //         const coverUrl = `http://localhost:5000/static/${book.cover || 'default-cover.jpg'}`;
// //         const uniqueKey = `${context}-${book.book_id}-${idx}`; // ✅ Ensure uniqueness

// //         return (
// //           <div
// //             key={uniqueKey}
// //             className="book-card"
// //             onClick={() => goToBook(book.book_id)}
// //             role="button"
// //             tabIndex={0}
// //             onKeyPress={(e) => e.key === 'Enter' && goToBook(book.book_id)}
// //           >
// //             <img
// //               src={coverUrl}
// //               alt={`${book.title} cover`}
// //               className="book-cover"
// //               loading="lazy"
// //               onError={(e) => {
// //                 e.target.onerror = null;
// //                 e.target.src = 'http://localhost:5000/static/default-cover.jpg';
// //               }}
// //             />
// //             <div className="book-title">{book.title}</div>
// //             <div className="book-author">{book.author}</div>
// //           </div>
// //         );
// //       })}
// //     </div>
// //   );

// //   return (
// //     <div className="dashboard-container">
// //       <div className="hamburger-wrapper">
// //         <HamburgerMenu />
// //       </div>

// //       <h2 className="dashboard-greeting">Hello, {user.username || 'Member'}</h2>
// //       <p>Welcome to your dashboard. Use the menu to navigate.</p>

// //       {error && (
// //         <div className="error-message">
// //           ❌ {error}
// //         </div>
// //       )}

// //       {/* Recently Borrowed */}
// //       <section className="dashboard-section">
// //         <h3>📚 Recently Borrowed</h3>
// //         {recentBorrows.length === 0 ? (
// //           <p>No recent borrowed books.</p>
// //         ) : (
// //           renderBookCards(recentBorrows, 'recent')
// //         )}
// //         <button onClick={goToHistory}>See More</button>
// //       </section>

// //       {/* Most Popular */}
// //       <section className="dashboard-section">
// //         <h3>🔥 Most Popular This Month</h3>
// //         {popularBooks.length === 0 ? (
// //           <p>No popular books found.</p>
// //         ) : (
// //           renderBookCards(popularBooks, 'popular')
// //         )}
// //       </section>
// //     </div>
// //   );
// // };

// // export default DashboardPage;

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import HamburgerMenu from './HamburgerMenu';
// import SmartSearch from './SmartSearch';
// import { FiBell, FiBookOpen, FiClock, FiUser } from 'react-icons/fi';
// import './DashboardPage.css';

// const DashboardPage = () => {
//   const user = JSON.parse(localStorage.getItem('user')) || {};
//   const memberId = user.member_id;
//   const navigate = useNavigate();

//   const [recentBorrows, setRecentBorrows] = useState([]);
//   const [popularBooks, setPopularBooks] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!memberId) {
//       setError('User not logged in');
//       return;
//     }

//     fetch(`http://localhost:5000/member-dashboard/borrowed/${memberId}`)
//       .then((res) => (res.ok ? res.json() : Promise.reject(res)))
//       .then((data) => setRecentBorrows(data))
//       .catch((err) => {
//         console.error('Error fetching borrowed books:', err);
//         setError('Failed to load recent borrowed books');
//       });

//     fetch('http://localhost:5000/member-dashboard/popular')
//       .then((res) => (res.ok ? res.json() : Promise.reject(res)))
//       .then((data) => setPopularBooks(data))
//       .catch((err) => {
//         console.error('Error fetching popular books:', err);
//         setError('Failed to load popular books');
//       });
//   }, [memberId]);

//   // Navigation handlers
//   const goToBook = (bookId) => navigate(`/book/${bookId}`);
//   const goToHistory = () => navigate('/history');

//   // Top bar icon config
//   const topBarIcons = [
//     { Icon: FiBell, label: 'Notifications', path: '/notifications' },
//     { Icon: FiBookOpen, label: 'My Books', path: '/readlist' },
//     { Icon: FiClock, label: 'History', path: '/history' },
//     { Icon: FiUser, label: 'Profile', path: '/profile' },
//   ];

//   // Render book cards helper
//   const renderBookCards = (books, context = '') => (
//     <div className="book-row">
//       {books.map((book, idx) => {
//         const coverUrl = `http://localhost:5000/static/${book.cover || 'default-cover.jpg'}`;
//         const uniqueKey = `${context}-${book.book_id}-${idx}`;

//         return (
//           <div
//             key={uniqueKey}
//             className="book-card"
//             onClick={() => goToBook(book.book_id)}
//             role="button"
//             tabIndex={0}
//             onKeyPress={(e) => e.key === 'Enter' && goToBook(book.book_id)}
//           >
//             <img
//               src={coverUrl}
//               alt={`${book.title} cover`}
//               className="book-cover"
//               loading="lazy"
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = 'http://localhost:5000/static/default-cover.jpg';
//               }}
//             />
//             <div className="book-title">{book.title}</div>
//             <div className="book-author">{book.author}</div>
//           </div>
//         );
//       })}
//     </div>
//   );

//   return (
//     <div className="dashboard-container">
//       {/* Top bar with hamburger, search, and icons */}
//       <div className="dashboard-topbar-container">
//         <HamburgerMenu />

//         <div className="dashboard-topbar-search">
//           <SmartSearch />
//         </div>

//         <div className="dashboard-topbar-icons">
//           {topBarIcons.map(({ Icon, label, path }) => (
//             <div
//               key={label}
//               className="topbar-icon"
//               onClick={() => navigate(path)}
//               title={label}
//               role="button"
//               tabIndex={0}
//               onKeyDown={(e) => e.key === 'Enter' && navigate(path)}
//             >
//               <Icon size={24} />
//             </div>
//           ))}
//         </div>
//       </div>

//       <h2 className="dashboard-greeting">Hello, {user.username || 'Member'}</h2>
//       <p>Welcome to your dashboard. Use the menu to navigate.</p>

//       {error && <div className="error-message">❌ {error}</div>}

//       {/* Recently Borrowed Section */}
//       <section className="dashboard-section">
//         <h3>📚 Recently Borrowed</h3>
//         {recentBorrows.length === 0 ? (
//           <p>No recent borrowed books.</p>
//         ) : (
//           renderBookCards(recentBorrows, 'recent')
//         )}
//         <button onClick={goToHistory}>See More</button>
//       </section>

//       {/* Most Popular Section */}
//       <section className="dashboard-section">
//         <h3>🔥 Most Popular This Month</h3>
//         {popularBooks.length === 0 ? (
//           <p>No popular books found.</p>
//         ) : (
//           renderBookCards(popularBooks, 'popular')
//         )}
//       </section>
//     </div>
//   );
// };

// export default DashboardPage;



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import './DashboardPage.css';

const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const memberId = user.member_id;
  const navigate = useNavigate();

  const [recentBorrows, setRecentBorrows] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!memberId) {
      setError('User not logged in');
      return;
    }

    fetch(`http://localhost:5000/member-dashboard/borrowed/${memberId}`)
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => setRecentBorrows(data))
      .catch((err) => {
        console.error('Error fetching borrowed books:', err);
        setError('Failed to load recent borrowed books');
      });

    fetch('http://localhost:5000/member-dashboard/popular')
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => setPopularBooks(data))
      .catch((err) => {
        console.error('Error fetching popular books:', err);
        setError('Failed to load popular books');
      });
  }, [memberId]);

  const goToBook = (bookId) => navigate(`/book/${bookId}`);
  const goToHistory = () => navigate('/history');

  const renderBookCards = (books, context = '') => (
    <div className="book-row">
      {books.map((book, idx) => {
        const coverUrl = `http://localhost:5000/static/${book.cover || 'default-cover.jpg'}`;
        const uniqueKey = `${context}-${book.book_id}-${idx}`;

        return (
          <div
            key={uniqueKey}
            className="book-card"
            onClick={() => goToBook(book.book_id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && goToBook(book.book_id)}
          >
            <img
              src={coverUrl}
              alt={`${book.title} cover`}
              className="book-cover"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'http://localhost:5000/static/default-cover.jpg';
              }}
            />
            <div className="book-title">{book.title}</div>
            <div className="book-author">{book.author}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <TopBar />

      <main className="dashboard-main">
        <h2 className="dashboard-greeting">Hello, {user.username || 'Member'}</h2>
        <p>Welcome to your dashboard. Use the menu to navigate.</p>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* Recently Borrowed */}
        <section className="dashboard-section">
          <h3>📚 Recently Borrowed</h3>
          {recentBorrows.length === 0 ? (
            <p>No recent borrowed books.</p>
          ) : (
            renderBookCards(recentBorrows, 'recent')
          )}
          <button onClick={goToHistory} className="see-more-btn">See More</button>
        </section>

        {/* Most Popular */}
        <section className="dashboard-section">
          <h3>🔥 Most Popular This Month</h3>
          {popularBooks.length === 0 ? (
            <p>No popular books found.</p>
          ) : (
            renderBookCards(popularBooks, 'popular')
          )}
        </section>
      </main>
    </>
  );
};

export default DashboardPage;
