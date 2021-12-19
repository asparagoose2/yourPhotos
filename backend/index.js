const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
// const morgan = require('morgan');
const _ = require('lodash');

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

const { photosRouter } = require('./routers/photosRouter');
const { galleryRouter } = require('./routers/galleryRouter');
const { eventRouter } = require('./routers/eventRouter');

// enable static serving of files
app.use(express.static('frontend'));
app.use(express.static('public/uploads'));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/photos", photosRouter);
app.use("/api/events", eventRouter);
app.use("/api/gallery",galleryRouter)

// app.get("/api/events/:id", (req, res) => {
//     const eventId = req.params.id;
//     res.json({status: true, event: {name: "eventId"}});
// });
// app.use(morgan('dev'));

//start app 
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);


// app.post('/upload-photos/:eventId', async (req, res) => {
//     try {
//         if(!req.files) {
//             res.send({
//                 status: false,
//                 message: 'No file uploaded'
//             });
//         } else {
//             let data = []; 

//             // create new folder for event in ../public/uploads/
//             const eventId = req.params.eventId;
//             const uploadDir = `../public/uploads/${eventId}`;
//             const fs = require('fs');
//             if (!fs.existsSync(uploadDir)) {
//                 fs.mkdirSync(uploadDir);
//             }
//             //loop all files
//             _.forEach(_.keysIn(req.files.photos), (key) => {
//                 let photo = req.files.photos[key];
                
//                 //move photo to uploads directory
//                 photo.mv(uploadDir + "/" + photo.name);

//                 //push file details
//                 data.push({
//                     name: photo.name,
//                     mimetype: photo.mimetype,
//                     size: photo.size
//                 });
//             });
    
//             //return response
//             res.send({
//                 status: true,
//                 message: 'Files are uploaded',
//                 data: data
//             });
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });
