import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from './TopBar';
import './BookReviews.css';

const BookReviews = ({ memberId }) => {
  const { book_id } = useParams();
  const memberIdFromStorage = localStorage.getItem('memberId');
  const effectiveMemberId = memberId || memberIdFromStorage;
  const [reviews, setReviews] = useState([]);
  const [bookDetails, setBookDetails] = useState(null);
  const [selectedStars, setSelectedStars] = useState(0);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:5000/search/book-reviews/${book_id}`);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error('Expected array but got:', data);
        setReviews([]);
      } else {
        setReviews(data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setReviews([]);
    }
  };

  const fetchBookDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/search/details/${book_id}`);
      if (!res.ok) throw new Error('Failed to fetch book details');
      const data = await res.json();
      setBookDetails(data);
    } catch (err) {
      console.error('Failed to fetch book details:', err);
      setBookDetails(null);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchBookDetails();
  }, [book_id]);

  const submitReview = async () => {
    if (selectedStars === 0) return;

    try {
      console.log({ memberId, book_id, selectedStars, description });
      const res = await fetch('http://localhost:5000/search/add-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({
        //   member_id: memberId,
        //   book_id,
        //   rating: selectedStars,
        //   description
        // })
        body: JSON.stringify({
        member_id: effectiveMemberId,
        book_id,
        rating: selectedStars,
        description
      })
      });
      
      if (!res.ok) throw new Error('Failed to submit review');
      await res.json();
      setSubmitted(true);
      fetchReviews();
    } catch (err) {
      console.error('Submit review error:', err);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const getAvatarColor = (name) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB6C1', '#87CEEB', '#F0E68C', '#FF9A8B'];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const getInitials = (name) => name.split(' ').map(word => word[0]).join('').toUpperCase();

  return (
    <>
      <TopBar />
      <div className="reviews-container">
        {bookDetails && (
          <div className="book-info-header">
            <h1>Reviews for "{bookDetails.title}"</h1>
            {bookDetails.author && <p className="book-author">by {bookDetails.author}</p>}
          </div>
        )}
        <div className="reviews-header">
        <h2>Latest reviews from our customers</h2>
        <div className="rating-summary">
          <div className="stars">
            {[1,2,3,4,5].map(star => (
              <span
                key={star}
                className={`star ${star <= selectedStars ? 'selected' : ''}`}
                onClick={() => setSelectedStars(selectedStars === star ? 0 : star)}
              >
                {star <= selectedStars ? '★' : '☆'}
              </span>
            ))}
          </div>
          <span className="rating-text">{averageRating} rating of {reviews.length} reviews</span>
        </div>
        <button className="leave-review-btn" onClick={() => setSubmitted(false)}>
          Leave us a review
        </button>
      </div>

      <div className="content-wrapper">
        <div className="reviews-grid">
          {!submitted ? (
            <div className="review-card add-review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="avatar new-review">
                    <span>✏️</span>
                  </div>
                  <div>
                    <h4>Add Your Review</h4>
                    <p className="review-date">Just now</p>
                  </div>
                </div>
              </div>

              <textarea
                placeholder="Write your review..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="review-textarea"
              />

              <div className="review-actions">
                <button onClick={submitReview} className="submit-btn">Submit Review</button>
              </div>
            </div>
          ) : (
            <div className="review-card thank-you-card">
              <div className="thank-you">
                <h3>✅ Thanks for your feedback!</h3>
                <p>Your review has been submitted successfully.</p>
              </div>
            </div>
          )}

          {reviews.slice(0, 7).map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="avatar" style={{ backgroundColor: getAvatarColor(review.reviewer_name) }}>
                    {getInitials(review.reviewer_name)}
                  </div>
                  <div>
                    <h4>{review.reviewer_name}</h4>
                    <p className="review-date">{review.review_date}</p>
                  </div>
                </div>
              </div>

              <div className="star-rating">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>

              <p className="review-text">{review.description || "Great experience! Highly recommend."}</p>
            </div>
          ))}
        </div>
        </div>
      </div>
    </>
  );
};

export default BookReviews;