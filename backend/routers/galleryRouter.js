const { Router } = require('express');
const { galleryController} = require('../controllers/galleryController');

const galleryRouter = new Router();
galleryRouter.get('/:galleryId',galleryController.getGalleryById);
galleryRouter.put('/:galleryId',galleryController.updateGalleryDetails);

module.exports = {galleryRouter};