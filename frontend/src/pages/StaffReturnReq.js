// // // import React, { useEffect, useState } from 'react';

// // // function StaffReturnRequests() {
// // //   const [requests, setRequests] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);

// // //   const fetchRequests = async () => {
// // //     setLoading(true);
// // //     setError(null);
// // //     try {
// // //       const res = await fetch('http://localhost:5000/staff-main/return-lost-requests');
// // //       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
// // //       const data = await res.json();
// // //       setRequests(data);
// // //     } catch (err) {
// // //       console.error('❌ Failed to fetch return/lost requests:', err);
// // //       setError('Failed to load requests.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // // const handleProcess = async (request, action) => {
// // //    const staff_id = localStorage.getItem('staff_id'); // get saved staff_id
// // //   if (!staff_id) return alert('Staff ID not found');

// // //   const confirmMsg =
// // //     action === 'mark_lost'
// // //       ? 'Are you sure you want to confirm this book as lost?'
// // //       : `Mark this return request as "${action.replace('mark_', '').replace('_', ' ')}"?`;

// // //   if (!window.confirm(confirmMsg)) return;

// // //   try {
// // //     const decision = 'approved';  // currently no 'reject' logic here
// // //     const return_condition = request.request_type === 'return' ? action : null;

// // //     console.log({ request_id: request.request_id, staff_id, decision, return_condition }); // Debug log

// // //     const res = await fetch('http://localhost:5000/staff-returns/process-request', {
// // //       method: 'POST',
// // //       headers: { 'Content-Type': 'application/json' },
// // //       body: JSON.stringify({
// // //         request_id: request.request_id,
// // //         staff_id,
// // //         decision,
// // //         return_condition,
// // //       }),
// // //     });

// // //     if (!res.ok) {
// // //       const errData = await res.json();
// // //       throw new Error(errData.error || 'Processing failed');
// // //     }

// // //     const data = await res.json();
// // //     alert(data.message);
// // //     fetchRequests();
// // //   } catch (err) {
// // //     console.error('❌ Processing failed:', err);
// // //     alert(`Error: ${err.message}`);
// // //   }
// // // };


// // //  useEffect(() => {
// // //     fetchRequests();
// // //   }, []);

// // // return (
// // //   <div style={{ padding: 20, maxWidth: 700, margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
// // //     <h2>📦 Member Return / Lost Requests</h2>

// // //     {loading && <p>Loading...</p>}
// // //     {error && <p style={{ color: 'red' }}>{error}</p>}

// // //     {!loading && !error && requests.length === 0 && <p>No pending requests.</p>}

// // //     {!loading && !error && requests.length > 0 && (
// // //       <ul style={{ listStyle: 'none', padding: 0 }}>
// // //         {requests.map((req) => (
// // //           <li
// // //             key={req.request_id || req.borrow_id} // unique key
// // //             style={{
// // //               marginBottom: 20,
// // //               padding: 15,
// // //               border: '1px solid #ccc',
// // //               borderRadius: 8,
// // //               backgroundColor: '#f9f9f9',
// // //               boxShadow: '1px 1px 5px rgba(0,0,0,0.05)',
// // //             }}
// // //           >
// // //             <p><strong>Member ID:</strong> {req.member_id}</p>
// // //             <p><strong>Book Title:</strong> {req.title || req.book_title}</p>
// // //             <p><strong>Request Type:</strong> {req.request_type}</p>
// // //             <p><strong>Borrow Date:</strong> {req.borrow_date ? new Date(req.borrow_date).toLocaleDateString() : 'N/A'}</p>
// // //             <p><strong>Due Date:</strong> {req.due_return_date ? new Date(req.due_return_date).toLocaleDateString() : 'N/A'}</p>

