// // import React, { useEffect, useState } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import './GenrePage.css';

// // function GenrePage() {
// //   const { genreId } = useParams();
// //   const navigate = useNavigate();
// //   const [books, setBooks] = useState([]);
// //   const [expandedReviews, setExpandedReviews] = useState({});
// //   const [modalBookId, setModalBookId] = useState(null); // for modal display

// //   useEffect(() => {
// //     fetch(`http://localhost:5000/genre/${genreId}/books-with-reviews`)
// //       .then((res) => res.json())
// //       .then((data) => setBooks(data))
// //       .catch((err) => console.error('Failed to fetch books for genre:', err));
// //   }, [genreId]);

// //   const toggleReviews = (bookId) => {
// //     setExpandedReviews((prev) => ({
// //       ...prev,
// //       [bookId]: !prev[bookId],
// //     }));
// //   };

// //   const handleRead = (bookId) => {
// //     setModalBookId(bookId);
// //   };

// //   const closeModal = () => setModalBookId(null);

// //   const goToLogin = () => navigate('/login');
// //   const goToSignup = () => navigate('/signup-step1');

// //   return (
// //     <div className="genre-page-container">
// //       <h1 className="genre-header">Books in This Genre</h1>
// //       {books.length === 0 ? (
// //         <p>Loading books...</p>
// //       ) : (
// //         books.map((book) => (
// //           <div key={book.book_id} className="genre-book-card">
// //             <img
// //               src={`http://localhost:5000/static/${book.cover || 'default-cover.jpg'}`}
// //               alt={book.title}
// //               className="genre-book-cover"
// //               onError={(e) => {
// //                 e.target.onerror = null;
// //                 e.target.src = 'http://localhost:5000/static/default-cover.jpg';
// //               }}
// //             />
// //             <div className="genre-book-info">
// //               <h2>{book.title}</h2>
// //               <p><strong>Author:</strong> {book.author}</p>

// //               <div className="review-section">
// //                 <h4>Reviews:</h4>
// //                 {book.reviews && book.reviews.length > 0 ? (
// //                   <>
// //                     {(expandedReviews[book.book_id]
// //                       ? book.reviews
// //                       : book.reviews.slice(0, 2)
// //                     ).map((review) => (
// //                       <div key={review.review_id} className="review-block">
// //                         <div className="rating">Rating: {review.rating}/5</div>
// //                         <div className="text">"{review.description}"</div>
// //                       </div>
// //                     ))}

// //                     {book.reviews.length > 2 && (
// //                       <button
// //                         className="see-more-btn"
// //                         onClick={() => toggleReviews(book.book_id)}
// //                       >
// //                         {expandedReviews[book.book_id] ? 'Show less' : 'See more reviews'}
// //                       </button>
// //                     )}
// //                   </>
// //                 ) : (
// //                   <p>No reviews yet.</p>
// //                 )}
// //               </div>

// //               <button className="read-btn" onClick={() => handleRead(book.book_id)}>
// //                 Read this book
// //               </button>
// //             </div>
// //           </div>
// //         ))
// //       )}

// //       {modalBookId && (
// //         <div className="modal-overlay" onClick={closeModal}>
// //           <div className="modal-box" onClick={(e) => e.stopPropagation()}>
// //             <h2>Are you a member?</h2>
// //             <div className="modal-actions">
// //               <button onClick={goToLogin}>Sign In</button>
// //               <button onClick={goToSignup}>Sign Up</button>
// //             </div>
// //             <button className="close-modal" onClick={closeModal}>×</button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default GenrePage;



// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './GenrePage.css';

// function GenrePage() {
//   const { genreId } = useParams();
//   const navigate = useNavigate();
//   const [books, setBooks] = useState([]);
//   const [expandedReviews, setExpandedReviews] = useState({});
//   const [modalBookId, setModalBookId] = useState(null);
//   const [genreName, setGenreName] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     fetch(`http://localhost:5000/genre/${genreId}/books-with-reviews`)
//       .then((res) => res.json())
//       .then((data) => setBooks(data))
//       .catch((err) => console.error('Failed to fetch books for genre:', err));

//     fetch(`http://localhost:5000/genre/${genreId}/name`)
//       .then((res) => res.json())
//       .then((data) => setGenreName(data.name))
//       .catch((err) => console.error('Failed to fetch genre name:', err));
//   }, [genreId]);

//   const toggleReviews = (bookId) => {
//     setExpandedReviews((prev) => ({
//       ...prev,
//       [bookId]: !prev[bookId],
//     }));
//   };

//   const handleRead = (bookId) => {
//     setModalBookId(bookId);
//   };

//   const closeModal = () => setModalBookId(null);

//   const goToLogin = () => navigate('/login');
//   const goToSignup = () => navigate('/signup-step1');

//   const filteredBooks = books.filter((book) => {
//     const searchLower = searchQuery.toLowerCase();
//     return (
//       book.title.toLowerCase().includes(searchLower) ||
//       book.author.toLowerCase().includes(searchLower)
//     );
//   });

//   return (
//     <div className="genre-page-container">
//       <h1 className="genre-header">Books in <span className="genre-name">{genreName}</span></h1>

//       <input
//         type="text"
//         className="genre-search-bar"
//         placeholder="Search by title or author in this genre..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//       />

//       {books.length === 0 ? (
//         <p>Loading books...</p>
//       ) : filteredBooks.length === 0 ? (
//         <p className="no-match">This book is not in this genre. Please search another genre.</p>
//       ) : (
//         filteredBooks.map((book) => (
//           <div key={book.book_id} className="genre-book-card">
//             <img
//               src={`http://localhost:5000/static/${book.cover || 'default-cover.jpg'}`}
//               alt={book.title}
//               className="genre-book-cover"
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = 'http://localhost:5000/static/default-cover.jpg';
//               }}
//             />
//             <div className="genre-book-info">
//               <h2>{book.title}</h2>
//               <p><strong>Author:</strong> {book.author}</p>

//               <div className="review-section">
//                 <h4>Reviews:</h4>
//                 {book.reviews && book.reviews.length > 0 ? (
//                   <>
//                     {(expandedReviews[book.book_id]
//                       ? book.reviews
//                       : book.reviews.slice(0, 2)
//                     ).map((review) => (
//                       <div key={review.review_id} className="review-block">
//                         <div className="rating">Rating: {review.rating}/5</div>
//                         <div className="text">"{review.description}"</div>
//                       </div>
//                     ))}

//                     {book.reviews.length > 2 && (
//                       <button
//                         className="see-more-btn"
//                         onClick={() => toggleReviews(book.book_id)}
//                       >
//                         {expandedReviews[book.book_id] ? 'Show less' : 'See more reviews'}
//                       </button>
//                     )}
//                   </>
//                 ) : (
//                   <p>No reviews yet.</p>
//                 )}
//               </div>

//               <button className="read-btn" onClick={() => handleRead(book.book_id)}>
//                 Read this book
//               </button>
//             </div>
//           </div>
//         ))
//       )}

//       {modalBookId && (
//         <div className="modal-overlay" onClick={closeModal}>
//           <div className="modal-box" onClick={(e) => e.stopPropagation()}>
//             <h2>Are you a member?</h2>
//             <div className="modal-actions">
//               <button onClick={goToLogin}>Sign In</button>
//               <button onClick={goToSignup}>Sign Up</button>
//             </div>
//             <button className="close-modal" onClick={closeModal}>×</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default GenrePage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './GenrePage.css';

function GenrePage() {
  const { genreId } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [modalBookId, setModalBookId] = useState(null);
  const [genreName, setGenreName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/genre/${genreId}/books-with-reviews`)
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error('Failed to fetch books for genre:', err));

    fetch(`http://localhost:5000/genre/${genreId}/name`)
      .then((res) => res.json())
      .then((data) => setGenreName(data.name))
      .catch((err) => console.error('Failed to fetch genre name:', err));
  }, [genreId]);

  const toggleReviews = (bookId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  const handleRead = (bookId) => {
    setModalBookId(bookId);
  };

  const closeModal = () => setModalBookId(null);

  const goToLogin = () => navigate('/login');
  const goToSignup = () => navigate('/signup-step1');

  const filteredBooks = books.filter((book) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="genre-page-container">
      <h1 className="genre-header">Books in <span className="genre-name">{genreName}</span></h1>

      <input
        type="text"
        className="genre-search-bar"
        placeholder="Search by title or author in this genre..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {books.length === 0 ? (
        <p>Loading books...</p>
      ) : filteredBooks.length === 0 ? (
        <p className="no-match">This book is not in this genre. Please search another genre.</p>
      ) : (
        <div className="genre-book-list">
          {filteredBooks.map((book) => (
            <div key={book.book_id} className="genre-book-card">
              <img
                src={`http://localhost:5000/static/${book.cover || 'default-cover.jpg'}`}
                alt={book.title}
                className="genre-book-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'http://localhost:5000/static/default-cover.jpg';
                }}
              />
              <div className="genre-book-info">
                <h2>{book.title}</h2>
                <p><strong>Author:</strong> {book.author}</p>

                <div className="review-section">
                  <h4>Reviews:</h4>
                  {book.reviews && book.reviews.length > 0 ? (
                    <>
                      {(expandedReviews[book.book_id]
                        ? book.reviews
                        : book.reviews.slice(0, 2)
                      ).map((review) => (
                        <div key={review.review_id} className="review-block">
                          <div className="rating">Rating: {review.rating}/5</div>
                          <div className="text">"{review.description}"</div>
                        </div>
                      ))}

                      {book.reviews.length > 2 && (
                        <button
                          className="see-more-btn"
                          onClick={() => toggleReviews(book.book_id)}
                        >
                          {expandedReviews[book.book_id] ? 'Show less' : 'See more reviews'}
                        </button>
                      )}
                    </>
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>

                <button className="read-btn" onClick={() => handleRead(book.book_id)}>
                  Read this book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalBookId && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Are you a member?</h2>
            <div className="modal-actions">
              <button onClick={goToLogin}>Sign In</button>
              <button onClick={goToSignup}>Sign Up</button>
            </div>
            <button className="close-modal" onClick={closeModal}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenrePage;
