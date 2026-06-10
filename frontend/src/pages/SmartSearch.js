import React, { useState, useEffect } from 'react';
import './SmartSearch.css';

const SmartSearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [allResults, setAllResults] = useState([]);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/search/suggestions?query=${query}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleSelect = async (bookId) => {
    try {
      const res = await fetch(`http://localhost:5000/search/details/${bookId}`);
      const data = await res.json();
      setSelectedBook(data);
      setAllResults([]); // clear general list
      setSuggestions([]); // clear suggestions
    } catch (err) {
      console.error('Error fetching book details:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/search/suggestions?query=${query}`);
      const data = await res.json();
      setAllResults(data);
      setSelectedBook(null);
    } catch (err) {
      console.error('Error searching:', err);
    }
  };

  return (
    <div className="smart-search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search by anything (author, title, genre...)"
          value={query}
          onChange={(e) => {setQuery(e.target.value);
             setSelectedBook(null); // ✅ clear previously selected book
          }}
        />
        <button type="submit">Search</button>
      </form>

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((sug) => (
            <li key={sug.book_id} onClick={() => handleSelect(sug.book_id)}>
              {sug.title}
            </li>
          ))}
        </ul>
      )}

      {selectedBook && (
        <div className="book-detail">
          <h2>{selectedBook.title}</h2>
          <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
          <p><strong>Authors:</strong> {selectedBook.authors.join(', ')}</p>
          <p><strong>Genres:</strong> {selectedBook.genres.join(', ')}</p>
          <p><strong>Language:</strong> {selectedBook.language}</p>
          <p><strong>Edition:</strong> {selectedBook.edition}</p>
          <p><strong>Publisher:</strong> {selectedBook.publisher_name}</p>
          <p><strong>Year:</strong> {selectedBook.publish_year}</p>
          <p><strong>Price:</strong> ${selectedBook.price}</p>
        </div>
      )}

      {allResults.length > 0 && (
        <div className="book-grid">
          {allResults.map((book) => (
            <div key={book.book_id} className="book-card" onClick={() => handleSelect(book.book_id)}>
              {book.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
