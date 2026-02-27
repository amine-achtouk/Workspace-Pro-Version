const express = require('express')
const router = express.Router()
const { createNote, getNoteByWorkspace, updateNote, deleteNote } = require('../controllers/noteController')
const userMiddleware = require('../middlewares/userMiddleware')
const { requireWorkspaceMember, ensureNotePermission } = require('../middlewares/permissions')
const valid = require('../middlewares/validate')
const { createNoteSchema, updateNoteSchema } = require('../validations/noteValidation')

router.use(userMiddleware)

router.get('/:workspaceId', requireWorkspaceMember, getNoteByWorkspace)
router.post('/:workspaceId', requireWorkspaceMember,valid(createNoteSchema), createNote)
router.patch('/:workspaceId/notes/:noteId', requireWorkspaceMember, ensureNotePermission,valid(updateNoteSchema), updateNote)
router.delete('/:workspaceId/notes/:noteId', requireWorkspaceMember, ensureNotePermission, deleteNote)

module.exports = router