const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const _ = require('lodash');
const cors = require('cors')

const api = require('./routes/api');

const mongoose = require('mongoose');


const db = "mongodb+srv://admin:XtGrDmIS2tkTYwW5@ivox-qbcp4.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(db, {dbName: 'general'}, err => {
    if(err){
        console.error('Error ' + err);
    } else{
        console.log('Connected to MongoDB Atlas');
    }
});

const {makePayment, getBalance} = require('./config/ethereum')(request);


const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', api);

app.get('/',(req, res) => {
    res.send('Hello from server');
});

/*app.post('/paystack/pay', (req, res) => {
    const form = _.pick(req.body,['amount','email','full_name']);
    form.metadata = {
        full_name : form.full_name
    }
    form.amount *= 100;
    
    initializePayment(form, (error, body)=>{
        if(error){
            //handle errors
            console.log(error);
            return res.redirect('/error')
            return;
        }
        response = JSON.parse(body);
        res.redirect(response.data.authorization_url)
    });
});*/

app.post('/ethereum/balance', (req, res) => {

    const balanceData = _.pick(req.body,['account', 'network']);

    const accountBalance = getBalance(balanceData.account, balanceData.network)
   
    const response = [
        {
            'BALANCE': accountBalance
        }
    ]
    
    res.send(JSON.stringify(response));
});

app.post('/ethereum/pay', (req, res) => {

    const webhook = _.pick(req.body,['resource']);
    
    if(webhook.resource !== null){
        if(webhook.resource.parent_payment != null){
            res.send("Processing payment");

            const custom = JSON.parse(webhook.resource.custom)

            makePayment(webhook.resource.parent_payment, custom.address);
        
        } else {
            res.send("Error, no payment ID was specified");
        }
    } else {
        res.send("Error, no payment resource is specified");
    }
});

/*app.get('/receipt/:id', (req, res)=>{
    const id = req.params.id;
    Donor.findById(id).then((donor)=>{
        if(!donor){
            //handle error when the donor is not found
            res.redirect('/error')
        }
        res.render('success.pug',{donor});
    }).catch((e)=>{
        res.redirect('/error')
    })
})*/

app.listen(port, () => {
    console.log(`App running on port ${port}`)
});