// // //             <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 10 }}>
// // //               {(req.request_type === 'return' || req.request_type === 'lost') ? (
// // //                 <>
// // //                   {req.request_type === 'return' && (
// // //                     <>
// // //                       <button
// // //                         style={{ backgroundColor: '#e67e22', color: 'white', borderRadius: 5, padding: '8px 16px', border: 'none', cursor: 'pointer' }}
// // //                         onClick={() => handleProcess(req.borrow_id, 'mark_late')}
// // //                       >
// // //                         Mark as Late
// // //                       </button>
// // //                       <button
// // //                         style={{ backgroundColor: '#c0392b', color: 'white', borderRadius: 5, padding: '8px 16px', border: 'none', cursor: 'pointer' }}
// // //                         onClick={() => handleProcess(req.borrow_id, 'mark_damaged')}
// // //                       >
// // //                         Mark as Damaged
// // //                       </button>
// // //                       <button
// // //                         style={{ backgroundColor: '#27ae60', color: 'white', borderRadius: 5, padding: '8px 16px', border: 'none', cursor: 'pointer' }}
// // //                         onClick={() => handleProcess(req.borrow_id, 'mark_okay')}
// // //                       >
// // //                         Return OK
// // //                       </button>
// // //                     </>
// // //                   )}
// // //                   {req.request_type === 'lost' && (
// // //                     <button
// // //                       style={{ backgroundColor: '#2980b9', color: 'white', borderRadius: 5, padding: '8px 16px', border: 'none', cursor: 'pointer' }}
// // //                       onClick={() => handleProcess(req.borrow_id, 'mark_lost')}
// // //                     >
// // //                       Confirm Lost
// // //                     </button>
// // //                   )}
// // //                 </>
// // //               ) : (
// // //                 <p>Unknown request type</p>
// // //               )}
// // //             </div>
// // //           </li>
// // //         ))}
// // //       </ul>
// // //     )}
// // //   </div>
// // // );
// // // }

// // // export default StaffReturnRequests;


// // import React, { useEffect, useState } from 'react';

// // function StaffReturnRequests() {
// //   const [requests, setRequests] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [selectedRequest, setSelectedRequest] = useState(null);
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const [selectedAction, setSelectedAction] = useState('');

// //   const staff_id = localStorage.getItem('staff_id');

// //   const fetchRequests = async () => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const res = await fetch('http://localhost:5000/staff-main/return-lost-requests');
// //       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
// //       const data = await res.json();
// //       setRequests(data);
// //     } catch (err) {
// //       console.error('❌ Failed to fetch return/lost requests:', err);
// //       setError('Failed to load requests.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchRequests();
// //   }, []);

// //   const openModal = (request, action) => {
// //     setSelectedRequest(request);
// //     setSelectedAction(action);
// //     setModalVisible(true);
// //   };

// //   const closeModal = () => {
// //     setModalVisible(false);
// //     setSelectedRequest(null);
// //     setSelectedAction('');
// //   };

// //   // const handleConfirm = async () => {
// //   //   if (!selectedRequest) return;
// //   //   const payload = {
// //   //     request_id: selectedRequest.request_id,
// //   //     staff_id,
// //   //     decision: 'approved',
// //   //     return_condition:
// //   //       selectedAction === 'mark_late'
// //   //         ? 'Return_delay'
// //   //         : selectedAction === 'mark_damaged'
// //   //         ? 'Damaged'
// //   //         : selectedAction === 'mark_okay'
// //   //         ? 'Okay'
// //   //         : null,
// //   //   };

// //   //   try {
// //   //     const res = await fetch('http://localhost:5000/staff-returns/process-request', {
// //   //       method: 'POST',
// //   //       headers: {
// //   //         'Content-Type': 'application/json',
// //   //       },
// //   //       body: JSON.stringify(payload),
// //   //     });

// //   //     const result = await res.json();
// //   //     if (res.ok) {
// //   //       alert('✅ Processed successfully.');
// //   //       fetchRequests(); // refresh
// //   //     } else {
// //   //       console.error('❌ Processing failed:', result);
// //   //       alert(`❌ Processing failed: ${result.message || 'Error'}`);
// //   //     }
// //   //   } catch (err) {
// //   //     console.error('❌ Error processing request:', err);
// //   //     alert('❌ Failed to process request.');
// //   //   } finally {
// //   //     closeModal();
// //   //   }
// //   // };

