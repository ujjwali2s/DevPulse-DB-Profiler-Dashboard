

// import React, { useState } from 'react';
// import TopBar from './TopBar';
// import './Request.css';

// function RequestBook() {
//   const [title, setTitle] = useState('');
//   const [author, setAuthor] = useState('');
//   const [genre, setGenre] = useState('');
//   const [publisher, setPublisher] = useState('');
//   const [isbn, setIsbn] = useState('');
//   const [books, setBooks] = useState([]);
//   const [message, setMessage] = useState('');
//   const user = JSON.parse(localStorage.getItem('user'));
//   const username = user?.username || '';


//   const handleConfirm = async (bookId) => {
//     try {
//       const res = await fetch('http://localhost:5000/request/confirm', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, bookId }),
//       });
//       const data = await res.json();

//       alert(data.message);
//       setMessage(data.message);
//     } catch {
//       alert('Request failed.');
//       setMessage('Request failed.');
//     }
//   };


//       const handleSearch = async () => {
//       if (![title, author, genre, publisher, isbn].some(v => v.trim() !== '')) {
//         setMessage('Please fill at least one field.');
//         setBooks([]);
//         return;
//       }

//       setMessage('Searching...');
//       const params = new URLSearchParams();
//       if (title) params.append('title', title);
//       if (author) params.append('author', author);
//       if (genre) params.append('genre', genre);
//       if (publisher) params.append('publisher', publisher);
//       if (isbn) params.append('isbn', isbn);

//       try {
//         const res = await fetch(`http://localhost:5000/request/searchBook?${params.toString()}`);
//         const data = await res.json();

//         // 🔍 Log the actual backend response
//         console.log('📦 Backend response:', data);

//         if (!res.ok) {
//           alert(data.message || 'Search failed.');
//           setMessage(data.message || 'Search failed.');
//           setBooks([]);
//         } else if (Array.isArray(data)) {
//           setBooks(data);
//           setMessage(data.length === 0 ? 'No books found.' : '');
//         } else if (data && typeof data === 'object') {
//           // Single book object -> convert to array with one item
//           setBooks([data]);
//           setMessage('');
//         } else {
//           setBooks([]);
//           const fallbackMessage = data?.message || 'Unexpected response from server.';
//           setMessage(fallbackMessage);
//           console.warn('⚠️ Unexpected response format:', data);
//         }

//       } catch (err) {
//         console.error('❌ Server error:', err);
//         alert('Server error.');
//         setMessage('Server error.');
//         setBooks([]);
//       }
//     };


//   return (
//     <>
//       <TopBar />
//       <div className="request-page">
//         <h2 className="request-title">📚 Advanced Book Request</h2>

//         <div className="form-group">
//           <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
//           <input placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
//           <input placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} />
//           <input placeholder="Publisher" value={publisher} onChange={e => setPublisher(e.target.value)} />
//         <input placeholder="ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} />
//         <button onClick={handleSearch}>Search Book</button>
//       </div>

//       {message && <p className="status-message">{message}</p>}
//       <div className="results">
//       {Array.isArray(books) && books.map(book => (
//         <div key={book.book_id} className="book-card">
//           <h3>{book.title}</h3>
//           <p><strong>Author:</strong> {Array.isArray(book.authors) ? book.authors.join(', ') : 'N/A'}</p>
//           <p><strong>Genre:</strong> {Array.isArray(book.genres) ? book.genres.join(', ') : 'N/A'}</p>
//           <p><strong>Publisher:</strong> {book.publisher_name || 'N/A'}</p>
//           <p><strong>ISBN:</strong> {book.isbn || 'N/A'}</p>
//           <p><strong>Language:</strong> {book.language || 'N/A'}</p>
//           <p><strong>Price:</strong> ${book.price || 'N/A'}</p>
//           <button onClick={() => handleConfirm(book.book_id)}>Confirm Request</button>
//         </div>
//       ))}
//       </div>

//       </div>
//     </>
//   );
// }

