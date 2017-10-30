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
let signup = function(req, res){
    console.log("hhh");
    
    let username = req.body.username;
    let password = req.body.password;
 
    let user = new User();      // create a new instance of the User model
    
    user.username = username;
    user.password = password;

    // Start Sendgrid Configuration Settings
    const options = {
        auth: {
          api_user: 'pramishacp123',
          api_key: 'pramishacp123'
        }
    }
   
    const client = nodemailer.createTransport(sgTransport(options));
    // End Sendgrid Configuration Settings
    
    // Create a token for activating account through e-mail
    user.temporaryToken = jwt.sign ({ username: user.username, email: user.email}, secret, {expiresIn : '24h'})
  
    // Check if request is valid and not empty or null
    // if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '')
    // {
    //     console.log("hai");
    //     res.json( { success: false, message : 'Ensure username, password were provided'});
    // } else {
      // Save new user to database
    user.save(function(err){
        console.log("hai")
        // if (err){
        //     console.log("hello");
        //     if(err.errors != null) {
        //         console.log("nnn")
        //         if(err.errors.username) {
        //             console.log("one");
        //               // Display error in validation (username)
        //               res.json({ success: false, message: err.errors.username.message });
        //         } else if(err.errors.password) {
        //             console.log("two");
        //               // Display error in validation (password)
        //             res.json({ success: false, message: err.errors.password.message });
        //         } else{   
        //             console.log("three");
        //                // Display any other errors with validation
        //               res.json({ success: false, message: err });
        //         }
        //     }
        //   if (err){
        //     console.log("what");
        //     // Check if duplication error exists 
        //     if( err.code == 11000) {
        //         if (err.errmsg[61] =="u"){
        //             // Display error if username already taken
        //             res.json({ success: false, message: 'That username is already taken' }); 
        //         } else {
        //             // Display any other error
        //             res.json({ success: false, message: err }); 
        //         }
        //     }
        // } else {
            // console.log("haiwewe")
            // Create e-mail object to send to user
            const email = {
                from: 'Pramisha C P, pramishacp123@gmail.com',
                to: user.username,
                subject : 'Account Activation Link',
                text: 'Hello' + user.username + ', thank you for registering at food delivery application. Please click on the following link to complete your activation: http://localhost:3000/activate/' + user.temporarytoken,
                html: 'Hello<strong>' + user.username + '</strong>,<br><br>Thank you for registering at food.com Please click on the link below to complete your activation:<br><br><a href="http://localhost:3000/activate/' + user.temporarytoken + '">http://localhost:3000/activate/</a>'
            };
            //Function to send email to the user 
            client.sendMail(email, function(err, info) {
                if(err){
                   console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            })
            res.json({ success: true, message: 'Account registered! Please check your e-mail for activation link.' }); // Send success message back to controller/request
        // }
    
    })
    // }
}

module.exports = {
    signup : signup
}

