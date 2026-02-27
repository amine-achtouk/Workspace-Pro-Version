const workspaceService = require('../services/workspaceService')
const catchAsync = require('../utils/catchAsync')

const createWorkspace = catchAsync(async (req, res) =>{
    const newWorkspace = await workspaceService.createWorkspace(req.user.id, req.body)
    res.status(201).json({ status : 'success', data : { workspace : newWorkspace}})
})

const getWorkspaces = catchAsync(async( req, res) =>{
    const workspaces = await workspaceService.getWorkspaces(req.user.id)
    res.status(200).json({status: 'success',  data: { workspaces }})
})

const updateWorkspace = catchAsync(async( req, res) =>{
    const updateWorkspace = await workspaceService.updateWorkspace(req.workspace._id, req.body)
    res.status(200).json({status: 'success',data: { workspace: updateWorkspace }})
})

const deleteWorkspace = catchAsync(async( req, res) =>{
    const deleteWorkspace = await workspaceService.deleteWorkspace(req.workspace._id)
    res.status(204).send()
})

const addMembers = catchAsync(async (req, res) => {
    const updatedWorkspace = await workspaceService.addMembers(req.workspace._id, req.body.email)
    res.status(200).json({ message: 'Member added successfully', data: { workspace: updatedWorkspace } })
})

const removeMembers = catchAsync(async (req, res) =>{
    const updatedWorkspace  = await workspaceService.removeMembers(req.workspace._id, req.params.memberId)
    res.status(200).json({ message: 'Member removed successfully', data: { workspace: updatedWorkspace } })
})

module.exports = { createWorkspace, getWorkspaces, updateWorkspace, deleteWorkspace, addMembers, removeMembers}