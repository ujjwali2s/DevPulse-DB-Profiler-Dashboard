// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// // Member side pages
// import DashboardPage from './pages/DashboardPage';  // Member intermediate after login
// import Home from './pages/Home';  // Member search home page after clicking search books
// import Notifications from './pages/Notifications';
// import History from './pages/History';


// // Staff side pages
// import StaffHome from './pages/StaffHome';          // Staff intermediate after login
// import StaffDashboard from './pages/StaffDashboard'; 
// import SearchAvailability from './pages/SearchAvailability';
// import StaffProfile from './pages/StaffProfile';
// import StaffSchedule from './pages/StaffSchedule';
// // import StaffNotifications from './pages/StaffRequests';
// import StaffRequests from './pages/StaffRequests';
// import AddBooks from './pages/AddBooks'; // Adjust path as needed



// // Common pages (used by both or general)
// import HomePage from './pages/homepage';
// import Profile from './pages/Profile';
// //import History from './pages/History';
// //import Notifications from './pages/Notifications';
// import Request from './pages/Request';
// import FineDues from './pages/FineDues';
// import MemberSearchPage from './pages/MemberSearchPage';
// import LoginPage from './pages/LoginPage';
// import SearchByTitle from './pages/SearchByTitle';
// import SearchByLanguage from './pages/SearchByLanguage'; 
// import SearchByAuthor from './pages/SearchByAuthor';
// import SearchByGenre from './pages/SearchByGenre';
// import SignupStep1 from './pages/SignupStep1';
// import SignupStep2 from './pages/SignupStep2';
// import RequestBook from './pages/Request';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Public and general routes */}
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<LoginPage />} />

//         {/* Member routes */}
//         <Route path="/member/dashboard" element={<DashboardPage />} />  {/* Intermediate member page */}
//         <Route path="/member/search" element={<Home />} />              {/* Member book search */}
//         <Route path="/request" element={<RequestBook />} />
//          <Route path="/notifications" element={<Notifications />} />
         
// <Route path="/history" element={<History />} />

//         {/* Staff routes */}
//         <Route path="/staff-home" element={<StaffHome />} />            {/* Intermediate staff page */}
//         <Route path="/staff-dashboard" element={<StaffDashboard />} />  {/* Staff dashboard */}
//         <Route path="/staff/search-availability" element={<SearchAvailability />} />
//         <Route path="/staff-profile" element={<StaffProfile />} />
//         <Route path="/staff-requests" element={<StaffRequests />} />
//         <Route path="/staff-schedule" element={<StaffSchedule />} />
//         <Route path="/staff-add-books" element={<AddBooks />} />



//         {/* Search routes */}
//         <Route path="/search/title" element={<SearchByTitle />} />
//         <Route path="/search/language" element={<SearchByLanguage />} />
//         <Route path="/search/author" element={<SearchByAuthor />} />
//         <Route path="/search/genre" element={<SearchByGenre />} />

//         {/* Common user routes */}
//         <Route path="/profile" element={<Profile />} />
//         //<Route path="/notifications" element={<Notifications />} />
//         <Route path="/request" element={<Request />} />
//         <Route path="/fines" element={<FineDues />} />

//         {/* Signup routes */}
//         <Route path="/signup-step1" element={<SignupStep1 />} />
//         <Route path="/signup-step2" element={<SignupStep2 />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// import React from 'react';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Member side pages
import DashboardPage from './pages/DashboardPage';  // Member intermediate after login
import Home from './pages/Home';  // Member search home page after clicking search books
import Notifications from './pages/Notifications';
import History from './pages/History';
import BookReviews from './pages/BookReviews';

// Staff side pages
import StaffHome from './pages/StaffHome';          // Staff intermediate after login
import StaffDashboard from './pages/StaffDashboard'; 
import SearchAvailability from './pages/SearchAvailability';
import StaffProfile from './pages/StaffProfile';
import StaffSchedule from './pages/StaffSchedule';
// import StaffNotifications from './pages/StaffRequests';
import StaffRequests from './pages/StaffRequests';
import AddBooks from './pages/AddBooks'; // Adjust path as needed

