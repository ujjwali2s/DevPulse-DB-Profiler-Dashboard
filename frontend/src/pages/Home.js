import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import TopBar from './TopBar';

const Home = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [requestStatus, setRequestStatus] = useState('');
  const [reviewStatus, setReviewStatus] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from the books endpoint first
        let response = await fetch('http://localhost:5000/books');
        
        if (!response.ok) {
          // If that fails, try the home preview endpoint
          response = await fetch('http://localhost:5000/home/books/home-preview');
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // If data is an array of genres (from home-preview), extract books
        let booksData = [];
        if (Array.isArray(data) && data.length > 0 && data[0].books) {
          // This is from home-preview endpoint - extract all books from all genres
          booksData = data.flatMap(genre => 
            genre.books.map(book => ({
              id: book.book_id,
              title: book.title,
              author: book.author,
              cover_filename: book.cover,
              genre: genre.genre_name
            }))
          );
        } else if (Array.isArray(data)) {
          // This is from books endpoint - use directly
          booksData = data.map(book => ({
            id: book.book_id || book.id,
            title: book.title,
            author: book.author,
            cover_filename: book.cover_filename || book.cover,
            genre: book.genre
          }));
        }
        
        // Shuffle the books for random display
        const shuffledBooks = [...booksData].sort(() => Math.random() - 0.5);
        setBooks(shuffledBooks.slice(0, 20)); // Limit to 20 books for performance
        
      } catch (error) {
        console.error('Failed to fetch books:', error);
        
        // Fallback to sample data if API fails
        const fallbackBooks = [
          { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover_filename: null },
          { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", cover_filename: null },
          { id: 3, title: "1984", author: "George Orwell", cover_filename: null },
          { id: 4, title: "Pride and Prejudice", author: "Jane Austen", cover_filename: null },
          { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger", cover_filename: null },
        ];
        setBooks(fallbackBooks);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="home-container">
      <TopBar />
      
      <div className="home-content">
        <div className="welcome-section">
          <h2>Hello, {user?.username}</h2>
          <h1>Ready to jump into your next great read?</h1>
        </div>

        <div className="search-buttons-section">
          <div className="home-buttons">
            <button onClick={() => navigate('/search/title')}>
              <span>Search by Title</span>
              <svg viewBox="-5 -5 110 110" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0,0 C0,0 100,0 100,0 C100,0 100,100 100,100 C100,100 0,100 0,100 C0,100 0,0 0,0" />
              </svg>
            </button>

            <button onClick={() => navigate('/search/author')}>
              <span>Search by Author</span>
              <svg viewBox="-5 -5 110 110" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0,0 C0,0 100,0 100,0 C100,0 100,100 100,100 C100,100 0,100 0,100 C0,100 0,0 0,0" />
              </svg>
            </button>

            <button onClick={() => navigate('/search/language')}>
              <span>Search by Language</span>
              <svg viewBox="-5 -5 110 110" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0,0 C0,0 100,0 100,0 C100,0 100,100 100,100 C100,100 0,100 0,100 C0,100 0,0 0,0" />
              </svg>
            </button>

            <button onClick={() => navigate('/search/genre')}>
              <span>Search by Genre</span>
              <svg viewBox="-5 -5 110 110" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0,0 C0,0 100,0 100,0 C100,0 100,100 100,100 C100,100 0,100 0,100 C0,100 0,0 0,0" />
              </svg>
            </button>
          </div>
        </div>

        <div className="book-suggestions-section">
          <h3>Book Suggestions</h3>
          {loading ? (
            <div className="loading-container">
              <p>Loading books...</p>
            </div>
          ) : (
            <>
              <div className="scrolling-books-container" style={{ position: 'relative' }}>
                <button
                  className="scroll-arrow left"
                  aria-label="Scroll left"
                  onClick={() => {
                    if (scrollRef.current) {
                      scrollRef.current.scrollBy({ left: -164, behavior: 'smooth' });
                    }
                  }}
                  style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}
                >
                  <FaChevronLeft size={20} />
                </button>
                <div className="scrolling-books" ref={scrollRef} style={{ overflowX: 'hidden', display: 'flex', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {[...books, ...books].map((book, index) => {
                    const coverUrl = book.cover_filename 
                      ? `http://localhost:5000/static/${book.cover_filename}`
                      : null;
                    return (
                      <div
                        key={`${book.id}-${index}`}
                        className="book-card"
                        tabIndex={0}
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/book/${book.id}`)}
                        onKeyDown={e => { if (e.key === 'Enter') navigate(`/book/${book.id}`); }}
                      >
                        <div className="book-cover">
                          {coverUrl ? (
                            <img 
                              src={coverUrl} 
                              alt={book.title}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                          ) : null}
                          <div className="book-cover-fallback" style={{ display: coverUrl ? 'none' : 'block' }}>
                            📚
                          </div>
                        </div>
                        <div className="book-info">
                          <h4>{book.title}</h4>
                          <p>{book.author}</p>
                          {book.genre && <span className="book-genre">{book.genre}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  className="scroll-arrow right"
                  aria-label="Scroll right"
                  onClick={() => {
                    if (scrollRef.current) {
                      scrollRef.current.scrollBy({ left: 164, behavior: 'smooth' });
                    }
                  }}
                  style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}
                >
                  <FaChevronRight size={20} />
                </button>
              </div>
              <div className="scroll-control-bar" style={{ 
                width: '100%', 
                height: '8px', 
                background: '#e2e8f0', 
                borderRadius: '4px', 
                marginTop: '1rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div className="scroll-indicator" style={{
                  height: '100%',
                  background: '#64748b',
                  borderRadius: '4px',
                  width: '20%',
                  transition: 'transform 0.3s ease'
                }}></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
