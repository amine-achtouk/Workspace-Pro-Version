const express = require('express')
const router = express.Router()
const { refreshToken, registerUser, loginUser } = require('../controllers/userController')
const { registerSchema, loginSchema } = require('../validations/userValidation')
const valid = require('../middlewares/validate')
const { authLimiter } = require('../config/rateLimit')


router.post('/register',authLimiter, valid(registerSchema), registerUser)
router.post('/login',authLimiter, valid(loginSchema), loginUser)
router.post('/refresh', refreshToken)

module.exports = router