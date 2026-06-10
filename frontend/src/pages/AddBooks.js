import React, { useState } from 'react';
import StaffTopBar from './StaffTopBar';
import './AddBooks.css';

function AddBooks() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [copies, setCopies] = useState(1);
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.username || '';

  const handleAdd = async () => {
    if (!title || !author || copies <= 0) {
      setMessage('❌ Please fill all fields correctly.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/staff-main/addCopies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          author,
          numCopies: Number(copies),
          username,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${data.message}`);
        setTitle('');
        setAuthor('');
        setCopies(1);
      } else {
        setMessage(`❌ ${data.message || 'Something went wrong'}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('❌ Request failed. Please try again.');
    }
  };

  return (
    <div className="add-books-container">
      <StaffTopBar />
      <div className="add-books-content">
        <div className="add-books-header">
          <h1 className="add-books-title">Add Book Copies</h1>
          <div className="add-books-subtitle">Add new books or additional copies to the library</div>
        </div>

        <div className="add-books-card">
          <div className="form-group">
            <label className="form-label">Book Title</label>
            <input
              className="form-input"
              placeholder="Enter book title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Author Name</label>
            <input
              className="form-input"
              placeholder="Enter author full name"
              value={author}
              onChange={e => setAuthor(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Number of Copies</label>
            <input
              className="form-input"
              type="number"
              placeholder="Enter number of copies"
              value={copies}
              onChange={e => setCopies(e.target.value)}
              min="1"
            />
          </div>

          <button onClick={handleAdd} className="add-button">
            Add Copies
          </button>

          {message && (
            <div className={`message ${message.includes('✅') ? 'message-success' : 'message-error'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddBooks;
