const Gallery = require('../model/galleryModel');

exports.galleryController = {
    getGalleryById(req,res) {
        Gallery.find({"id":req.params.galleryId})
        .then(docs => {
            res.json(docs);
        })
        .catch(err => console.log(`Error getting the data from DB: ${err}`));
    },
    updateGalleryDetails(req,res) {
        Gallery.updateOne({"id":req.params.galleryId}, {first_name:req.body.first_name,last_name:req.body.last_name,email:req.body.email,phone:req.body.phone})
        .then(docs => {res.json(docs)})
        .catch(err => console.log(`Error updating gallery from DB: ${err}`));
    }
}