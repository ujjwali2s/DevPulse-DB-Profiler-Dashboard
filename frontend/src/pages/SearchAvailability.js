
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import StaffTopBar from './StaffTopBar';
import './SearchAvailability.css';

function SearchAvailability() {
  const location = useLocation();
  const branchId = location.state?.branchId || null;

  const [title, setTitle] = useState('');
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    if (!title.trim()) {
      setMessage('Please enter a book title');
      setBooks([]);
      return;
    }

    if (!branchId) {
      setMessage('Branch ID not found. Please login again.');
      return;
    }

    setMessage('Searching...');
    try {
      const response = await fetch(
        `http://localhost:5000/staff/staffbooksearch?title=${encodeURIComponent(title)}&branchId=${branchId}`
      );
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Error during search');
        setBooks([]);
      } else {
        setBooks(data);
        setMessage(data.length === 0 ? 'No books found.' : '');
      }
    } catch (error) {
      setMessage('Network error: ' + error.message);
      setBooks([]);
    }
  };

  return (
    <div className="search-availability-container">
      <StaffTopBar />
      <div className="search-availability-content">
        <div className="search-header">
          <h1 className="search-title">Book Availability Search</h1>
          <div className="search-subtitle">Find available copies in your branch</div>
          <div className="branch-info">Branch ID: {branchId || 'Not available'}</div>
        </div>

        <div className="search-card">
          <div className="search-form">
            <div className="form-group">
              <label className="form-label">Book Title</label>
              <input
                type="text"
                placeholder="Enter book title to search"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="search-input"
              />
            </div>
            <button onClick={handleSearch} className="search-button">
              <span className="button-icon">🔍</span>
              Search Books
            </button>
          </div>

          {message && (
            <div className={`message ${message.includes('error') || message.includes('Error') ? 'message-error' : 'message-info'}`}>
              {message}
            </div>
          )}

          {books.length > 0 && (
            <div className="results-section">
              <h3 className="result-title">Search Results</h3>
              <div className="book-results">
                {books.map((book) => (
                  <div key={book.book_id} className="book-card">
                    <div className="book-header">
                      <h4 className="book-title">{book.title}</h4>
                      <div className="availability-badge">
                        Available: {book.available_copies}
                      </div>
                    </div>
                    <div className="book-details">
                      <div className="detail-item">
                        <span className="detail-label">ISBN:</span>
                        <span className="detail-value">{book.isbn}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Year:</span>
                        <span className="detail-value">{book.publish_year}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Language:</span>
                        <span className="detail-value">{book.language}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Edition:</span>
                        <span className="detail-value">{book.edition}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Price:</span>
                        <span className="detail-value">${book.price}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Publisher:</span>
                        <span className="detail-value">{book.publisher_name}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Genres:</span>
                        <span className="detail-value">{book.genre_names.join(', ')}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Authors:</span>
                        <span className="detail-value">{book.author_names.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchAvailability;

