const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : { type : String, required : true , trim: true},
    email : { type : String, required : true, unique : true, index: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']},
    password : { type : String, required : true, select: false, minlength: 8},

},{ timestamps: true })

module.exports = mongoose.model('User', userSchema)