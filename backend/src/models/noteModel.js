const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    title : {type : String, required : true},
    content : {type : String, required : true},
    workspace : {type : mongoose.Schema.Types.ObjectId, ref : 'Workspace', required : true},
    createdBy : {type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true},
    isPinned : {type : Boolean, default : false}
}, { timestamps : true})

module.exports = mongoose.model('Note', noteSchema)