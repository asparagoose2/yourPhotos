const { Router } = require('express');
const { eventController} = require('../Controllers/eventController');

const eventRouter = new Router();
eventRouter.get('/:eventId',eventController.getEventById);

module.exports = {eventRouter};