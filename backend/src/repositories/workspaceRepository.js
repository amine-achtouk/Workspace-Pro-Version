const Workspace = require('../models/workspaceModel')

const createWorkspace = (workspaceData) =>{
    return Workspace.create(workspaceData)
}

const findWorkspaceByOwner = (userId) =>{
    return Workspace.find({ owner : userId})
}

const findWorkspacebyUsers = (userId) =>{
    return Workspace.find({ $or: [{  owner: userId}, { 'members.user': userId }]})
}

const findWorkspaceById = (workspaceId) =>{
    return Workspace.findById(workspaceId)
}

const findWorkspaceByIdAndSave = (workspace) => {
    return workspace.save()
}

const updateWorkspace = (workspaceId, updateData ) =>{
    return Workspace.findByIdAndUpdate(workspaceId, updateData, {
        returnDocument : 'after',
        runValidators : true
    })
}

const deleteWorkspace = (workspaceId) =>{
    return Workspace.findByIdAndDelete(workspaceId)
}

module.exports = { createWorkspace, findWorkspaceByOwner, findWorkspacebyUsers, findWorkspaceById, findWorkspaceByIdAndSave, updateWorkspace, deleteWorkspace}