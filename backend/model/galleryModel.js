const {Schema , model} = require('mongoose');

const gallerySchema = new Schema({
    id:{type:String},
    first_name:{type:String},
    last_name:{type:String},
    email:{type:String},
    phone:{type:String},
    photos:{type:Array},
    event:{type:String}
},{collection:"galleries"});

const Gallery = model('Gallery', gallerySchema);
module.exports = Gallery;