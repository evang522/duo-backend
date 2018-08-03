'use strict';
module.exports = {
  DBURL: process.env.DBURL || 'mongodb://localhost:27017/duo',
  PORT: process.env.PORT || 8080,
  JWT_SECRET: process.env.JWT_SECRET || 'balderdash'
};