const express = require('express')
const router = express.Router()
const { createWorkspace, getWorkspaces, updateWorkspace, deleteWorkspace, addMembers, removeMembers} = require('../controllers/workspaceController')
const userMiddleware = require('../middlewares/userMiddleware')
const { requireWorkspaceMember, requireWorkspaceOwner} = require('../middlewares/permissions')
const valid = require('../middlewares/validate')
const { workspaceSchema } = require('../validations/workspaceValidation')

router.use(userMiddleware)

router.get('/', getWorkspaces)
router.post('/',valid(workspaceSchema), createWorkspace)
router.patch('/:workspaceId', requireWorkspaceMember ,requireWorkspaceOwner,valid(workspaceSchema), updateWorkspace)
router.delete('/:workspaceId', requireWorkspaceMember ,requireWorkspaceOwner, deleteWorkspace)

router.post('/:workspaceId/members',  requireWorkspaceMember, requireWorkspaceOwner, addMembers)
router.delete('/:workspaceId/members/:memberId',  requireWorkspaceMember, requireWorkspaceOwner, removeMembers)

module.exports = router