// //   const handleProcess = async (request_id, decision, return_condition) => {
// //   const user = JSON.parse(localStorage.getItem('user'));
// //   const staff_id = user?.staff_id; // Assuming staff_id is stored in localStorage user object

// //   if (!staff_id) {
// //     alert('No staff ID found.');
// //     return;
// //   }

// //   // Custom modal confirmation (replace window.confirm with your UI if you want)
// //   const confirmMsg =
// //     decision === 'approved'
// //       ? `Are you sure you want to approve this request with condition: "${return_condition || 'N/A'}"?`
// //       : `Are you sure you want to reject this request?`;

// //   if (!window.confirm(confirmMsg)) return;

// //   try {
// //     const body = {
// //       request_id,
// //       staff_id,
// //       decision,
// //       return_condition,
// //     };

// //     const res = await fetch('http://localhost:5000/staff-main/process-request', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify(body),
// //     });

// //     if (!res.ok) {
// //       const errData = await res.json();
// //       throw new Error(errData.error || errData.message || 'Processing failed');
// //     }

// //     const data = await res.json();
// //     alert(data.message);
// //     fetchRequests(); // reload the list after processing

// //   } catch (err) {
// //     console.error('❌ Processing failed:', err);
// //     alert(`Error: ${err.message}`);
// //   }
// // };


// //   if (loading) return <p>Loading requests...</p>;
// //   if (error) return <p>{error}</p>;

// //   return (
// //     <div>
// //       <h2>Pending Return / Lost Requests</h2>
// //       {requests.length === 0 ? (
// //         <p>No pending requests.</p>
// //       ) : (
// //         <ul>
// //           {requests.map((req) => (
// //             <li key={req.request_id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
// //               <p><strong>Request ID:</strong> {req.request_id}</p>
// //               <p><strong>Member:</strong> {req.member_id}</p>
// //               <p><strong>Book:</strong> {req.book_title || req.title}</p>
// //               <p><strong>Type:</strong> {req.request_type}</p>
// //               {/* <button onClick={() => openModal(req, 'mark_late')}>Mark as Late</button>
// //               <button onClick={() => openModal(req, 'mark_damaged')}>Mark as Damaged</button>
// //               <button onClick={() => openModal(req, 'mark_okay')}>Mark as Okay</button> */}
// //               <button
// //   onClick={() => openModal(req, 'mark_late')}
// //   style={{ marginRight: '8px', padding: '5px 10px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '4px' }}
// // >
// //   Mark as Late
// // </button>

// // <button
// //   onClick={() => openModal(req, 'mark_damaged')}
// //   style={{ marginRight: '8px', padding: '5px 10px', backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '4px' }}
// // >
// //   Mark as Damaged
// // </button>

// // <button
// //   onClick={() => openModal(req, 'mark_okay')}
// //   style={{ marginRight: '8px', padding: '5px 10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px' }}
// // >
// //   Mark as Okay
// // </button>

// // {req.request_type === 'Lost' && (
// //   <button
// //     onClick={() => openModal(req, 'confirm_lost')}
// //     style={{ padding: '5px 10px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '4px' }}
// //   >
// //     Confirm Lost
// //   </button>
// // )}

// //               {req.request_type === 'Lost' && (
// //                 <button onClick={() => openModal(req, 'confirm_lost')}>Confirm Lost</button>
// //               )}
// //             </li>
// //           ))}
// //         </ul>
// //       )}

// //       {modalVisible && (
// //         <div style={{
// //           position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
// //           backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center',
// //         }}>
// //           <div style={{
// //             background: 'white', padding: '20px', borderRadius: '8px',
// //             minWidth: '300px', textAlign: 'center',
// //           }}>
// //             <p>Are you sure you want to <strong>{selectedAction.replace('_', ' ')}</strong> this request?</p>
// //             <button onClick={handleConfirm} style={{ marginRight: '10px' }}>Yes</button>
// //             <button onClick={closeModal}>Cancel</button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default StaffReturnRequests;



