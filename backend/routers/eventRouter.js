const { Router } = require('express');
const { eventController} = require('../Controllers/eventController');

const eventRouter = new Router();
eventController.get('/:eventId',eventController.getEvent());

module.exports = {eventRouter};