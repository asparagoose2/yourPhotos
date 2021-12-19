const Events = require('../model/eventModel');

exports.eventController = {
    getEventById(req,res) {
        Events.find({"id":req.params.eventId})
        .then(docs => {res.json(docs)})
        .catch(err => console.log(`Error getting events from DB: ${err}`));
    }
}