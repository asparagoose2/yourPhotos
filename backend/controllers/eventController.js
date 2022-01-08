const Events = require('../model/eventModel');

exports.eventController = {
    getEventById(req,res) {
        console.log(req.params.eventId);
        Events.findOne({"event_id":req.query.eventId})
        .then(docs => {res.json({status: true, event: docs})})
        .catch(err => console.log(`Error getting events from DB: ${err}`));
    },
    getUsersEvents(req,res) {
        Events.find({"event_owner":req.params.userId})
        .then(docs => {res.json({status: true, events: docs})})
        .catch(err => console.log(`Error getting events from DB: ${err}`));
    }

}