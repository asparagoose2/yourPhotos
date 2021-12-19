const mongoose = require('mongoose' );
const consts = require('./data/constants' );
require('dotenv').config();
const { DB_HOST, DB_USER, DB_PASSWORD } = consts;
const url = process.env.DB_HOST;

console.log(url)

const options = {
  useNewUrlParser: true, // For deprecation warnings
  useUnifiedTopology: true, // For deprecation warnings
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD
 };
 mongoose
  .connect(url, options)
  .then(() => console.log('connected' ))
  .catch(err => console.log(`connection error: ${err}`));