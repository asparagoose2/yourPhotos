const bcrypt = require('bcrypt');
const User = require('../model/userModel');

getUser = function(req, res) {
    User.findOne({"username":req.body.username})
    .then(docs => {
        if (docs) {
            if (bcrypt.compareSync(req.body.password, docs.password)) {
                res.json({status: true, data: docs});
            } else {
                res.json({status: false, data: "Wrong password"});
            }
        } else {
            res.json({status: false, data: "User not found"});
        }
    })
    .catch(err => console.log(`Error getting the data from DB: ${err}`));
}

addUser = function(req, res) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const user = new User({
        email: req.body.email,
        password: hash,
    });
    user.save()
    .then(docs => {
        res.json({status: true, data: docs});
    })
    .catch(err => console.log(`Error saving the data to DB: ${err}`));
}

module.exports = {
    getUser,
    addUser
}