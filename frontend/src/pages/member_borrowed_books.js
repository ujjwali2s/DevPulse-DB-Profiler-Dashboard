import React, { useState, useEffect } from 'react';
import { AlertCircle, Book, Calendar, AlertTriangle } from 'lucide-react';

const MemberBorrowedBooks = ({ memberId }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingReturn, setProcessingReturn] = useState(null);

  useEffect(() => {
    fetchBorrowedBooks();
  }, [memberId]);

  const fetchBorrowedBooks = async () => {
    try {
      const response = await fetch(`/api/fines/member/${memberId}/borrowed-books`);
      if (!response.ok) throw new Error('Failed to fetch borrowed books');
      
      const data = await response.json();
      setBorrowedBooks(data);
    } catch (err) {
      setError('Error fetching borrowed books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (borrowId, isLost = false) => {
    setProcessingReturn(borrowId);
    
    try {
      // For member side, we just mark the intent
      // Staff will handle the actual condition assessment
      const response = await fetch('/api/fines/process-return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          borrowId,
          condition: isLost ? 'Book_lost' : 'pending_staff_review',
          memberId
        })
      });

      if (!response.ok) throw new Error('Failed to process return request');

      const result = await response.json();
      
      // Show success message
      alert(isLost ? 
        'Book loss reported successfully. Please contact staff for further processing.' : 
        'Return request submitted successfully. Please visit the library to complete the return process.'
      );
      
      // Refresh the borrowed books list
      fetchBorrowedBooks();
      
    } catch (err) {
      setError('Error processing return request');
      console.error(err);
    } finally {
      setProcessingReturn(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate, status) => {
    return status === 'borrowed' && new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="text-red-500 mr-2" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Book className="mr-3 text-blue-600" size={24} />
            My Borrowed Books
          </h2>
        </div>

        <div className="p-6">
          {borrowedBooks.length === 0 ? (
            <div className="text-center py-8">
              <Book className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 text-lg">No borrowed books found</p>
              <p className="text-gray-500 mt-2">Visit the library to borrow books</p>
            </div>
          ) : (
            <div className="space-y-4">
              {borrowedBooks.map((book) => (
                <div key={book.borrow_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 mb-2">by {book.author}</p>
                      <p className="text-sm text-gray-500 mb-2">ISBN: {book.isbn}</p>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="mr-1" size={16} />
                          <span>Borrowed: {formatDate(book.borrow_date)}</span>
                        </div>
                        <div className={`flex items-center ${isOverdue(book.due_date, book.status) ? 'text-red-600' : 'text-gray-600'}`}>
                          <Calendar className="mr-1" size={16} />
                          <span>Due: {formatDate(book.due_date)}</span>
                        </div>
                      </div>
                      
                      {book.overdue_days > 0 && (
                        <div className="flex items-center mt-2 text-red-600">
                          <AlertTriangle className="mr-1" size={16} />
                          <span className="text-sm font-medium">
                            Overdue by {book.overdue_days} day{book.overdue_days > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handleReturnBook(book.borrow_id, false)}
                        disabled={processingReturn === book.borrow_id}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                      >
                        {processingReturn === book.borrow_id ? 'Processing...' : 'Return Book'}
                      </button>
                      
                      <button
                        onClick={() => handleReturnBook(book.borrow_id, true)}
                        disabled={processingReturn === book.borrow_id}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                      >
                        {processingReturn === book.borrow_id ? 'Processing...' : 'Report Lost'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberBorrowedBooks;