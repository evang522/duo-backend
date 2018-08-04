'use strict';
//================================== Import Dependencies ====================>
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const {JWT_SECRET} = require('../config');

router.use('/auth/login', (req,res,next) => {
  const {email, password} = req.body;

  if (!email || !password) {
    const err = new Error();
    err.status = 400;
    err.message = 'Email or password';
    return next(err);
  }

  User.findOne({email:email})
    .then(user => {
      console.log(user);

      if (!user) {
        const err = new Error();
        err.status = 403;
        err.message = 'Email or Password not recognized';
        return next(err);
      }

      if (!user.verifyPassword(password)) {
        const err = new Error();
        err.status = 403;
        err.message = 'Email or Password not recognized';
        return next(err);
      } else {
        res.status(200).json({'authToken':jwt.sign(JSON.stringify(user), JWT_SECRET)});
      }


    })
    .catch(next);

});




module.exports = router;