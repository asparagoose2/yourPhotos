const spawn = require("child_process").spawn;


uploadPhotos = async function(req, res) {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = []; 

            // create new folder for event in ../public/uploads/
            const eventId = req.params.eventId;
            const uploadDir = `public/uploads/${eventId}`;
            const fs = require('fs');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }
            req.files.photos.forEach((photo) => {
                //move photo to uploads directory
                photo.mv(uploadDir + "/" + photo.name);

                //push file details
                data.push({
                    name: photo.name,
                    mimetype: photo.mimetype,
                    size: photo.size
                });
            });

            const pythonProcess = spawn('python3',["image_processing/", "scan", "Sample_images"]);
            pythonProcess.stdout.on('data', (data) => {
               console.log(`stdout: ${data}`);
            });
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
}


module.exports = {
    uploadPhotos
}