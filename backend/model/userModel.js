const {Schema , model} = require('mongoose');

const userSchema = new Schema({
    email:{type:String},
    password:{type:String},
},{collection:"users"});

const User = model('User', userSchema);
module.exports = User;