// import React, { useEffect, useState } from 'react';

// function StaffReturnRequests() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Modal state
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalMessage, setModalMessage] = useState('');
//   const [pendingAction, setPendingAction] = useState(null); // { request_id, decision, return_condition }

//   const fetchRequests = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch('http://localhost:5000/staff-main/return-lost-requests');
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//       const data = await res.json();
//       setRequests(data);
//     } catch (err) {
//       console.error('❌ Failed to fetch return/lost requests:', err);
//       setError('Failed to load requests.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   // Show confirmation modal before processing
//   const showConfirmation = (request_id, decision, return_condition) => {
//     let message;
//     if (decision === 'approved') {
//       message = `Are you sure you want to approve this request with condition: "${return_condition || 'N/A'}"?`;
//     } else if (decision === 'rejected') {
//       message = 'Are you sure you want to reject this request?';
//     } else {
//       message = 'Are you sure you want to perform this action?';
//     }

//     setModalMessage(message);
//     setPendingAction({ request_id, decision, return_condition });
//     setModalVisible(true);
//   };

//   // Actual processing call after confirmation
//   const handleProcessConfirmed = async (request, action) => {
//     if (!pendingAction) return;

//     const { request_id, decision, return_condition } = pendingAction;
//     const user = JSON.parse(localStorage.getItem('user'));
//     const staff_id = user?.staff_id;

//     if (!staff_id) {
//       alert('No staff ID found.');
//       setModalVisible(false);
//       return;
//     }

//     try {
//       const body = { request_id, staff_id, decision, return_condition };

//       // const res = await fetch('http://localhost:5000/staff-returns/process-request', {
//       //   method: 'POST',
//       //   headers: { 'Content-Type': 'application/json' },
//       //   body: JSON.stringify({request_id: request.request_id,
//       //   staff_id,
//       //   decision,
//       //   return_condition
//       // });
//        const res = await fetch('http://localhost:5000/staff-returns/process-request', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         request_id: request.request_id,
//         staff_id,
//         decision,
//         //return_condition,
//         return_condition: action, // Use action type directly
//       }),
//     });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.error || errData.message || 'Processing failed');
//       }

//       const data = await res.json();
//       alert(data.message);
//       fetchRequests();

//     } catch (err) {
//       console.error('❌ Processing failed:', err);
//       alert(`Error: ${err.message}`);
//     } finally {
//       setModalVisible(false);
//       setPendingAction(null);
//     }
//   };

//   // Cancel modal
//   const handleCancel = () => {
//     setModalVisible(false);
//     setPendingAction(null);
//   };

//   return (
//     <div style={{ padding: 20, maxWidth: 700, margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
//       <h2>📦 Member Return / Lost Requests</h2>

//       {loading && <p>Loading...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {!loading && !error && requests.length === 0 && <p>No pending requests.</p>}

//       {!loading && !error && requests.length > 0 && (
//         <ul style={{ listStyle: 'none', padding: 0 }}>
//           {requests.map((req) => (
//             <li
//               key={req.request_id}
//               style={{
//                 marginBottom: 20,
//                 padding: 15,
//                 border: '1px solid #ccc',
//                 borderRadius: 8,
//                 backgroundColor: '#f9f9f9',
//                 boxShadow: '1px 1px 5px rgba(0,0,0,0.05)',
//               }}
//             >
//               <p><strong>Member ID:</strong> {req.member_id}</p>
//               <p><strong>Book Title:</strong> {req.title || req.book_title}</p>
//               <p><strong>Request Type:</strong> {req.request_type}</p>
//               <p><strong>Borrow Date:</strong> {req.borrow_date ? new Date(req.borrow_date).toLocaleDateString() : 'N/A'}</p>
//               <p><strong>Due Date:</strong> {req.due_return_date ? new Date(req.due_return_date).toLocaleDateString() : 'N/A'}</p>

