'use strict';

//================================== Import Dependencies ====================>
const express =require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');


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
    })
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
            error.message = `Missing ${field} field.`
           return  err = error;
        }
        newUser[field] = req.body[field];
    })

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

    console.log(newUser);
    
    User.create(newUser)
        .then(user => {
            res.json(user);
        })
        .catch(err => {
            next(err);
        })

})


//======================================= PUT USERS =====================>

router.put('/users', (req,res,next) => {
    
})


module.exports = router;