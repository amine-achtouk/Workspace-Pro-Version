const User = require('../models/userModel')

const createUser = (userData) =>{
    return User.create(userData);
}

const findUserByEmail = (email) => {
    return User.findOne({ email })
}

const findUserByEmailWithPassword = (email) => {
    return User.findOne({ email }).select('+password')
};

const findById = (userId) => {
    return User.findById(userId)
}


module.exports = { createUser,findUserByEmail ,findUserByEmailWithPassword, findById}