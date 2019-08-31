const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    password: String
})

/*const donorSchema = new mongoose.Schema({
    full_name: {
        type: String, 
        required: true,
    },
    email: {
        type: String, 
        required: true,
    },
    amount: {
        type: Number, 
        required: true,
    },
    reference: {
        type: String, 
        required: true
    }
});*/

module.exports = mongoose.model('user', userSchema, 'users');