const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gasSchema = new Schema({
    type: String,
    price: String,
    description: String
})

module.exports = mongoose.model('gas', gasSchema, 'prices');