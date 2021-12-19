const Events = require('../model/eventModel');

exports.eventController = {
    getEventById(req,res) {
        console.log(req.params.eventId);
        Events.findOne({"event_id":req.params.eventId})
        .then(docs => {res.json({status: true, event: docs})})
        .catch(err => console.log(`Error getting events from DB: ${err}`));
    }
}