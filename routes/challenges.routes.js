'use strict';
//================================== Import Dependencies ====================>
const express = require('express');
const router = express.Router();
const Challenge = require('../models/challenges.model');
const User = require('../models/user.model');

//================================== GET Challenges ====================>
router.get('/challenges', (req,res,next) => {
  const query = {};

  const acceptedSearchFields = ['title','description','languages','members','alias']; // Avatar? 

  // Loop through each field and attach to query object if query contains pre-selected query parameters
  acceptedSearchFields.forEach(field => {
    if (field in req.query) {
      query[field] = req.query[field];
    } 
  });

  Challenge.find(query)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

//================================== Create New Challenges ====================>

router.post('/challenges', (req,res,next) => {
  //Establish Required Fields
  const requiredFields = ['title', 'description','alias'];
  const newChallenge = {};
  let err; 

  console.log(req.body);
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const _err = new Error();
      _err.status = 400;
      _err.message = `Missing ${field} field`;
      err = _err;
    }

    newChallenge[field] = req.body[field];
  });

  // Catch Errors
  if (err) {
    return next(err);
  }

  Challenge.create(newChallenge)
    .then(challenge => {
      //TODO REPLACE PLACEHOLDER WITH USERID
      Challenge.findByIdAndUpdate(challenge.id, {$push: {'members':'507f1f77bcf86cd799439011', 'admins':'507f1f77bcf86cd799439011'}}, {new:true})
        .then(update => {
          res.status(201).json(update);
        });

    })
    .catch(next); 


});



module.exports = router;