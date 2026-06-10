import React, { useEffect, useState } from 'react';
import TopBar from './TopBar';
import './History.css';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const username = JSON.parse(localStorage.getItem('user'))?.username;

  useEffect(() => {
    if (!username) {
      setError('No logged-in user found');
      setLoading(false);
      return;
    }

    async function fetchHistory() {
      try {
        const res = await fetch(`http://localhost:5000/member-main/history?username=${encodeURIComponent(username)}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        setError('Failed to fetch history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [username]);

  // Calculate statistics
  const totalBooks = history.length;
  const returnedBooks = history.filter(item => item.return_date).length;
  const notReturnedBooks = totalBooks - returnedBooks;

  if (loading) {
    return (
      <>
        <TopBar />
        <div className="history-page-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading your borrowing history...</div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopBar />
        <div className="history-page-container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <div className="error-text">{error}</div>
          </div>
        </div>
      </>
    );
  }

  if (history.length === 0) {
    return (
      <>
        <TopBar />
        <div className="history-page-container">
          <div className="no-history-container">
            <div className="no-history-icon">📚</div>
            <div className="no-history-text">No borrowing history found</div>
            <div className="no-history-subtext">Start exploring our library to build your reading journey!</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar />
      <div className="history-page-container">        
        <div className="history-content">
          <div className="history-header">
            <h1 className="history-title">📚 Your Borrowing History</h1>
            <p className="history-subtitle">Track your reading journey and library activity</p>
          </div>

          <div className="history-stats">
            <div className="stat-card">
              <span className="stat-number">{totalBooks}</span>
              <span className="stat-label">Total Books</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{returnedBooks}</span>
              <span className="stat-label">Returned</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{notReturnedBooks}</span>
              <span className="stat-label">Currently Borrowed</span>
            </div>
          </div>

          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Return Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index} className="history-row">
                    <td>
                      <div className="book-title">{item.title}</div>
                    </td>
                    <td className="date-cell">
                      {new Date(item.borrow_date).toLocaleDateString()}
                    </td>
                    <td className="date-cell">
                      {new Date(item.due_return_date).toLocaleDateString()}
                    </td>
                    <td>
                      {item.return_date ? (
                        <span className="status-badge status-returned">
                          Returned on {new Date(item.return_date).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="status-badge status-not-returned">
                          Not Returned
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default History;
