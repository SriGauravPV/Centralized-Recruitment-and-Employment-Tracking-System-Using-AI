require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const companyRoutes = require('./routes/companyRoutes');
const studentDetails = require('./routes/StudentDetails');
const CompanyDetails = require('./routes/CompanyDetails');
const drives = require('./routes/CompanyDrive');
const Message = require('./routes/Message');
const total = require('./routes/total');
const forget = require('./routes/forgotpassword');
const getstudentsbycompany = require('./routes/getstudentsbycompany');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api',studentDetails);
app.use('/api',CompanyDetails);
app.use('/api/drives',drives);
app.use('/api/messages', Message);
app.use('/api/admin',total)
app.use('/api/auth', forget);
app.use('/api',getstudentsbycompany);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));