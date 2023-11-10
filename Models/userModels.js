const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter the username"],
        unique: true, // Corrected syntax for unique
    },
    email: {
        type: String,
        required: [true, "Please enter the email"],
        unique: true,
    },
    password: { // Corrected field name to 'password'
        type: String,
        required: [true, "Please enter the password"],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
