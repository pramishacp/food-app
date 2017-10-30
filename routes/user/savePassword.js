"use strict";

//Grab the packages we need
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); 


const secret = 'harrypotter';    // Create custom secret for use in JWT

//Grab the model we need
const User = mongoose.model('User');

// create a user (accessed at POST http://localhost:3000/api/users)
let savePassword  = function(req, res){

    User.findOne({ username: req.body.username }).select('username email name password resettoken').exec(function(err, user) {
        if (err) throw err; // Throw error if cannot connect
        if (req.body.password == null || req.body.password == '') {
            res.json({ success: false, message: 'Password not provided' });
        } else {
            user.password = req.body.password; // Save user's new password to the user object
            user.resettoken = false; // Clear user's resettoken 
            // Save user's new data
            user.save(function(err) {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    // Create e-mail object to send to user
                    var email = {
                        from: 'Localhost Staff, staff@localhost.com',
                        to: user.username,
                        subject: 'Localhost Reset Password',
                        text: 'Hello ' + user.username + ', This e-mail is to notify you that your password was recently reset at localhost.com',
                        html: 'Hello<strong> ' + user.username + '</strong>,<br><br>This e-mail is to notify you that your password was recently reset at localhost.com'
                    };
                    // Function to send e-mail to the user
                    client.sendMail(email, function(err, info) {
                        if (err) console.log(err); // If error with sending e-mail, log to console/terminal
                    });
                    res.json({ success: true, message: 'Password has been reset!' }); // Return success message
                }
            });
        }
    });
}

module.exports = {
    savePassword : savePassword
}

