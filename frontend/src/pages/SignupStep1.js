// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './SignupStep1.css';

// function SignupStep1() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     street: '',
//     postalCode: '',
//     city: '',
//     division: '',
//     country: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch('http://localhost:5000/register/signup/step1', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.error || 'Error during signup step 1');
//       } else {
//         // Go to step 2, passing person_id (and optionally address_id)
//         navigate('/signup-step2', { state: { personId: data.person_id } });
//       }
//     } catch (err) {
//       alert('Network error: ' + err.message);
//     }
//   };

//   return (
//     <div className="signup-container">
//       <h2>Sign Up - Step 1</h2>
//       <form onSubmit={handleSubmit} className="signup-form">
//         <input name="firstName" placeholder="First Name" onChange={handleChange} required />
//         <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
//         <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
//         <input name="phone" placeholder="Phone" onChange={handleChange} required />
//         <input name="street" placeholder="Street" onChange={handleChange} required />
//         <input name="postalCode" placeholder="Postal Code" onChange={handleChange} required />
//         <input name="city" placeholder="City" onChange={handleChange} required />
//         <input name="division" placeholder="Division" onChange={handleChange} required />
//         <input name="country" placeholder="Country" onChange={handleChange} required />
//         <button type="submit">Continue to Step 2</button>
//       </form>
//     </div>
//   );
// }

// export default SignupStep1;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './SignupStep1.css';

// function SignupStep1() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     street: '',
//     postalCode: '',
//     city: '',
//     division: '',
//     country: '',
//   });

//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch('http://localhost:5000/register/signup/step1', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       console.log('Step 1 response:', data);

//       if (!res.ok) {
//         setError(data.error || 'Error during signup step 1');
//       } else {
//         setError(null);
//         navigate('/signup-step2', { state: { personId: data.personId || data.person_id } });
//       }
//     } catch (err) {
//       setError('Network error: ' + err.message);
//     }
//   };

//   return (
//     <div className="signup-container">
//       <h2>Sign Up - Step 1</h2>
//       {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit} className="signup-form">
//         <input
//           name="firstName"
//           placeholder="First Name"
//           onChange={handleChange}
//           value={formData.firstName}
//           required
//         />
//         <input
//           name="lastName"
//           placeholder="Last Name"
//           onChange={handleChange}
//           value={formData.lastName}
//           required
//         />
//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           onChange={handleChange}
//           value={formData.email}
//           required
//         />
//         <input
//           name="phone"
//           placeholder="Phone"
//           onChange={handleChange}
//           value={formData.phone}
//           required
//         />
//         <input
//           name="street"
//           placeholder="Street"
//           onChange={handleChange}
//           value={formData.street}
//           required
//         />
//         <input
//           name="postalCode"
//           placeholder="Postal Code"
//           onChange={handleChange}
//           value={formData.postalCode}
//           required
//         />
//         <input
//           name="city"
//           placeholder="City"
//           onChange={handleChange}
//           value={formData.city}
//           required
//         />
//         <input
//           name="division"
//           placeholder="Division"
//           onChange={handleChange}
//           value={formData.division}
//           required
//         />
//         <input
//           name="country"
//           placeholder="Country"
//           onChange={handleChange}
//           value={formData.country}
//           required
//         />
//         <button type="submit">Continue to Step 2</button>
//       </form>
//     </div>
//   );
// }

// export default SignupStep1;



// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './SignupStep1.css';

// function SignupStep1() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     street: '',
//     postalCode: '',
//     city: '',
//     division: '',
//     country: '',
//   });

//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch('http://localhost:5000/register/signup/step1', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: formData.email }), // ✅ only send email
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || 'Error during signup step 1');
//       } else {
//         setError(null);
//         // ✅ Send all formData to step2 via location.state
//         navigate('/signup-step2', { state: { formData } });
//       }
//     } catch (err) {
//       setError('Network error: ' + err.message);
//     }
//   };

//   return (
//     <div className="signup-container">
//       <h2>Sign Up - Step 1</h2>
//       {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit} className="signup-form">
//         {/* all inputs unchanged */}
//         {['firstName', 'lastName', 'email', 'phone', 'street', 'postalCode', 'city', 'division', 'country'].map((field) => (
//           <input
//             key={field}
//             name={field}
//             placeholder={field.replace(/([A-Z])/g, ' $1')}
//             type={field === 'email' ? 'email' : 'text'}
//             onChange={handleChange}
//             value={formData[field]}
//             required
//           />
//         ))}
//         <button type="submit">Continue to Step 2</button>
//       </form>
//     </div>
//   );
// }

// export default SignupStep1;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupStep1.css';

function SignupStep1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    postalCode: '',
    city: '',
    division: '',
    country: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/register/signup/step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error during signup step 1');
      } else {
        setError(null);

        // Pass full form data + person_id to Step 2
        navigate('/signup-step2', { 
          state: { 
            formData: { ...formData, personId: data.person_id } 
          } 
        });
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up - Step 1</h2>
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
          value={formData.firstName}
          required
        />
        <input
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
          value={formData.lastName}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          value={formData.phone}
          required
        />
        <input
          name="street"
          placeholder="Street"
          onChange={handleChange}
          value={formData.street}
          required
        />
        <input
          name="postalCode"
          placeholder="Postal Code"
          onChange={handleChange}
          value={formData.postalCode}
          required
        />
        <input
          name="city"
          placeholder="City"
          onChange={handleChange}
          value={formData.city}
          required
        />
        <input
          name="division"
          placeholder="Division"
          onChange={handleChange}
          value={formData.division}
          required
        />
        <input
          name="country"
          placeholder="Country"
          onChange={handleChange}
          value={formData.country}
          required
        />
        <button type="submit">Continue to Step 2</button>
      </form>
    </div>
  );
}

export default SignupStep1;

