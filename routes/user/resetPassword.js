"use strict";

//Grab the packages we need
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); 


const secret = 'the key';    // Create custom secret for use in JWT

//Grab the model we need
const User = mongoose.model('User');

// create a user (accessed at POST http://localhost:3000/api/users)
let resetPassword  = function(req, res){

    // End Sendgrid Configuration Settings	
    User.findOne({ resettoken: req.params.token }).select().exec(function(err, user) {
        if (err) throw err; // Throw err if cannot connect
        
        var token = req.params.token; // Save user's token from parameters to variable
        // Function to verify token
        
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                res.json({ success: false, message: 'Password link has expired' }); // Token has expired or is invalid
            } else {
                if (!user) {
                    res.json({ success: false, message: 'Password link has expired' }); // Token is valid but not no user has that token anymore
                } else {
                    res.json({ success: true, user: user }); // Return user object to controller
                }
            }
        });
    });
}

module.exports = {
    resetPassword : resetPassword
}

