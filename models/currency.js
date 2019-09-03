const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const currencySchema = new Schema({
    name: String,
    rate: String
})

module.exports = mongoose.model('currency', currencySchema, 'currencies');