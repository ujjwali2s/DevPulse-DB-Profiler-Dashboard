// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './SignupStep2.css';

// function SignupStep2() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const personId = location.state?.personId;

//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//   });

//   if (!personId) {
//     return <div>Error: Missing person ID. Please complete Step 1 first.</div>;
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch('http://localhost:5000/register/signup/step2', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...formData, personId }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.error || 'Signup step 2 failed.');
//       } else {
//         alert('Signup complete! You can now log in.');
//         navigate('/login');
//       }
//     } catch (err) {
//       alert('Network error: ' + err.message);
//     }
//   };

//   return (
//     <div className="signup2-container">
//       <h2>Sign Up - Step 2</h2>
//       <form onSubmit={handleSubmit} className="signup2-form">
//         <input
//           name="username"
//           placeholder="Choose a Username"
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Choose a Password"
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Complete Signup</button>
//       </form>
//     </div>
//   );
// }

// export default SignupStep2;


// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './SignupStep2.css';

// function SignupStep2() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const personId = location.state?.personId;

//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//   });

//   if (!personId) {
//     return <div>Error: Missing person ID. Please complete Step 1 first.</div>;
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch('http://localhost:5000/register/signup/step2', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...formData, personId }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.error || 'Signup step 2 failed.');
//       } else {
//         alert('Signup complete! You can now log in.');
//         navigate('/login');
//       }
//     } catch (err) {
//       alert('Network error: ' + err.message);
//     }
//   };

//   return (
//     <div className="signup2-container">
//       <h2>Sign Up - Step 2</h2>
//       <form onSubmit={handleSubmit} className="signup2-form">
//         <input
//           name="username"
//           placeholder="Choose a Username"
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Choose a Password"
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Complete Signup</button>
//       </form>
//     </div>
//   );
// }

// export default SignupStep2;


// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './SignupStep2.css';

// function SignupStep2() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const step1Data = location.state?.formData;

//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//   });

//   if (!step1Data) {
//     return <div>Error: Missing Step 1 data. Please start from Step 1.</div>;
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Merge step1Data with username/password
//     const fullSignupData = { ...step1Data, ...formData };

//     try {
//       const res = await fetch('http://localhost:5000/register/signup/step2', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(fullSignupData),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.error || 'Signup step 2 failed.');
//       } else {
//         alert('Signup complete! You can now log in.');
//         navigate('/login');
//       }
//     } catch (err) {
//       alert('Network error: ' + err.message);
//     }
//   };

//   return (
//     <div className="signup2-container">
//       <h2>Sign Up - Step 2</h2>
//       <form onSubmit={handleSubmit} className="signup2-form">
//         <input
//           name="username"
//           placeholder="Choose a Username"
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Choose a Password"
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Complete Signup</button>
//       </form>
//     </div>
//   );
// }

// export default SignupStep2;


import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SignupStep2.css';

function SignupStep2() {
  const navigate = useNavigate();
  const location = useLocation();
  const step1Data = location.state?.formData;

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    paymentAmount: '200', // default to full membership
  });

  if (!step1Data) {
    return <div>Error: Missing Step 1 data. Please start from Step 1.</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullSignupData = { 
      ...step1Data, 
      ...formData, 
      paymentAmount: parseInt(formData.paymentAmount) // convert to number
    };

    try {
      const res = await fetch('http://localhost:5000/register/signup/step2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullSignupData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Signup step 2 failed.');
      } else {
        alert('Signup complete! You can now log in.');
        navigate('/login');
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  return (
    <div className="signup2-container">
      <h2>Sign Up - Step 2</h2>
      <form onSubmit={handleSubmit} className="signup2-form">
        <input
          name="username"
          placeholder="Choose a Username"
          onChange={handleChange}
          value={formData.username}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Choose a Password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <label htmlFor="paymentAmount">Select Membership Type:</label>
        <select
          id="paymentAmount"
          name="paymentAmount"
          value={formData.paymentAmount}
          onChange={handleChange}
          required
        >
          <option value="200">৳200 - Full Membership</option>
          <option value="100">৳100 - Basic Membership</option>
        </select>
        <button type="submit">Complete Signup</button>
      </form>
    </div>
  );
}

export default SignupStep2;
