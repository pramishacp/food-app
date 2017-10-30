"use strict";

//Grab the packages we need
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); 
const nodemailer = require('nodemailer');
const  sgTransport = require('nodemailer-sendgrid-transport');

const secret = 'harrypotter';    // Create custom secret for use in JWT

//Grab the model we need
const User = mongoose.model('User');

// create a user (accessed at POST http://localhost:3000/api/users)
let forgotPassword  = function(req, res){
    
    // Start Sendgrid Configuration Settings	
    const options = {
        auth: {
          api_user: 'pramishacp',
          api_key: 'pramishacp123'
        }
    }
    
    var client = nodemailer.createTransport(sgTransport(options));
    // End Sendgrid Configuration Settings	
    
    User.findOne({ username: req.body.username }).select('username active email resettoken name').exec(function(err, user) {
        if (err) throw err; // Throw error if cannot connect
        if (!user) {
            res.json({ success: false, message: 'Username was not found' }); // Return error if username is not found in database
        } else if (!user.active) {
            res.json({ success: false, message: 'Account has not yet been activated' }); // Return error if account is not yet activated
        } else {
            user.resettoken = jwt.sign({ username: user.username}, secret, { expiresIn: '24h' }); // Create a token for activating account through e-mail
            // Save token to user in database
            user.save(function(err) {
                if (err) {
                    res.json({ success: false, message: err }); // Return error if cannot connect
                } else {
                    // Create e-mail object to send to user
                    var email = {
                        from: 'Food Delivery, pramishacp123@gmail.com',
                        to: user.username,
                        subject: 'Food delivery Reset Password Request',
                        text: 'Hello ' + user.username + ', You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:3000/resetpassowrd/' + user.resettoken,
                        html: 'Hello<strong> ' + user.username + '</strong>,<br><br>You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:8080/resetpassword/' + user.resettoken + '">http://localhost:8080/resetpassword/</a>'
                    };
                    // Function to send e-mail to the user
                    client.sendMail(email, function(err, info) {
                        if (err) console.log(err); // If error with sending e-mail, log to console/terminal
                    });
                    res.json({ success: true, message: 'Please check your e-mail for password reset link' }); // Return success message
                }
            });
        }
    });
}

module.exports = {
    forgotPassword : forgotPassword
}

