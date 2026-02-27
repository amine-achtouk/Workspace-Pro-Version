const workspaceRepository = require('../repositories/workspaceRepository')
const userRepository = require('../repositories/userRepository')
const AppError = require('../utils/AppError')

const createWorkspace = async (userId, workspaceData) =>{
    const { name } = workspaceData
    if(!name || !name.trim()) throw new AppError('Name is required', 400)

    const newWorkspace = {
        name,
        owner : userId,
        members : []
    }
    return await workspaceRepository.createWorkspace(newWorkspace)
}

const getWorkspaces = async (userId) =>{
    return await workspaceRepository.findWorkspacebyUsers(userId)
}

const updateWorkspace = async(workspaceId, updateData) =>{
    const allowedFields = ['name']
    const filteredData = Object.keys(updateData)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => ({ ...obj, [key]: updateData[key] }), {})
    if (Object.keys(filteredData).length === 0) throw new AppError('No valid fields to update', 400)

    return await workspaceRepository.updateWorkspace(workspaceId, filteredData)

}

const deleteWorkspace = async (workspaceId) =>{
    return await workspaceRepository.deleteWorkspace(workspaceId)
}


const addMembers = async (workspaceId, targetEmail) =>{
    const targetUser = await userRepository.findUserByEmail(targetEmail)
    if(!targetUser) throw new AppError('User not found', 404)


    const workspace = await workspaceRepository.findWorkspaceById(workspaceId)
    const alreadyMember = workspace.members.some(m => m.user.toString() === targetUser._id.toString())
    if(alreadyMember) throw new AppError('User is already a member', 400)

    if(workspace.owner.toString() === targetUser._id.toString()) throw new AppError('Owner is already in workspace', 400)

    workspace.members.push({ user: targetUser._id })
    return await workspace.save()
}

const removeMembers = async ( workspaceId, targetUserId) =>{
    const workspace = await workspaceRepository.findWorkspaceById(workspaceId)

    const isMember = workspace.members.some(m => m.user.toString() === targetUserId)
    if(!isMember) throw new AppError('User is not a member', 404)

    if(workspace.owner.toString() === targetUserId) throw new AppError('Cannot remove workspace owner', 400)

    workspace.members = workspace.members.filter(m => m.user.toString() !== targetUserId)
    return await workspace.save()

}

module.exports = { createWorkspace, getWorkspaces, updateWorkspace, deleteWorkspace, addMembers, removeMembers}