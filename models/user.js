const mongoose = require("mongoose");

const User = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    birthdate:{
        type: Date,
        required: [true, 'Password is required']
    }
});

module.exports = mongoose.model("User", User);