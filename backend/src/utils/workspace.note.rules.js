const isWorkspaceOwner = (userId, workspace) =>{
    return workspace.owner.toString() === userId
}

const isWorkspaceMember = (userId, workspace) =>{
    const isOwner = isWorkspaceOwner(userId, workspace)
    const isMember = workspace.members.some(member => member.user.toString() === userId)

    return isOwner || isMember
}

const isNoteCreator = (userId,note) =>{
    return note.createdBy.toString() === userId
}

module.exports = { isWorkspaceOwner, isWorkspaceMember, isNoteCreator}