const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    paypal: String,
    id: String,
    network: String,
    destination: String,
    currency: String,
    date: String,
    amount: {
        type: String,
        get: function(data) {
          try { 
            return JSON.parse(data);
          } catch(err) { 
            console.log(err);
            return data;
          }
        },
        set: function(data) {
          return JSON.stringify(data);
        }
    },
    status: String
})

module.exports = mongoose.model('transaction', transactionSchema, 'transactions');