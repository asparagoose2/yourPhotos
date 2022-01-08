const { Router } = require('express');
const { eventController} = require('../controllers/eventController');

const eventRouter = new Router();
eventRouter.get('/',eventController.getEventById);
eventRouter.get('/:userId',eventController.getUsersEvents);

module.exports = {eventRouter};