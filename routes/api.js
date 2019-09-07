const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');
const Currency = require('../models/currency');
const Transaction = require('../models/transaction');

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

router.get('/gas/get', (req, res) =>{
    const response = [
        {
            type: 'low',
            price: 25,
            description: 'The slowest gas option'
        }
    ]
    
    res.send(JSON.stringify(response));
});

router.post('/gas/set', verifyToken, (req, res) =>{
    const response = [
        {
            type: 'low',
            price: 25,
            description: 'The slowest gas option'
        }
    ]
    
    res.send(JSON.stringify(response));
});

router.get('/transaction/get', verifyToken, (req, res) =>{
    
    Transaction.find({}, function(error, transactions){
        if(error){
            console.log(error);
            res.status(500).send({error: 'Server database error'});        
        } else {
            let transactionMap = [];

            transactions.forEach(function(transaction){
                transactionMap.push({   
                                        paypal: transaction.paypal,
                                        id: transaction.id,
                                        network: transaction.network,
                                        destination: transaction.destination, 
                                        currency: transaction.currency,
                                        amount: transaction.amount,
                                        status: transaction.status,
                                        description: transaction.description });
            });

            res.status(200).send(transactionMap);    
        }
    });

});

router.post('/balance/get', (req, res) =>{
    let balanceData = req.body;

    Transaction.find({destination: balanceData.destination}, function(error, transactions){
        if(error){
            console.log(error);
            res.status(500).send({error: 'Server database error'});        
        } else {
            let transactionMap = [];

            transactions.forEach(function(transaction){
                transactionMap.push({   paypal: transaction.paypal,
                                        currency: transaction.currency,
                                        eth: transaction.amount.eth,
                                        total: transaction.amount.currency });
            });

            res.status(200).send(transactionMap);    
        }
    });

});

router.post('/currency/get', (req, res) =>{
    let currencyFilter = req.body;

    if(currencyFilter.tag === 'all'){
        Currency.find({}, function(error, currencies){
            if(error){
                console.log(error);
                res.status(500).send({error: 'Server database error'});        
            } else {
                let currencyMap = [];
    
                currencies.forEach(function(currency){
                    currencyMap.push({  name: currency.name, 
                                        rate: currency.rate });
                });
    
                res.status(200).send(currencyMap);    
            }
        });
    } else if(currencyFilter.tag) {
        Currency.find({name: currencyFilter.tag}, function(error, currencies){
            if(error){
                console.log(error);
                res.status(500).send({error: 'Server database error'});        
            } else {
                let currencyMap = [];
    
                currencies.forEach(function(currency){
                    currencyMap.push({  name: currency.name, 
                                        rate: currency.rate });
                });
    
                res.status(200).send(currencyMap);    
            }
        });
    } else {
        res.status(400).send({error: 'No currency was specified'});        
    }
});

router.post('/currency/add', verifyToken, (req, res) =>{
    let currencyData = req.body;

    Currency.findOne({name: currencyData.name }, function(err,obj) { 
        if(!err){
            if(!obj){
                let currency = new Currency(currencyData);
                currency.save((error, registeredCurrency)=>{
                    if(error){
                        console.log(error);
                        res.status(500).send({error: 'Server database error'});        
                    } else{
                        Currency.find({}, function(error, currencies){
                            if(error){
                                console.log(error);
                                res.status(500).send({error: 'Server database error'});        
                            } else {
                                let currencyMap = [];

                                currencies.forEach(function(currency){
                                    currencyMap.push({  name: currency.name, 
                                                        rate: currency.rate });
                                });
    
                                res.status(200).send(currencyMap);    
                            }
                        });
                    }
                });
            } else {
                res.status(400).send({error: 'Currency already exists'});        
            }
    
        } else {
            console.log(err);
            res.status(500).send({error: 'Server database error'});        
        }
    });

});

router.post('/currency/edit', verifyToken, (req, res) =>{
    let currencyData = req.body;

    Currency.findOne({name: currencyData.name }, function(err,obj) { 
        if(!err){
            if(obj){
                obj.name = currencyData.name;
                obj.rate = currencyData.rate;

                obj.save((error, registeredCurrency)=>{
                    if(error){
                        console.log(error);
                        res.status(500).send({error: 'Server database error'});        
                    } else{
                        Currency.find({}, function(error, currencies){
                            if(error){
                                console.log(error);
                                res.status(500).send({error: 'Server database error'});        
                            } else {
                                let currencyMap = [];

                                currencies.forEach(function(currency){
                                    currencyMap.push({  name: currency.name, 
                                                        rate: currency.rate });
                                });
    
                                res.status(200).send(currencyMap);    
                            }
                        });
                    }
                });
            } else {
                res.status(400).send({error: 'Currency does not exist'});        
            }
    
        } else {
            console.log(err);
            res.status(500).send({error: 'Server database error'});        
        }
    });
});

router.post('/currency/delete', verifyToken, (req, res) =>{
    let currencyData = req.body;

    Currency.findOneAndDelete({name: currencyData.name }, function(err,obj) { 
        if(!err){

            Currency.find({}, function(error, currencies){
                if(error){
                    console.log(error);
                    res.status(500).send({error: 'Server database error'});        
                } else {
                    let currencyMap = [];

                    currencies.forEach(function(currency){
                        currencyMap.push({  name: currency.name, 
                                            rate: currency.rate });
                    });

                    res.status(200).send(currencyMap);    
                }
            });
        } else {
            console.log(err);
            res.status(500).send({error: 'Server database error'});        
        }
    });
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
                        res.status(500).send({error: 'Server database error'});        
                    } else{
                        let payload = { subject: registeredUser._id };
                        let token = jwt.sign(payload, 'secret');
                        res.status(200).send({token});
                    }
                });
            } else {
                res.status(400).send({error: 'Email already exists'});        
            }
    
        } else {
            console.log(err);
            res.status(500).send({error: 'Server database error'});        
        }
    });
});

router.post('/login', (req, res) =>{
    let userData = req.body;

    User.findOne({email: userData.email}, (error, user) =>{
        if(error){
            console.log(error);
            res.status(500).send('Server database error');        
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