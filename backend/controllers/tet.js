const galleryCon = require('./galleryController');
const eventsCon = require('./eventController');

const req = {
    params:{galleryId:"648cff8d-0f9c-45ff-a2d8-6c887af53080"},
    body:{
        first_name:"shololo",
        last_name:"balolo",
        email:"koraltsaba2@gmail.com",
        phone:NaN
    }
}

galleryCon.galleryController.getGalleryById({params:{galleryId:"648cff8d-0f9c-45ff-a2d8-6c887af53080"}},{json:console.log});
// eventsCon.eventController.getEventById({params:{eventId:"b9b57c1f-6628-4e66-96b8-b89d336627c5"}},{json:console.log});
//galleryCon.galleryController.updateGalleryDetails(req,{json:console.log});

const Gallery = require('../model/galleryModel');
require('dotenv').config();
const mongoose = require('mongoose' );
const consts = require('../data/constants' );
const { DB_HOST, DB_USER, DB_PASSWORD } = consts;
const url = process.env.DB_HOST;

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