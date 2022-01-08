const { Router } = require('express');
const usersController = require('../controllers/usersController');

const usersRouter = new Router();

usersRouter.post('/register',usersController.addUser);
usersRouter.post('/login', usersController.getUser);

module.exports = {usersRouter};