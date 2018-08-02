'use strict';
//================================== Import Dependencies ====================>
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

router.use('/auth/login', (req,res,next) => {
  const {email, password} = req.body;

  if (!email || !password) {
    const err = new Error();
    err.status = 400;
    err.message = 'Missing username or password';
    return next(err);
  }

  User.findOne({email:email})
    .then(user => {
      console.log(user);

      if (!user) {
        const err = new Error();
        err.status = 400;
        err.message = '-User- or Password not recognized';
        return next(err);
      }

      if (!user.verifyPassword(password)) {
        const err = new Error();
        err.status = 403;
        err.message = 'Username or Password not recognized';
        return next(err);
      } else {
        res.status(200).json({'authToken':jwt.sign(JSON.stringify(user), 'hogwash')});
      }


    })
    .catch(next);

});




module.exports = router;