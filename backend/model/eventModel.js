const {Schema , model} = require('mongoose');

const eventsSchema = new Schema({
    _id:{type:String},
    event_id:{type:String},
    event_name:{type:String},
    event_date:{type:Date},
    event_owner:{type:String},
    guests:{type:Array}
},{collection:"events"});

const Events = model('Events', eventsSchema);
module.exports = Events;