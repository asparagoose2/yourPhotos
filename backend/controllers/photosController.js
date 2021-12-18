const { spawn } = require('child_process');


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
            //check if folder exists
            if(fs.existsSync("image_processing/yourPhotos_logic.py")) {
                console.log("yes");
                //run python script
                const pythonProcess = spawn('python3', ["image_processing/yourPhotos_logic.py", "scan" ,"public/uploads/1234"]);
                pythonProcess.stdout.on('data', (data) => {
                    console.log(`stdout: ${data}`);
                });
                pythonProcess.stderr.on('data', (data) => {
                    console.error(`stderr: ${data}`);
                    });
        
                pythonProcess.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
                });
            }

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

createEvent = async function(req, res) {
    let pythonProcess;
    if (req.body.event_owner && req.body.guests) {
        pythonProcess = spawn('python3',["image_processing/yourPhotos_logic.py", "create_event", req.body.event_name, req.body.event_date, req.body.event_owner || null, req.body.guests || null]);
    } else {
        pythonProcess = spawn('python3',["image_processing/yourPhotos_logic.py", "create_event", req.body.event_name, req.body.event_date]);
    }
    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        res.json({status: true, body: { message: "Event created", event_id: data.toString() }});
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.json({status: false, message: 'Error creating event'});
    });
    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

generate_qr_codes = async function(req, res) {
    eventId = req.params.eventId;
    guest_list_file =  req.files.guest_list
    // create new folder for event in ../public/uploads/
    const uploadDir = `public/qr_codes/${eventId}`;
    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    guest_list_file.mv(`${uploadDir}/guest_list.csv`);
    const pythonProcess = spawn('python3',["image_processing/yourPhotos_logic.py", "create", `${uploadDir}/guest_list.csv`, req.params.eventId]);
    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
    res.send(`public/uploads/${eventId}/${guest_list_file.name}`);
}


module.exports = {
    uploadPhotos,
    generate_qr_codes,
    createEvent
}