// export default RequestBook;


import React, { useState } from 'react';
import TopBar from './TopBar';
import './Request.css';

function RequestBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [publisher, setPublisher] = useState('');
  const [isbn, setIsbn] = useState('');
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.username || '';

  const handleConfirm = async (bookId) => {
    try {
      const res = await fetch('http://localhost:5000/request/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, bookId }),
      });
      const data = await res.json();
      alert(data.message);
      setMessage(data.message);
    } catch {
      alert('Request failed.');
      setMessage('Request failed.');
    }
  };

  const handleSearch = async () => {
    if (![title, author, genre, publisher, isbn].some(v => v.trim() !== '')) {
      setMessage('Please fill at least one field.');
      setBooks([]);
      return;
    }

    setMessage('Searching...');
    const params = new URLSearchParams();
    if (title) params.append('title', title);
    if (author) params.append('author', author);
    if (genre) params.append('genre', genre);
    if (publisher) params.append('publisher', publisher);
    if (isbn) params.append('isbn', isbn);

    try {
      const res = await fetch(`http://localhost:5000/request/searchBook?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Search failed.');
        setMessage(data.message || 'Search failed.');
        setBooks([]);
      } else if (Array.isArray(data)) {
        setBooks(data);
        setMessage(data.length === 0 ? 'No books found.' : '');
      } else if (data && typeof data === 'object') {
        setBooks([data]);
        setMessage('');
      } else {
        setBooks([]);
        const fallbackMessage = data?.message || 'Unexpected response from server.';
        setMessage(fallbackMessage);
      }
    } catch (err) {
      console.error('❌ Server error:', err);
      alert('Server error.');
      setMessage('Server error.');
      setBooks([]);
    }
  };

  return (
    <>
      <TopBar />
      <div className="request-page">
        <div className="request-container">
          <h2 className="request-title">📚 Advanced Book Request</h2>

          <div className="search-section">
            <h3 className="search-header">Search for Books</h3>
            <div className="form-group">
              <input 
                placeholder="Enter book title" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
              />
              <input 
                placeholder="Enter author name" 
                value={author} 
                onChange={e => setAuthor(e.target.value)} 
              />
              <input 
                placeholder="Enter genre" 
                value={genre} 
                onChange={e => setGenre(e.target.value)} 
              />
              <input 
                placeholder="Enter publisher" 
                value={publisher} 
                onChange={e => setPublisher(e.target.value)} 
              />
              <input 
                placeholder="Enter ISBN" 
                value={isbn} 
                onChange={e => setIsbn(e.target.value)} 
              />
              <button className="search-button" onClick={handleSearch}>
                🔍 Search Books
              </button>
            </div>
          </div>

          {message && <p className="status-message">{message}</p>}

          <div className="results">
            {Array.isArray(books) && books.map(book => (
              <div key={book.book_id} className="book-card">
                <div className="book-header">
                  <h3 className="book-title">{book.title}</h3>
                </div>
                <div className="book-details">
                  <div className="detail-item">
                    <span className="detail-label">Author:</span>
                    <span className="detail-value">
                      {Array.isArray(book.authors) ? book.authors.join(', ') : 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Genre:</span>
                    <span className="detail-value">
                      {Array.isArray(book.genres) ? book.genres.join(', ') : 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Publisher:</span>
                    <span className="detail-value">{book.publisher_name || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">ISBN:</span>
                    <span className="detail-value">{book.isbn || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Language:</span>
                    <span className="detail-value">{book.language || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Price:</span>
                    <span className="detail-value">${book.price || 'N/A'}</span>
                  </div>
                  {book.average_rating && (
                    <div className="detail-item">
                      <span className="detail-label">Rating:</span>
                      <span className="detail-value">{book.average_rating}/5 ⭐</span>
                    </div>
                  )}
                </div>
                <button className="confirm-button" onClick={() => handleConfirm(book.book_id)}>
                  Confirm Request
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestBook;
