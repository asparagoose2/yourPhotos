const { spawn } = require('child_process');


uploadPhotos = async function(req, res) {
    console.log("upload photos");
    // console.log(req.files);
    console.log(req.body);
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
                const pythonProcess = spawn('python3', ["image_processing/yourPhotos_logic.py", "scan" ,"public/uploads/"+eventId]);
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

createEventAndQrCodes = async function(req, res) {
    let pythonProcess;
    guest_list_file =  req.files.guest_list
    console.log(req.files);
    console.log(req.body)   
    // create new folder for event in ../public/uploads/
    const uploadDir = `public/qr_codes/${eventId}`;
    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    guest_list_file.mv(`${uploadDir}/guest_list.csv`);
    
    if (req.body.event_owner && req.body.guests) {
        pythonProcess = spawn('python3',["image_processing/yourPhotos_logic.py", "create_event_and_qr", `${uploadDir}/guest_list.csv`, req.body.event_name, req.body.event_date, req.body.event_owner || null, req.body.guests || null]);
    } else {
        pythonProcess = spawn('python3',["image_processing/yourPhotos_logic.py", "create_event_and_qr", `${uploadDir}/guest_list.csv`, req.body.event_name, req.body.event_date]);
    }

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


createEvent = async function(req, res) {

    let pythonProcess;
    if (req.body.event_owner && req.body.guests) {
        pythonProcess = spawn('python3',["image_processing/yourPhotos_logic.py", "create_event", req.body.event_name, req.body.event_date, req.body.event_owner || null, req.body.guests || null]);
    } else {
        pythonProcess = spawn('python3',["image_processing/yourPhotos_logic.py", "create_event", req.body.event_name, req.body.event_date]);
    }
    pythonProcess.stdout.on('data', (data) => {
        console.log("data:", data.toString());
        const eventId = data.toString().replace(/(\r\n|\n|\r)/gm, "");
        guest_list_file =  req.files.guest_list
        console.log(req.files);
        console.log(req.body)   
        // create new folder for event in ../public/uploads/
        const uploadDir = `public/qr_codes/${eventId}`;
        const fs = require('fs');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        guest_list_file.mv(`${uploadDir}/guest_list.csv`);
        const pythonProcess2 = spawn('python3',["image_processing/yourPhotos_logic.py", "create", `${uploadDir}/guest_list.csv`, eventId]);
        pythonProcess2.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            
        });
        pythonProcess2.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        pythonProcess2.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            console.log(`uploadDir: ${uploadDir}`);
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Content-Disposition', 'attachment; filename=qr_codes.zip');
            res.attachment("qr_codes.zip");
            console.log("\n\nsending file...");
            // res.download(`${uploadDir}/qr_codes.zip`);
            res.sendFile(`${uploadDir}/qr_codes.zip`, {root:"."});
        });
        
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
    console.log("here");
    console.log(req.params.eventId);

    eventId = req.params.eventId;
    guest_list_file =  req.files.guest_list
    console.log(req.files);
    console.log(req.body)   
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

generate_random_qr_codes = async function(req, res) {
    console.log(req.params.eventId);
    const eventId = req.body.eventId;
    const count = req.body.number_of_qr;
    const pythonProcess = spawn('python3',["image_processing/yourPhotos_logic.py", "create_random_qr", count, eventId]);
    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (code == 0) {
            res.json({status: true, message: 'QR codes generated'});
        } else {
            res.json({status: false, message: 'Error generating QR codes'});
        }
    });
}

download_qr_codes = async function(req, res) {
    const eventId = req.params.eventId;
    const uploadDir = `public/qr_codes/${eventId}`;
}


module.exports = {
    uploadPhotos,
    generate_qr_codes,
    createEvent,
    createEventAndQrCodes
}