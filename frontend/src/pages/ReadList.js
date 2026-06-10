import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import './ReadList.css';

function Readlist() {
  const [readlist, setReadlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get memberId from localStorage (or your auth system)
  const memberId = localStorage.getItem('memberId');

  useEffect(() => {
    if (!memberId) {
      navigate('/login');
      return;
    }
    fetchReadlist();
  }, [memberId, navigate]);

  const fetchReadlist = () => {
    fetch(`http://localhost:5000/member/${memberId}/readlist`)
      .then((res) => res.json())
      .then((data) => setReadlist(data))
      .catch((err) => console.error('Failed to fetch readlist:', err));
  };

  const submitReturnRequest = async (borrowId, requestType) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/member/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ borrow_id: borrowId, request_type: requestType }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(`Failed to submit request: ${errData.error || 'Unknown error'}`);
        setLoading(false);
        return;
      }

      alert(`Your ${requestType === 'return' ? 'return' : 'lost'} request was submitted successfully.`);
      fetchReadlist(); // Refresh readlist to update UI (disable buttons)
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error while submitting request.');
    }
    setLoading(false);
  };

  const handleAction = (borrowId, actionType) => {
    if (loading) return; // prevent multiple clicks while loading
    submitReturnRequest(borrowId, actionType);
  };

  return (
    <>
      <TopBar />
      <div className="readlist-container">
        <h2>Your Current Readlist</h2>
        {error && <p className="error-message">{error}</p>}
        {readlist.length === 0 ? (
          <p>You have no books currently borrowed.</p>
        ) : (
          readlist.map((book) => (
          <div key={book.borrow_id} className="readlist-card">
            <img
              src={`http://localhost:5000/static/${book.cover_filename || 'default-cover.jpg'}`}
              alt={book.title}
              className="readlist-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'http://localhost:5000/static/default-cover.jpg';
              }}
            />
            <div className="readlist-info">
              <h3>{book.title}</h3>
              <p><strong>Borrowed:</strong> {book.borrow_date}</p>
              <p><strong>Due:</strong> {book.due_return_date}</p>
              <div className="readlist-actions">
                {book.return_request_status === 'pending' ? (
                  <div className="pending-request">Request Pending</div>
                ) : (
                  <>
                    <button disabled={loading} onClick={() => handleAction(book.borrow_id, 'return')}>Return Book</button>
                    <button disabled={loading} onClick={() => handleAction(book.borrow_id, 'lost')}>Report Lost</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))
      )}
      </div>
    </>
  );
}

export default Readlist;
