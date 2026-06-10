import React, { useEffect, useState } from 'react';
import StaffTopBar from './StaffTopBar';
import './StaffRequests.css';

function StaffRequests() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/staff-main/notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error('❌ Failed to fetch staff notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // const handleApprove = async (reqId) => {
  //   try {
  //     const res = await fetch('http://localhost:5000/staff-main/approve', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ reqId }),
  //     });
  //     const data = await res.json();
  //     alert(data.message);
  //     fetchNotifications(); // Refresh after approval
  //   } catch (err) {
  //     console.error('❌ Approve failed:', err);
  //   }
  // };

//   const handleApprove = async (reqId) => {
//   try {
//     const res = await fetch('http://localhost:5000/staff-main/approve', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ reqId, staffUsername: localStorage.getItem('username') })
//     });

//     const data = await res.json();
//     alert(data.message); // This shows success or error
//     fetchNotifications(); // Refresh list
//   } catch (err) {
//     console.error('❌ Approve failed:', err);
//   }
// };
// const handleApprove = async (reqId) => {
//     try {
//       // Get user object from localStorage and extract username
//       const user = JSON.parse(localStorage.getItem('user'));
//       const staffUsername = user?.username;

//       if (!staffUsername) {
//         alert('Error: No logged-in username found');
//         return;
//       }

//       const res = await fetch('http://localhost:5000/staff-main/process-request', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         // body: JSON.stringify({ reqId, staffUsername }),
//         body: JSON.stringify({ req_id: reqId, action: 'approve_borrow', staffUsername }),
//       });

//       const data = await res.json();
//       alert(data.message); // Shows success or error message
//       fetchNotifications(); // Refresh the list
//     } catch (err) {
//       console.error('❌ Approve failed:', err);
//     }
//   };
        const handleApprove = async (reqId) => {
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          const staffUsername = user?.username;

          if (!staffUsername) {
            alert('Error: No logged-in username found');
            return;
          }

          const res = await fetch('http://localhost:5000/staff-main/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reqId: reqId,
              action: 'approve_borrow',
              staffUsername,
            }),
          });

          const data = await res.json();
          alert(data.message);
          fetchNotifications();
        } catch (err) {
          console.error('❌ Approve failed:', err);
        }
      };


  useEffect(() => {
    fetchNotifications();
  }, []);

  
  return (
    <div className="staff-requests-container">
      <StaffTopBar />
      <div className="staff-requests-content">
        <div className="requests-header">
          <h1 className="requests-title">Book Requests from Members</h1>
          <div className="requests-subtitle">Review and approve member book requests</div>
        </div>

        {loading ? (
          <div className="loading-message">Loading requests...</div>
        ) : notifications.length === 0 ? (
          <div className="no-requests-message">No requests found.</div>
        ) : (
          <div className="requests-card">
            <div className="requests-list">
              {notifications.map((noti) => (
                <div key={noti.req_id} className="request-item">
                  <div className="request-info">
                    <div className="request-member">
                      <span className="member-label">Member</span>
                      <span className="member-id">{noti.member_id}</span>
                    </div>
                    <div className="request-book">
                      <span className="book-label">Book Title</span>
                      <span className="book-title">{noti.book_title}</span>
                    </div>
                    <div className="request-status">
                      <span className="status-label">Status</span>
                      <span className={`status-badge ${noti.request_status}`}>
                        {noti.request_status}
                      </span>
                    </div>
                  </div>
                  {noti.request_status !== 'approved' && (
                    <div className="request-actions">
                      <button
                        onClick={() => handleApprove(noti.req_id)}
                        className="approve-button"
                      >
                        <span className="button-icon">✓</span>
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

}

export default StaffRequests;


// // import React, { useEffect, useState } from 'react';

// // function StaffRequestsPage() {
// //   const [requests, setRequests] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [processingId, setProcessingId] = useState(null); // to disable buttons while processing
// //   const staffUsername = JSON.parse(localStorage.getItem('user'))?.username;

// //   const fetchRequests = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await fetch('http://localhost:5000/staff-main/requests');
// //       const data = await res.json();
// //       setRequests(data);
// //     } catch (err) {
// //       console.error('Failed to fetch requests:', err);
// //       alert('Error loading requests');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchRequests();
// //   }, []);

// //   const handleProcess = async (req) => {
// //     let confirmMsg = '';
// //     let action = '';

// //     if (req.request_type === 'borrow') {
// //       confirmMsg = `Approve borrow request for "${req.book_title}"?`;
// //       action = 'approve_borrow';
// //     } else if (req.request_type === 'return_lost') {
// //       // For return/lost, show prompt to select what kind of processing
// //       const choice = window.prompt(
// //         `Processing return/lost for "${req.book_title}".\n` +
// //         `Enter action:\n` +
// //         `"return_normal" - Normal return\n` +
// //         `"return_late" - Late return\n` +
// //         `"return_damaged" - Damaged return\n` +
// //         `"mark_lost" - Report lost\n` +
// //         `(type exactly one of the above)`
// //       );
// //       if (!choice) return;
// //       if (!['return_normal', 'return_late', 'return_damaged', 'mark_lost'].includes(choice)) {
// //         alert('Invalid action entered.');
// //         return;
// //       }
// //       confirmMsg = `Confirm action "${choice}" for "${req.book_title}"?`;
// //       action = choice;
// //     } else {
// //       alert('Unknown request type');
// //       return;
// //     }

// //     if (!window.confirm(confirmMsg)) return;

// //     setProcessingId(req.req_id || req.borrow_id);

// //     try {
// //       const res = await fetch('http://localhost:5000/staff-main/process-request', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           req_id: req.req_id,
// //           borrow_id: req.borrow_id,
// //           action,
// //           staffUsername
// //         }),
// //       });
// //       const data = await res.json();

// //       alert(data.message + (data.fine ? ` Fine amount: $${data.fine.toFixed(2)}` : ''));

// //       // Refresh list
// //       fetchRequests();
// //     } catch (err) {
// //       console.error('Processing error:', err);
// //       alert('Failed to process request');
// //     } finally {
// //       setProcessingId(null);
// //     }
// //   };

// //   return (
// //     <div style={{ padding: 20 }}>
// //       <h2>Staff Requests</h2>
// //       {loading ? (
// //         <p>Loading requests...</p>
// //       ) : requests.length === 0 ? (
// //         <p>No pending requests.</p>
// //       ) : (
// //         <ul style={{ listStyle: 'none', padding: 0 }}>
// //           {requests.map((req) => (
// //             <li key={req.req_id || req.borrow_id} style={{
// //               marginBottom: 15,
// //               borderBottom: '1px solid #ccc',
// //               paddingBottom: 10
// //             }}>
// //               <strong>Member ID:</strong> {req.member_id} <br />
// //               <strong>Book:</strong> <em>{req.book_title}</em><br />
// //               <strong>Request Type:</strong> {req.request_type === 'borrow' ? 'Borrow Request' : 'Return/Lost Request'}<br />
// //               {req.request_type === 'borrow' && (
// //                 <>
// //                   <strong>Status:</strong> {req.request_status}<br />
// //                 </>
// //               )}
// //               {req.request_type === 'return_lost' && (
// //                 <>
// //                   <strong>Borrow Date:</strong> {new Date(req.borrow_date).toLocaleDateString()}<br />
// //                   <strong>Due Date:</strong> {new Date(req.due_return_date).toLocaleDateString()}<br />
// //                   <strong>Return Request Type:</strong> {req.return_request_type}<br />
// //                 </>
// //               )}
// //               <button
// //                 onClick={() => handleProcess(req)}
// //                 disabled={processingId === (req.req_id || req.borrow_id)}
// //                 style={{
// //                   marginTop: 8,
// //                   padding: '6px 12px',
// //                   cursor: 'pointer',
// //                   fontWeight: 'bold',
// //                 }}
// //               >
// //                 {processingId === (req.req_id || req.borrow_id) ? 'Processing...' : 'Process Request'}
// //               </button>
// //             </li>
// //           ))}
// //         </ul>
// //       )}
// //     </div>
// //   );
// // }

// // export default StaffRequestsPage;


// import React, { useEffect, useState } from 'react';

// function StaffReturnRequests() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchRequests = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/staff-main/return-requests');
//       const data = await res.json();
//       setRequests(data);
//     } catch (err) {
//       console.error('❌ Failed to fetch return requests:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProcess = async (borrowId, actionType) => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     const staffUsername = user?.username;

//     if (!staffUsername) return alert('No staff username found');

//     try {
//       const res = await fetch('http://localhost:5000/staff-main/process-return', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ borrow_id: borrowId, staff_username: staffUsername, action_type: actionType })
//       });

//       const data = await res.json();
//       alert(data.message);
//       fetchRequests();
//     } catch (err) {
//       console.error('❌ Processing failed:', err);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>📦 Member Return / Lost Requests</h2>
//       {loading ? <p>Loading...</p> : requests.length === 0 ? (
//         <p>No pending requests.</p>
//       ) : (
//         <ul style={{ listStyle: 'none', padding: 0 }}>
//           {requests.map(req => (
//             <li key={req.borrow_id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
//               <p><strong>Member:</strong> {req.member_id}</p>
//               <p><strong>Book:</strong> {req.title}</p>
//               <p><strong>Requested:</strong> {req.request_type}</p>
//               <div>
//                 {req.request_type === 'return' ? (
//                   <>
//                     <button onClick={() => handleProcess(req.borrow_id, 'return_delay')}>Mark as Late</button>
//                     <button onClick={() => handleProcess(req.borrow_id, 'damaged')}>Mark as Damaged</button>
//                     <button onClick={() => handleProcess(req.borrow_id, 'ok')}>Return OK</button>
//                   </>
//                 ) : (
//                   <button onClick={() => handleProcess(req.borrow_id, 'book_lost')}>Confirm Lost</button>
//                 )}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default StaffReturnRequests;
