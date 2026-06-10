


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BookDetails.css';

const BookDetails = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/books/${bookId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch book: ${res.status}`);
        return res.json();
      })
      .then((data) => setBook(data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load book details.');
      });
  }, [bookId]);

  if (error) return <div className="book-detail-container"><p>{error}</p></div>;
  if (!book) return <div className="book-detail-container"><p>Loading...</p></div>;

  const coverUrl = `http://localhost:5000/static/${book.cover_filename || 'default-cover.jpg'}`;

  const handleConfirmRequest = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.username) {
      alert('Please login to request a book.');
      navigate('/login');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/request/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, bookId }),
      });
      const data = await res.json();
      alert(data.message || 'Request submitted.');
    } catch {
      alert('Request failed.');
    }
  };

  const displayedReviews = showAllReviews ? book.reviews : (book.reviews || []).slice(0, 3);

  return (
    <div className="book-detail-container">
      <div className="cover-section">
        <img
          src={coverUrl}
          alt={`${book.title} cover`}
          className="large-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'http://localhost:5000/static/default-cover.jpg';
          }}
        />
      </div>

      <div className="info-section">
        <h1>{book.title}</h1>
        <p><strong>Author:</strong> {book.author?.join(', ') || 'Unknown'}</p>
        <p><strong>Genre:</strong> {book.genre?.join(', ') || 'N/A'}</p>
        <p><strong>Publisher:</strong> {book.publisher || 'N/A'}</p>
        <p><strong>ISBN:</strong> {book.isbn || 'N/A'}</p>
        <p><strong>Price:</strong> {book.price || 'N/A'}</p>
        <p><strong>Publication Year:</strong> {book.publish_year || 'N/A'}</p>
        <p><strong>Language:</strong> {book.language || 'N/A'}</p>

        {book.description && (
          <div className="description-block">
            <h3>Description</h3>
            <p>{book.description}</p>
          </div>
        )}

        <div className="reviews-section">
          {/* <h3>Reviews</h3> */}
          <h3>
            Reviews{book.average_rating ? ` — Rating (${book.average_rating}/5)` : ''}
          </h3>
          {displayedReviews.length === 0 && <p>No reviews yet.</p>}
          {displayedReviews.map((review) => (
            <div key={review.review_id} className="review-block">
              <div className="rating">Rating: {review.rating}/5</div>
              <div className="text">"{review.description}"</div>
            </div>
          ))}
          {book.reviews && book.reviews.length > 3 && (
            <button
              className="see-more-btn"
              onClick={() => setShowAllReviews(!showAllReviews)}
            >
              {showAllReviews ? 'Show less' : 'See more reviews'}
            </button>
          )}
        </div>

        {book.related_books && book.related_books.length > 0 && (
          <div className="related-section">
            <h3>Related Books</h3>
            <div className="related-books-row">
              {book.related_books.map((related) => (
                <div
                  key={related.book_id}
                  className="related-book-card"
                  onClick={() => navigate(`/book/${related.book_id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') navigate(`/book/${related.book_id}`);
                  }}
                >
                  <img
                    src={`http://localhost:5000/static/${related.cover_filename || 'default-cover.jpg'}`}
                    alt={`${related.title} cover`}
                    className="related-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'http://localhost:5000/static/default-cover.jpg';
                    }}
                  />
                  <div className="related-title">{related.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="confirm-request-btn" onClick={handleConfirmRequest}>
          Confirm Request
        </button>
      </div>
    </div>
  );
};

export default BookDetails;
