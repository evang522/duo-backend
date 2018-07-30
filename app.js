'use strict';

//================================== Import Dependencies ====================>

const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');


//================================== Routes ====================>
//set up routes



//================================== Set Up Logger ====================>

app.use(morgan('common'));

//================================== Error Handler ====================>
app.use((err,req,res,next) => {
  const error = new Error();
  error.status = err.status || 500;
  error.message = err.message || 'Internal error message'; 
  res.json(error);
});




