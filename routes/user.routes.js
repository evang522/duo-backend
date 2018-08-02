'use strict';

//================================== Import Dependencies ====================>
const express =require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const axios = require('axios');


//================================== Get Users with Query ====================>

router.get('/users', (req,res,next) => {
  const query = {};

  // Accepted Query Fields
  const acceptedQueries = ['name','id','email'];

  acceptedQueries.forEach(field => {
    if (req.query[field]) {
      query[field] = req.query[field];
    }
  });

  User.find(query)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});


//==================================== Create new User =======================>

router.post('/users', (req,res,next) => {
  const acceptedFields = ['name','email','password'];
  const newUser = {};
  let err;

  // Loop through request body to ensure that it contains all 
  acceptedFields.forEach(field => {
    if (!(field in req.body)) {
      const error = new Error();
      error.status = 400;
      error.message = `Missing ${field} field.`;
      return  err = error;
    }
    newUser[field] = req.body[field];
  });

  if (err) {
    return next(err);
  }


  if (newUser.password.length !== newUser.password.trim().length) {
    const error = new Error();
    error.status = 400;
    error.message = 'Password contains blank space';
    err = error;
  } 

  if (err) {
    return next(err);
  }
    
  newUser.password = bcrypt.hashSync(newUser.password, 10);


    
  User.create(newUser)
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      next(err);
    });

});


//======================================= PUT USERS =====================>

router.put('/users/:id', (req,res,next) => {
    
  const {action} = req.query;
  const {id} = req.params;

  if (!action) {
    const err = new Error();
    err.status = 400;
    err.message = 'No request action query provided';
    return next(err);
  }

  if (action === 'setBio') {
    const {bio} = req.body;

    if (!bio) {
      const err = new Error();
      err.status = 400;
      err.message = 'Missing Bio in request Body';
      return next(err);
    }

    return User.findByIdAndUpdate(id, {bio}, {new:true})
      .then(response => {
        res.json(response);
      }) 
      .catch(err => {
        next(err);
      });

  }

  if (action === 'verifyDuoAccount') {
    const {step} = req.query;

    if (step === 'generateId') {
      const generateRandomId =  () => Math.floor(Math.random() * 100000000);
      const randomId = generateRandomId();

      return User.findByIdAndUpdate(id, {'duoVerifierId':randomId },{new:true})
        .then(response => {
          res.json({'id':randomId});
        })
        .catch(err => {
          next(err);
        });

    } 

    if (step === 'verifyId') {
      let duoVerifierId;
      const {duoUsername} = req.body;

      return User.findById(id)
        .then(user => {
          duoVerifierId = user.duoVerifierId;

          axios({
            // 'url':'https://www.duolingo.com/2017-06-30/users/evang522?fields=bio&_=1532406936067',
            'url':`https://www.duolingo.com/2017-06-30/users?username=${duoUsername}`,
            method:'GET'
          })
            .then(response => {
    
              const {bio} = response.data.users[0];
              const duoId = response.data.users[0].id;
                        
              if (!bio) {
                const err = new Error();
                err.status = 400;
                err.message = 'Duolingo profile does not contain verification ID in user bio';
                return next(err);
              }
              
              if (duoVerifierId.toString() === bio) {
                User.findByIdAndUpdate(id, {verified:true, duoId } ,{new:true})
                  .then(response => {
                    res.status(200).json({'verification':'success'});
                  });
              } else {
                const err = new Error();
                err.message = 'Code in Bio does not match verification ID provided';
                err.status = 400;
                return next(err);
              }

            });
        })
        .catch(err => {
          next(err);
        });
    }
  }

});


module.exports = router;