'use strict';

//================================== Import Dependencies ====================>

const mongoose = require('mongoose');


mongoose.model({
  title: {
    type:String
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
    type:String, n
  }
});