//               <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 10 }}>
//                 {req.request_type === 'return' && (
//                   <>
//                     <button
//                       style={{ backgroundColor: '#e67e22', color: 'white', borderRadius: 5, padding: '8px 16px', border: 'none', cursor: 'pointer' }}
//                       onClick={() => showConfirmation(req.request_id, 'approved', 'Late')}
//                     >
//                       Mark as Late
//                     </button>
//                     <button
//                       style={{ backgroundColor: '#c0392b', color: 'white', borderRadius: 5, padding: '8px 16px', border: 'none', cursor: 'pointer' }}
//                       onClick={() => showConfirmation(req.request_id, 'approved', 'Damaged')}
//                     >
//                       Mark as Damaged
//                     </button>
//                     <button
//                       style={{ backgroundColor: '#27ae60', color: 'white', borderRadius: 5, padding: '8px 16px', border: 'none', cursor: 'pointer' }}
//                       onClick={() => showConfirmation(req.request_id, 'approved', null)}
//                     >
//                       Return OK
//                     </button>
//                   </>
//                 )}

//                 {req.request_type === 'lost' && (
//                   <button
//                     style={{ backgroundColor: '#2980b9', color: 'white', borderRadius: 5, padding: '8px 16px', border: 'none', cursor: 'pointer' }}
//                     onClick={() => showConfirmation(req.request_id, 'approved', null)}
//                   >
//                     Confirm Lost
//                   </button>
//                 )}

//                 <button
//                   style={{ backgroundColor: '#7f8c8d', color: 'white', borderRadius: 5, padding: '8px 16px', border: 'none', cursor: 'pointer' }}
//                   onClick={() => showConfirmation(req.request_id, 'rejected', null)}
//                 >
//                   Reject
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* Modal */}
//       {modalVisible && (
//         <div
//           style={{
//             position: 'fixed',
//             top: 0, left: 0,
//             width: '100vw',
//             height: '100vh',
//             backgroundColor: 'rgba(0,0,0,0.5)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             zIndex: 9999,
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: 'white',
//               borderRadius: 8,
//               padding: 20,
//               maxWidth: 400,
//               width: '90%',
//               boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
//               textAlign: 'center',
//             }}
//           >
//             <p style={{ marginBottom: 20 }}>{modalMessage}</p>
//             <button
//               onClick={handleProcessConfirmed}
//               style={{
//                 marginRight: 10,
//                 backgroundColor: '#27ae60',
//                 color: 'white',
//                 padding: '8px 16px',
//                 borderRadius: 5,
//                 border: 'none',
//                 cursor: 'pointer',
//               }}
//             >
//               Confirm
//             </button>
//             <button
//               onClick={handleCancel}
//               style={{
//                 backgroundColor: '#c0392b',
//                 color: 'white',
//                 padding: '8px 16px',
//                 borderRadius: 5,
//                 border: 'none',
//                 cursor: 'pointer',
//               }}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StaffReturnRequests;


import React, { useEffect, useState } from 'react';
import StaffTopBar from './StaffTopBar';
import './StaffReturnReq.css';

function StaffReturnRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [pendingAction, setPendingAction] = useState(null); // { request_id, decision, return_condition }

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/staff-main/return-lost-requests');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error('❌ Failed to fetch return/lost requests:', err);
      setError('Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Show confirmation modal before processing
  const showConfirmation = (request_id, decision, return_condition) => {
    let message;
    if (decision === 'approved') {
      message = `Are you sure you want to approve this request with condition: "${return_condition || 'N/A'}"?`;
    } else if (decision === 'rejected') {
      message = 'Are you sure you want to reject this request?';
    } else {
      message = 'Are you sure you want to perform this action?';
    }

    setModalMessage(message);
    setPendingAction({ request_id, decision, return_condition });
    setModalVisible(true);
  };

  // Actual processing call after confirmation
  const handleProcessConfirmed = async () => {
    if (!pendingAction) return;

    const { request_id, decision, return_condition } = pendingAction;
    const user = JSON.parse(localStorage.getItem('user'));
    const staff_id = user?.staff_id;

    if (!staff_id) {
      alert('No staff ID found.');
      setModalVisible(false);
      return;
    }

    try {
      const body = { request_id, staff_id, decision, return_condition };

      const res = await fetch('http://localhost:5000/staff-returns/process-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.message || 'Processing failed');
      }

      const data = await res.json();
      alert(data.message);
      fetchRequests();

    } catch (err) {
      console.error('❌ Processing failed:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setModalVisible(false);
      setPendingAction(null);
    }
  };

  // Cancel modal
  const handleCancel = () => {
    setModalVisible(false);
    setPendingAction(null);
  };

  return (
    <div className="staff-return-req-container">
      <StaffTopBar />
      <div className="staff-return-req-content">
        <div className="return-req-header">
          <h1 className="return-req-title">Return & Lost Book Requests</h1>
          <div className="return-req-subtitle">Process member return and lost book requests</div>
        </div>

        {loading && (
          <div className="loading-message">Loading requests...</div>
        )}
        
        {error && (
          <div className="error-message">{error}</div>
        )}

        {!loading && !error && requests.length === 0 && (
          <div className="no-requests-message">No pending requests.</div>
        )}

        {!loading && !error && requests.length > 0 && (
          <div className="requests-card">
            <div className="requests-list">
              {requests.map((req) => (
                <div key={req.request_id} className="request-item">
                  {/* Late return indicator */}
                  {req.due_return_date && new Date() > new Date(req.due_return_date) && (
                    <div className="late-indicator">Returned late</div>
                  )}
                  <div className="request-info">
                    <div className="request-detail">
                      <span className="detail-label">Member ID</span>
                      <span className="detail-value">{req.member_id}</span>
                    </div>
                    <div className="request-detail">
                      <span className="detail-label">Book Title</span>
                      <span className="detail-value book-title">{req.title || req.book_title}</span>
                    </div>
                    <div className="request-detail">
                      <span className="detail-label">Request Type</span>
                      <span className={`detail-value request-type ${req.request_type}`}>{req.request_type}</span>
                    </div>
                    <div className="request-dates">
                      <div className="date-item">
                        <span className="date-label">Borrow Date</span>
                        <span className="date-value">{req.borrow_date ? new Date(req.borrow_date).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="date-item">
                        <span className="date-label">Due Date</span>
                        <span className="date-value">{req.due_return_date ? new Date(req.due_return_date).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="request-actions">
                    {req.request_type === 'return' && (
                      <>
                        <button
                          className="action-button late-button"
                          onClick={() => showConfirmation(req.request_id, 'approved', 'Late')}
                        >
                          Mark as Late
                        </button>
                        <button
                          className="action-button damaged-button"
                          onClick={() => showConfirmation(req.request_id, 'approved', 'Damaged')}
                        >
                          Mark as Damaged
                        </button>
                        <button
                          className="action-button ok-button"
                          onClick={() => showConfirmation(req.request_id, 'approved', null)}
                        >
                          Return OK
                        </button>
                      </>
                    )}

                    {req.request_type === 'lost' && (
                      <button
                        className="action-button lost-button"
                        onClick={() => showConfirmation(req.request_id, 'approved', null)}
                      >
                        Confirm Lost
                      </button>
                    )}

                    <button
                      className="action-button reject-button"
                      onClick={() => showConfirmation(req.request_id, 'rejected', null)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal */}
        {modalVisible && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p className="modal-message">{modalMessage}</p>
              <div className="modal-actions">
                <button
                  onClick={handleProcessConfirmed}
                  className="modal-confirm-button"
                >
                  Confirm
                </button>
                <button
                  onClick={handleCancel}
                  className="modal-cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffReturnRequests;
