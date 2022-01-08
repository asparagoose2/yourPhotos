const { Router } = require('express');
const usersController = require('../controllers/usersController');

const usersRouter = new Router();

usersRouter.post('/',usersController.addUser);
usersRouter.get('/', usersController.getUser);

module.exports = {usersRouter};