const { Router } = require('express');
const { galleryController} = require('../Controllers/galleryController');

const galleryRouter = new Router();
galleryController.get('/:galleryId',galleryController.getGalleryById());
galleryController.put('/:galleryId',galleryController.updateGalleryDetails());

module.exports = {galleryRouter};