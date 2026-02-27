const Note = require('../models/noteModel')

const createNote = (noteData) =>{
    return Note.create(noteData)
}

const findNoteByWorkspace = (workspaceId) =>{
    return Note.find({ workspace : workspaceId})
}

const findNoteById = (noteId) =>{
    return Note.findById(noteId)
}

const updateNote = (noteId, updateData) =>{
    return Note.findByIdAndUpdate(noteId, updateData, {
        returnDocument: 'after',
        runValidators: true
    })
}

const deleteNote = (noteId) =>{
    return Note.findByIdAndDelete(noteId)
}

module.exports = { createNote, findNoteByWorkspace, findNoteById, updateNote, deleteNote}