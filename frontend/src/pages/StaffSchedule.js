import React, { useEffect, useState } from 'react';
import StaffTopBar from './StaffTopBar';
import './StaffSchedule.css';

function StaffSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //const username = JSON.parse(localStorage.getItem('user'))?.username;
  const username = localStorage.getItem('username');


  useEffect(() => {
    if (!username) {
      setError('No logged-in user found');
      setLoading(false);
      return;
    }

    async function fetchSchedule() {
      try {
        const res = await fetch(`http://localhost:5000/staff-main/schedule?username=${encodeURIComponent(username)}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setSchedule(data);
      } catch (err) {
        setError('Failed to fetch schedule');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, [username]);

  if (loading) return (
    <div className="staff-schedule-container">
      <StaffTopBar />
      <div className="staff-schedule-content">
        <div className="loading-message">Loading schedule...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="staff-schedule-container">
      <StaffTopBar />
      <div className="staff-schedule-content">
        <div className="error-message">{error}</div>
      </div>
    </div>
  );

  if (schedule.length === 0) {
    return (
      <div className="staff-schedule-container">
        <StaffTopBar />
        <div className="staff-schedule-content">
          <div className="no-schedule-message">No schedule found.</div>
        </div>
      </div>
    );
  }

//   return (
//     <div>
//       <h2>Your Schedule</h2>
//       <table border="1" cellPadding="8" style={{borderCollapse: 'collapse', width: '100%', maxWidth: '600px'}}>
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Start Time</th>
//             <th>End Time</th>
//           </tr>
//         </thead>
//         {/* <tbody>
//           {schedule.map(({ Schedule_id, Work_date, Start_time, End_time }) => (
//             <tr key={Schedule_id}>
//               <td>{new Date(Work_date).toLocaleDateString()}</td>
//               <td>{Start_time}</td>
//               <td>{End_time}</td>
//             </tr>
//           ))}
//         </tbody> */}
//         <tbody>
//   {schedule.map(({ schedule_id, work_date, start_time, end_time }) => (
//     <tr key={schedule_id}>
//       <td>{new Date(work_date).toLocaleDateString()}</td>
//       <td>{start_time.slice(0,5)}</td>
//       <td>{end_time.slice(0,5)}</td>
//     </tr>
//   ))}
// </tbody>

//       </table>
//     </div>
//   );
return (
  <div className="staff-schedule-container">
    <StaffTopBar />
    <div className="staff-schedule-content">
      <div className="schedule-header">
        <h1 className="schedule-title">Your Schedule</h1>
        <div className="schedule-subtitle">View your upcoming work shifts</div>
      </div>

      <div className="schedule-card">
        <div className="table-container">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map(({ schedule_id, work_date, start_time, end_time }) => (
                <tr key={schedule_id}>
                  <td>{new Date(work_date).toLocaleDateString()}</td>
                  <td>{start_time.slice(0, 5)}</td>
                  <td>{end_time.slice(0, 5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

}

export default StaffSchedule;

