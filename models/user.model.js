'use strict';
//================================== Import Dependencies ====================>
const mongoose = require('mongoose');

const UserSchema = new  mongoose.Schema({
  duoId: {
    type: String,
    unique:true
  },
  email: {
    type: String,
    required:true,
    unique:true
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


UserSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = doc._id;
    delete ret.__v;
    delete ret._id;

  }
})


module.exports = mongoose.model('user', UserSchema);