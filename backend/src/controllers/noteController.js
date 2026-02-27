const noteService = require('../services/noteService')
const catchAsync = require('../utils/catchAsync')

const createNote = catchAsync(async(req, res) =>{
    const newNote = await noteService.createNote(req.user.id,req.workspace._id, req.body)
    res.status(201).json({status: 'success',data: { note: newNote }})
})

const getNoteByWorkspace = catchAsync(async(req, res) =>{
    const notes = await noteService.getNoteByWorkspace(req.workspace._id)
    res.status(200).json({status: 'success',  data: { notes }})
})

const updateNote = catchAsync(async(req, res) =>{
    const updateNote = await noteService.updateNote(req.note._id, req.body)
    res.status(200).json({status: 'success',data: { note: updateNote }});
})

const deleteNote = catchAsync(async(req, res) =>{
    const deleteNote = await noteService.deleteNote(req.note._id)
    res.status(204).send()
})

module.exports = { createNote, getNoteByWorkspace, updateNote, deleteNote}