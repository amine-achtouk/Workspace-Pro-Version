const noteRepository = require('../repositories/noteRepository')
const AppError = require('../utils/AppError')

const createNote = async(userId, workspaceId, noteData) =>{
    const { title, content } = noteData
    if(!title || !title.trim() || !content || !content.trim()) throw new AppError('Title and content is required', 400)

    const newNote = {
        title,
        content,
        createdBy : userId,
        workspace: workspaceId
    }
    return await noteRepository.createNote(newNote)

}

const getNoteByWorkspace = async (workspaceId) =>{
    return await noteRepository.findNoteByWorkspace(workspaceId)
}

const updateNote = async (noteId, updateData) =>{
    const allowedFields = ['title', 'content', 'isPinned']
    const filteredData = Object.keys(updateData)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => ({ ...obj, [key]: updateData[key] }), {})
    if (Object.keys(filteredData).length === 0) {
    throw new AppError('No valid fields to update', 400)
    }

    return await noteRepository.updateNote(noteId, filteredData)
}


const deleteNote = async (noteId) =>{
    return await noteRepository.deleteNote(noteId)
}

module.exports = { createNote, getNoteByWorkspace, updateNote, deleteNote}