// Common pages (used by both or general)
import HomePage from './pages/homepage';
import Profile from './pages/Profile';
//import History from './pages/History';
//import Notifications from './pages/Notifications';
import Request from './pages/Request';
import FineDues from './pages/FineDues';
import MemberSearchPage from './pages/MemberSearchPage';
import LoginPage from './pages/LoginPage';
import SearchByTitle from './pages/SearchByTitle';
import SearchByLanguage from './pages/SearchByLanguage'; 
import SearchByAuthor from './pages/SearchByAuthor';
import SearchByGenre from './pages/SearchByGenre';
import SignupStep1 from './pages/SignupStep1';
import SignupStep2 from './pages/SignupStep2';
import RequestBook from './pages/Request';
import BookDetails from './pages/BookDetails'; 
import ReadList from './pages/ReadList';
import StaffReturnReq from './pages/StaffReturnReq';

import GenrePage from './pages/GenrePage';

// Import your new StatisticsDashboard component
import StatisticsDashboard from './pages/StatisticsDashboard';

function App() {

  //new part in oindrila's code
  const [loggedInMemberId, setLoggedInMemberId] = useState(null); // ✅ state for member ID

  // ✅ Restore member ID from localStorage on app load
  useEffect(() => {
    const storedId = localStorage.getItem('memberId');
    
    if (storedId) {
      setLoggedInMemberId(Number(storedId));
    }
  }, []);
    console.log('Rendering BookReviews with memberId:', loggedInMemberId);
  //until here

  return (
    <Router>
      <Routes>
        {/* Public and general routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage setLoggedInMemberId={setLoggedInMemberId} />} />
        <Route path="/genre/:genreId" element={<GenrePage />} />

        {/* Member routes */}
        <Route path="/member/dashboard" element={<DashboardPage />} />  {/* Intermediate member page */}
        <Route path="/member/search" element={<Home />} />              {/* Member book search */}
        <Route path="/request" element={<RequestBook />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/history" element={<History />} />
        <Route path="/book/:book_id/reviews" element={<BookReviews member_id={loggedInMemberId} />} />

        {/* Staff routes */}
        <Route path="/staff-home" element={<StaffHome />} />            {/* Intermediate staff page */}
        <Route path="/staff-dashboard" element={<StaffDashboard />} />  {/* Staff dashboard */}
        <Route path="/staff-search-availability" element={<SearchAvailability />} />
        <Route path="/staff-profile" element={<StaffProfile />} />
        <Route path="/staff-requests" element={<StaffRequests />} />
        <Route path="/staff-return-requests" element={<StaffReturnReq />} />
        <Route path="/staff-schedule" element={<StaffSchedule />} />
        <Route path="/staff-add-books" element={<AddBooks />} />

        {/* Add your statistics dashboard route here */}
        <Route path="/staff-statistics" element={<StatisticsDashboard userRole="staff" />} />

        {/* Search routes */}
        <Route path="/search/title" element={<SearchByTitle />} />
        <Route path="/search/language" element={<SearchByLanguage />} />
        <Route path="/search/author" element={<SearchByAuthor />} />
        <Route path="/search/genre" element={<SearchByGenre />} />

        {/* Common user routes */}
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/notifications" element={<Notifications />} /> */}
        <Route path="/request" element={<Request />} />
        <Route path="/fines" element={<FineDues />} />

        {/* Signup routes */}
        <Route path="/signup-step1" element={<SignupStep1 />} />
        <Route path="/signup-step2" element={<SignupStep2 />} />

        <Route path="/book/:bookId" element={<BookDetails />} />
        <Route path="/readlist" element={<ReadList />} />

        {/* Add your statistics dashboard route here */}
      </Routes>
    </Router>
  );
}

export default App;
