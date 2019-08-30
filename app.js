const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const pug = require('pug');
const _ = require('lodash');
const path = require('path');

const {Donor} = require('./models/donor')

//const {initializePayment, verifyPayment} = require('./config/paystack')(request);

var paymentId = "PAY-0XL713371A312273YKE2GCNI";

const {makePayment} = require('./config/ethereum')(request);

const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public/')));
app.set('view engine', pug);

app.get('/',(req, res) => {
    res.render('index.pug');
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

app.post('/ticker/ethereum', (req, res) => {

    // check request parameters to convert to other currencies default is MXN

    const response = [
        {
            'price_mxn': 500,
            'gas_price_mxn': 25
        }
    ]
    
    res.send(JSON.stringify(response));

});

app.post('/ethereum/pay', (req, res) => {

    const webhookResource = _.pick(req.body,['resource']);
    
    if(webhookResource !== null){
        if(webhookResource.parent_payment !== null){
            res.send("Processing payment");
            makePayment(webhookResource.parent_payment);
        }
        else{
            res.send("Error, no payment ID was specified");
        }
    } else{
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

app.get('/error', (req, res)=>{
    res.render('error.pug');
})

app.listen(port, () => {
    console.log(`App running on port ${port}`)
});
