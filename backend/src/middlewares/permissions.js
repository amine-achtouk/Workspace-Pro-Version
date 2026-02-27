const { isWorkspaceOwner, isWorkspaceMember, isNoteCreator} = require('../utils/workspace.note.rules')
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')
const workspaceRepository = require('../repositories/workspaceRepository')
const noteRepository = require('../repositories/noteRepository')

const requireWorkspaceMember = catchAsync(async (req, res, next) =>{
    const workspaceId = req.params.workspaceId
    const userId = req.user.id

    const workspace = await workspaceRepository.findWorkspaceById(workspaceId)
    if(!workspace) throw new AppError('Workspace not found', 404)

    if(!isWorkspaceMember(userId, workspace)) throw new AppError('Access denied', 403)
    req.workspace = workspace
    next()
})

const requireWorkspaceOwner = catchAsync(async (req, res, next) =>{
    const workspace = req.workspace
    const userId = req.user.id
    if(!isWorkspaceOwner(userId, workspace)) throw new AppError('Access denied', 403)
    next()
})

const ensureNotePermission = catchAsync(async ( req, res, next) =>{
    const noteId = req.params.noteId
    const userId = req.user.id
    const workspace = req.workspace

    const note = await noteRepository.findNoteById(noteId)
    if(!note) throw new AppError('Note not found', 403)

    if(note.workspace.toString() !== workspace._id.toString()) throw new AppError('This note does not belong to the specified workspace', 400)

    const isOwner = isWorkspaceOwner(userId, workspace);
    const isCreator = isNoteCreator(userId, note);

    if(!isOwner && !isCreator ) throw new AppError('Permission denied', 403)

    req.note = note
    next()
})

module.exports = { requireWorkspaceMember, requireWorkspaceOwner, ensureNotePermission}