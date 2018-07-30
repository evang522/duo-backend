'use strict';
//================================== Import Dependencies ====================>
const mongoose = require('mongoose');

const UserSchema = new  mongoose.Schema({
  duoId: {
    type: String,
    required:true
  },
  email: {
    type: String,
    required:true
  },
  name: {
    type:String,
    required:true
  },
  preferences: {
    type: Object
  },
  bio: {
    type:String,
  },
  password: {
    type:String,
    required:true
  },
  competitions: {
    type:Array,
    default: []
  }
});


module.exports = mongoose.model('user', UserSchema);