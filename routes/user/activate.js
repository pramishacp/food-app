"use strict";

//Grab the packages we need
const mongoose = require('mongoose');
const  jwt = require('jsonwebtoken'); 
const nodemailer = require('nodemailer');
const  sgTransport = require('nodemailer-sendgrid-transport');

const secret = 'thesecret';    // Create custom secret for use in JWT

//Grab the model we need
let User = mongoose.model('User');

// create a user (accessed at POST http://localhost:3000/api/users)
let activate = function(req, res){

    
    // let temporaryToken = req.params.token;
    
    // create a new instance of the User model
    

    const options = {
        auth: {
          api_user: 'your api user',
          api_key: 'your api key'
        }
    }
      
    const client = nodemailer.createTransport(sgTransport(options));
   


    User.findOne({temporaryToken: req.params.token},function(err,user) {
        console.log("user",user);
        //Throw error if cannot login
        if(err) { 
            console.log(err);
        }

        //Save token from the URL for verification
        const token = req.params.token;
       
        //Function to verify the user's token
        jwt.verify(token, secret, function(err, decoded){
            // if(err) {
            //    // Token is expired
            //    res.json({ success: false, message: 'Activation link has expired'})
            // } else if(!user) {
            //    // Token may be valid but does not match any user in the database
            //    res.json({ success: false, message: 'Activation link has expired'})
            // } else {
             user.temporaryToken = false; // Remove temporary token
             user.active = true; // Change account status to Activated

                user.save(function(err) {
                    if(err) {
                        console.log(err); // If unable to save user, log error
                    } else {
                        // If save succeeds, create e-mail object
                        const email = {
                            from : 'Pramisha C P, pramishacp123@gmail.com',
                            to: user.username,
                            subject: 'Food Devlivery App Account Activated',
                            text: 'Hello' + user.username +', Your account has beed successfully activated!',
                            html: 'Hello<strong> ' + user.username + '</strong>,<br><br>Your account has been successfully activated!',  
                        }
                        client.sendMail(email, function(err, info) {
                            if (err) console.log(err); // If unable to send e-mail, log error info to console/terminal
                        });
                        res.json({ success: true, message: 'Account activated!' }); // Return success message to controller
                    }
                })
            // }
        })
    })  

}

module.exports = {
    activate : activate
}

