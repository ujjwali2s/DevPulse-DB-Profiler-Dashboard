console.log("✅ index.js has started running");


const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');

const searchRoutes = require('./routes/search');
const staffBookSearchRoutes = require('./routes/staffbooksearch');
const registerRoutes = require('./routes/register');
const profileRoutes = require('./routes/profile');
const staffRoutes = require('./routes/staff');
const requestRoutes = require('./routes/request');
const notificationRoutes = require('./routes/notifications');
const historyRoutes = require('./routes/history');
const memberDashboardRoutes = require('./routes/member_dashboard');
const statisticsRoutes = require('./routes/statistics');
//const fineCalculationRoutes = require('./routes/fine_calculation');
const bookRoutes = require('./routes/books');
const readlistRoutes = require('./routes/readlist');
//const returnRequests = require('./routes/returnRequests');
const staffReturnsRoutes = require('./routes/staffReturns');
const memberFineRoutes = require('./routes/member_fine');
const genreRoutes = require('./routes/genre');
const path = require('path');

app.use(cors());
app.use(express.json());



app.use('/home', homeRoutes);
app.use('/profile', profileRoutes);        
//app.use('/staff', staffRoutes);
app.use('/staff-main', staffRoutes);
app.use('/search', searchRoutes);           
app.use('/staff', staffBookSearchRoutes);   
app.use('/request', requestRoutes);
app.use('/notifications', notificationRoutes);
app.use('/member-main/history', historyRoutes);
// app.use('/home', homeRoutes);
app.use('/', authRoutes);                    
app.use('/register', registerRoutes);      
app.use('/member-dashboard', memberDashboardRoutes);
app.use('/api/statistics', statisticsRoutes);
//app.use('/fine-calculation', fineCalculationRoutes);
app.use('/books', bookRoutes);
//app.use('/readlist', readlistRoutes);
app.use('/member', readlistRoutes);
//app.use('/request', returnRequests);
app.use('/staff-returns', staffReturnsRoutes);
app.use('/member', memberFineRoutes);
app.use('/genre', genreRoutes);
app.use('/static', express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.send('👋 Hello from backend root');
});


app.listen(port, () => {
  console.log(`✅ Backend running on http://localhost:${port}`);
});








