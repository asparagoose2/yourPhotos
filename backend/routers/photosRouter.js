const { Router } = require('express');
const photosController = require('../controllers/photosController');

const photosRouter = new Router();


photosRouter.post('/:eventId',photosController.uploadPhotos);

module.exports = {photosRouter};