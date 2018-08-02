'use strict';

//================================== Import Dependencies ====================>

const mongoose = require('mongoose');


const ChallengeSchema = new mongoose.Schema({
  title: {
    type:String,
    required:true
  },
  alias: {
    type:String,
    unique:true,
    required:true
  },

  members: [{type: mongoose.Schema.Types.ObjectId, ref:'user'}]
  ,
  starttime: {
    type:String
  },
  duration: {
    type:String
  },
  discussions: [{type:mongoose.Schema.Types.ObjectId, ref:'discussion'}],
  admins: [{type: mongoose.Schema.Types.ObjectId, ref:'user'}],
  options: {
    type:Object
  },
  status: {
    type:String,
    required:true,
    default:'awaited'
  },
  winner: {
    type:String,
  },
  description: {
    type:String
  },
  languages: [String]
});


ChallengeSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = doc._id;
    delete ret._id;
    delete ret.__v;
  }
});


module.exports = mongoose.model('challenge', ChallengeSchema);
