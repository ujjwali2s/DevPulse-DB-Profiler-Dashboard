// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './HomePage.css';

// function HomePage() {
//   const navigate = useNavigate();
//   const [genres, setGenres] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     fetch('http://localhost:5000/home/books/home-preview')
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((data) => setGenres(data))
//       .catch((err) => console.error('Failed to fetch genres:', err));
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchTerm.trim()) {
//       navigate(`/search/title?query=${encodeURIComponent(searchTerm.trim())}`);
//     }
//   };

//   const goToBook = (bookId) => navigate(`/book/${bookId}`);
//   const exploreGenre = (genreId) => navigate(`/genre/${genreId}`);
//   const goToLogin = () => navigate('/login');
//   const goToSignup = () => navigate('/signup-step1');

//   return (
//     <div className="home-container">
//       <div className="top-right-buttons">
//         <button onClick={goToLogin}>Sign In</button>
//         <button onClick={goToSignup}>Sign Up</button>
//       </div>

//       <form className="search-bar" onSubmit={handleSearch}>
//         <input
//           type="text"
//           placeholder="Search books by title..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <button type="submit">Search</button>
//       </form>

//       <div className="intro-section">
//         <h1 className="gothic-title1">Paper-Trail</h1>
//         <p className="description">
//           Welcome to Paper-Trail, your digital gateway to explore a vast collection of books across genres, authors, and themes.
//         </p>
//       </div>

//       <div className="explore-section">
//         {genres.length === 0 ? (
//           <p>Loading genres...</p>
//         ) : (
//           genres.map((genre) => (
//             <div key={genre.genre_id} className="genre-section">
//               <h2
//                 className="clickable-genre"
//                 onClick={() => exploreGenre(genre.genre_id)}
//                 title={`Explore more in ${genre.genre_name}`}
//               >
//                 {genre.genre_name}
//               </h2>
//               <div className="book-row">
//                 {genre.books.map((book) => {
//                   const coverUrl = `http://localhost:5000/static/${book.cover || 'default-cover.jpg'}`;
//                   return (
//                     <div
//                       key={book.book_id}
//                       className="book-card"
//                       onClick={() => goToBook(book.book_id)}
//                       role="button"
//                       tabIndex={0}
//                       onKeyPress={(e) => { if (e.key === 'Enter') goToBook(book.book_id); }}
//                     >
//                       <img
//                         src={coverUrl}
//                         alt={`${book.title} cover`}
//                         className="book-cover"
//                         loading="lazy"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = 'http://localhost:5000/static/default-cover.jpg';
//                         }}
//                       />
//                       <div className="book-title">{book.title}</div>
//                       <div className="book-author">{book.author}</div>
//                     </div>
//                   );
//                 })}
//               </div>
//               <button
//                 className="explore-more"
//                 onClick={() => exploreGenre(genre.genre_id)}
//               >
//                 Explore more in {genre.genre_name}
//               </button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default HomePage;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [allResults, setAllResults] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/home/books/home-preview')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setGenres(data))
      .catch((err) => console.error('Failed to fetch genres:', err));
  }, []);

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

  // const handleSelect = async (bookId) => {
  //   try {
  //     const res = await fetch(`http://localhost:5000/search/details/${bookId}`);
  //     const data = await res.json();
  //     setSelectedBook(data);
  //     setAllResults([]);
  //     setSuggestions([]);
  //   } catch (err) {
  //     console.error('Error fetching book details:', err);
  //   }
  // };
  const handleSelect = (bookId) => {
  setQuery('');
  setSuggestions([]);
  navigate(`/book/${bookId}`);
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

  const goToBook = (bookId) => navigate(`/book/${bookId}`);
  const exploreGenre = (genreId) => navigate(`/genre/${genreId}`);
  const goToLogin = () => navigate('/login');
  const goToSignup = () => navigate('/signup-step1');

  return (
    <div className="home-container">
      <div className="top-right-buttons">
        <button onClick={goToLogin}>Sign In</button>
        <button onClick={goToSignup}>Sign Up</button>
      </div>

      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search by anything (author, title, genre...)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedBook(null);
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

      <div className="intro-section">
        <h1 className="gothic-title1">Paper-Trail</h1>
        <p className="description">
          Welcome to Paper-Trail, your digital gateway to explore a vast collection of books across genres, authors, and themes.
        </p>
      </div>

      <div className="explore-section">
        {genres.length === 0 ? (
          <p>Loading genres...</p>
        ) : (
          genres.map((genre) => (
            <div key={genre.genre_id} className="genre-section">
              <h2
                className="clickable-genre"
                onClick={() => exploreGenre(genre.genre_id)}
                title={`Explore more in ${genre.genre_name}`}
              >
                {genre.genre_name}
              </h2>
              <div className="book-row">
                {genre.books.map((book) => {
                  const coverUrl = `http://localhost:5000/static/${book.cover || 'default-cover.jpg'}`;
                  return (
                    <div
                      key={book.book_id}
                      className="book-card"
                      onClick={() => goToBook(book.book_id)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => { if (e.key === 'Enter') goToBook(book.book_id); }}
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
              <button
                className="explore-more"
                onClick={() => exploreGenre(genre.genre_id)}
              >
                Explore more in {genre.genre_name}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;