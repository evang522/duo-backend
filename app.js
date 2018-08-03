'use strict';

//================================== Import Dependencies ====================>

const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const {DBURL} = require('./config');
const userRoute = require('./routes/user.routes');
const challengeRoute = require('./routes/challenges.routes');
const {PORT} = require('./config');
const authRoute = require('./routes/auth.routes');

//================================== Set Up CORS ====================>
app.use(cors());


//============================= JSON Parser ==========================>
app.use(express.json());


//================================== Routes ===========================>
app.use('/api', userRoute);
app.use('/api', challengeRoute);
app.use('/api', authRoute);


//================================== Set Up Logger ====================>

app.use(morgan('common'));


//===================================Connect to DB=====================>
mongoose.connect(DBURL, { useNewUrlParser: true },  (err) => {
  if (err) {
    console.log(err);
  }
  console.log('DB Connected');
});

//================================== Error Handler ====================>
app.use((err,req,res,next) => {
  const error = new Error();
  error.status = err.status || 500;
  error.message = err.message || 'Internal error message'; 
  console.log(err);
  res.status(error.status).json(error);
});

// =========================== Begin HTTP service=====================>
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});