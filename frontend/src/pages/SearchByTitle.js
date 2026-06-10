
import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './SearchByTitle.css';



const SearchByTitle = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState('');
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState(''); // 'author' | 'publisher' | 'genre'
  const [suggestedBooks, setSuggestedBooks] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const scrollRef = useRef(null);
   

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.username || '';

  // Fetch book suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setSuggestionsLoading(true);
        
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
        setSuggestedBooks(shuffledBooks.slice(0, 20)); // Limit to 20 books for performance
        
      } catch (error) {
        console.error('Failed to fetch book suggestions:', error);
        
        // Fallback to sample data if API fails
        const fallbackBooks = [
          { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover_filename: null },
          { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", cover_filename: null },
          { id: 3, title: "1984", author: "George Orwell", cover_filename: null },
          { id: 4, title: "Pride and Prejudice", author: "Jane Austen", cover_filename: null },
          { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger", cover_filename: null },
        ];
        setSuggestedBooks(fallbackBooks);
      } finally {
        setSuggestionsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setMessage('Please enter a title to search.');
      setBooks([]);
      return;
    }

    setMessage('Searching...');
    setBooks([]);

    fetch(`http://localhost:5000/search/search-books?title=${encodeURIComponent(searchTerm)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setMessage(data.length === 0 ? 'No results found.' : '');
        setBooks(data);
      })
      .catch(err => {
        console.error('Search error:', err);
        setMessage('Error fetching books.');
        setBooks([]);
      });
  };

  const handleClickDetails = (type, id) => {
    if (!id) return;

    fetch(`http://localhost:5000/search/${type}-details/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`${type} not found`);
        return res.json();
      })
      .then(data => {
        setModalData(data);
        setModalType(type);
      })
      .catch(err => {
        console.error(`Error fetching ${type} details:`, err);
        setModalData({ error: `${type} details not found.` });
        setModalType(type);
      });
  };

  const closeModal = () => {
    setModalData(null);
    setModalType('');
  };

   // 🔁 New: Confirm book request
  const handleConfirm = async (bookId) => {
    try {
      const res = await fetch('http://localhost:5000/request/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, bookId }),
      });

      const data = await res.json();
      alert(data.message); // 🔁 show in popup
      setMessage(data.message);
    } catch {
      alert('Request failed.');
      setMessage('Request failed.');
    }
  };

  return (
    <div className="search-title-container">
      <h1 className="gothic-header">Search Books by Title</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter book title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}><span>Search</span></button>
      </div>

      {message && <p className="message">{message}</p>}

      {books.length > 0 && (
        <ul className="book-list">
          {books.map(book => (
            <li key={book.book_id} className="book-card">
              <h3>{book.title}</h3>
              <p><strong>ISBN:</strong> {book.isbn}</p>
              <p><strong>Year:</strong> {book.publish_year}</p>
              <p><strong>Language:</strong> {book.language}</p>
              <p><strong>Edition:</strong> {book.edition}</p>
              <p><strong>Price:</strong> ${book.price}</p>

              <p>
                <strong>Author:</strong>{' '}
                {book.author_names?.split(', ').map((name, index) => (
                  <span
                    key={index}
                    className="clickable"
                    onClick={() => handleClickDetails('author', book.author_ids[index])}
                  >
                    {name}
                    {index < book.author_names.split(', ').length - 1 && ', '}
                  </span>
                ))}
              </p>

              <p>
                <strong>Publisher:</strong>{' '}
                <span
                  className="clickable"
                  onClick={() => handleClickDetails('publisher', book.publisher_id)}
                >
                  {book.publisher_name}
                </span>
              </p>

              <p>
                <strong>Genre:</strong>{' '}
                {book.genre_names?.split(', ').map((genre, index) => (
                  <span
                    key={index}
                    className="clickable"
                    onClick={() => handleClickDetails('genre', book.genre_ids[index])}
                  >
                    {genre}
                    {index < book.genre_names.split(', ').length - 1 && ', '}
                  </span>
                ))}
              </p>
               {/* ✅ Reviews button added here */}
              <p>
                {/* <strong>Reviews:</strong>{' '} */}
                <button
                  className="review-button"
                 onClick={() => window.location.href = `/book/${book.book_id}/reviews`}
                    // onClick={() => navigate(`/book/${book.book_id}/reviews`)}
                >
                  See Reviews
                </button>
              </p>
               {/* ✅ Confirm request button */}
              <p>
                <button
                  className="request-button"
                  onClick={() => handleConfirm(book.book_id)}
                >
                  Confirm Request
                </button>
              </p>
            </li>
          ))}
        </ul>
      )}

      {modalData && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            {modalType === 'author' && (
              <>
                <h2>Author Details</h2>
                <p><strong>Name:</strong> {modalData.first_name} {modalData.last_name}</p>
                <p><strong>Email:</strong> {modalData.email || 'N/A'}</p>
                <p><strong>Pen Name:</strong> {modalData.pen_name || 'N/A'}</p>
                <p><strong>Nationality:</strong> {modalData.nationality || 'N/A'}</p>
                <p><strong>Biography:</strong> {modalData.biography || 'N/A'}</p>
                <p><strong>Awards:</strong> {modalData.awards?.join(', ') || 'None'}</p>
              </>
            )}

            {modalType === 'publisher' && (
              <>
                <h2>Publisher Details</h2>
                <p><strong>Name:</strong> {modalData.publisher_name}</p>
                <p><strong>Website:</strong> {modalData.website}</p>
                <p><strong>Country:</strong> {modalData.country || 'N/A'}</p>
                <p><strong>Established:</strong> {modalData.establish_year || 'N/A'}</p>
              </>
            )}

            {modalType === 'genre' && (
              <>
                <h2>Genre Details</h2>
                <p><strong>Name:</strong> {modalData.name}</p>
                <p><strong>Description:</strong> {modalData.description || 'N/A'}</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Book Suggestions Section */}
      <div className="book-suggestions-section">
        <h3>Book Suggestions</h3>
        {suggestionsLoading ? (
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
                {[...suggestedBooks, ...suggestedBooks].map((book, index) => {
                  const coverUrl = book.cover_filename 
                    ? `http://localhost:5000/static/${book.cover_filename}`
                    : null;
                  return (
                    <div
                      key={`${book.id}-${index}`}
                      className="book-card-suggestion"
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
  );
};

export default SearchByTitle;

