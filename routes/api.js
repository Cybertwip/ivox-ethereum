const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');

const db = "mongodb+srv://admin:XtGrDmIS2tkTYwW5@ivox-qbcp4.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(db, {dbName: 'general'}, err => {
    if(err){
        console.error('Error ' + err);
    } else{
        console.log('Connected to MongoDB Atlas');
    }
});

function verifyToken(req, res, next){
    if(!req.headers.authorization){
        res.status(401).send('Unauthorized request');
    }

    let token = req.headers.authorization.split(' ')[1];

    if(token === 'null'){
        res.status(401).send('Unauthorized request');
    }

    let payload = jwt.verify(token, 'secret');

    if(!payload){
        res.status(401).send('Unauthorized request');
    }

    req.userId = payload.subject;
    next();
}


router.get('/', (req, res)=>{
    res.send('From API route');
});

router.get('/events', verifyToken, (req, res) =>{
    let events = [

    ];

    res.json(events);
});

router.post('/register', (req, res) =>{
    let userData = req.body;

    User.findOne({email: userData.email }, function(err,obj) { 
        if(!err){
            if(!obj){
                let user = new User(userData);
                user.save((error, registeredUser)=>{
                    if(error){
                        console.log(error);
                    } else{
                        let payload = { subject: registeredUser._id };
                        let token = jwt.sign(payload, 'secret');
                        res.status(200).send({token});
                    }
                });
            } else {
                res.status(200).send({error: 'Email already exists'});        
            }
    
        } else {
            console.log(err);
            res.status(200).send({error: 'Server database error'});        
        }
    });


   

});

router.post('/login', (req, res) =>{
    let userData = req.body;

    User.findOne({email: userData.email}, (error, user) =>{
        if(error){
            console.log(error);
        } else{
            if(!user){
                res.status(401).send('Invalid email');
            } else {
                if(user.password !== userData.password){
                    res.status(401).send('Invalid password');
                } else {
                    let payload = { subject: user._id };
                    let token = jwt.sign(payload, 'secret')
                    res.status(200).send({token});
                }
            }
        }
    });
});

module.exports = router;