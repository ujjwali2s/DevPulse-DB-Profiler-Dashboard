import React, { useEffect, useState } from 'react';

function BooksList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const memberId = localStorage.getItem('memberId');
    if (!memberId) {
      // Redirect to login or show message
      window.location.href = '/login';
      return;
    }

    fetch('http://localhost:5000/books') // your backend endpoint
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch books:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading books...</p>;

  return (
    <div>
      <h1>All Books</h1>
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul>
          {books.map(book => (
            <li key={book.id || book.book_id}>{book.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BooksList;
