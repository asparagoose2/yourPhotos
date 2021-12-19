const { Router } = require('express');
const photosController = require('../controllers/photosController');

const photosRouter = new Router();


photosRouter.post('/upload/:eventId',photosController.uploadPhotos);
// photosRouter.post('/qr/:eventId',photosController.generate_qr_codes);
photosRouter.post('/newEvent',photosController.createEvent);
photosRouter.post('/qr/random',photosController.generate_random_qr_codes);
photosRouter.get('/download/:eventId', photosController.download_qr_codes);

module.exports = {photosRouter};