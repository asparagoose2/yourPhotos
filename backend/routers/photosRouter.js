const { Router } = require('express');
const photosController = require('../controllers/photosController');

const photosRouter = new Router();


photosRouter.post('/upload/:eventId',photosController.uploadPhotos);
photosRouter.post('/qr/:eventId',photosController.generate_qr_codes);
photosRouter.post('/newEvent',photosController.createEvent);

module.exports = {photosRouter};