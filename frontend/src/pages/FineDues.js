import React, { useEffect, useState } from 'react';
import TopBar from './TopBar';
import './FineDues.css'; // your styling

function FinePage() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmingFine, setConfirmingFine] = useState(null); // hold fine being confirmed
  const memberId = localStorage.getItem('memberId');

  useEffect(() => {
    if (!memberId) return;
    fetchFines();
  }, [memberId]);

  const fetchFines = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/member/fines/${memberId}`);
      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || 'Failed to fetch fines');
        setLoading(false);
        return;
      }
      const data = await response.json();
      setFines(data);
    } catch (err) {
      console.error('Error fetching fines:', err);
      setError('Network error');
    }
    setLoading(false);
  };

  const handlePayClick = (fine) => {
    setConfirmingFine(fine); // open confirmation modal for this fine
  };

  const handleConfirmPay = async () => {
    if (!confirmingFine) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/member/fines/pay/${confirmingFine.borrow_id}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || 'Failed to pay fine');
        setLoading(false);
        return;
      }

      // Remove the paid fine from state
      setFines((prev) => prev.filter((f) => f.borrow_id !== confirmingFine.borrow_id));
      setConfirmingFine(null);
    } catch (err) {
      console.error('Error paying fine:', err);
      setError('Network error');
    }
    setLoading(false);
  };

  const handleDeclinePay = () => {
    setConfirmingFine(null);
  };

  return (
    <>
      <TopBar />
      <div className="fine-page-container">
        <h2>Your Fines</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {fines.length === 0 && !loading ? (
        <p>You have no fines at the moment.</p>
      ) : (
        fines.map((fine) => (
          <div key={fine.borrow_id} className="fine-card">
            <img
              src={`http://localhost:5000/static/${fine.cover_filename || 'default-cover.jpg'}`}
              alt={fine.title || 'No Title'}
              className="fine-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'http://localhost:5000/static/default-cover.jpg';
              }}
            />
            <div className="fine-info">
              <h3>{fine.title || 'Unknown Book'}</h3>
              <p><strong>Author(s):</strong> {fine.authors}</p>
              <p><strong>Genre(s):</strong> {fine.genres}</p>
              <p><strong>Fine Type:</strong> {fine.fine_type}</p>
              <p><strong>Amount:</strong> ${fine.total_amount}</p>
              <button className="pay-button" onClick={() => handlePayClick(fine)}>Pay Now</button>
            </div>
          </div>
        ))
      )}

      {/* Confirmation Modal */}
      {confirmingFine && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Payment</h3>
            <p>Are you sure you want to pay the fine for <strong>{confirmingFine.title}</strong>?</p>
            <div className="modal-buttons">
              <button className="btn-decline" onClick={handleDeclinePay}>Decline</button>
              <button className="btn-confirm" onClick={handleConfirmPay}>Confirm</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

export default FinePage;
