const AppError = require('../utils/AppError')
const { verifyAccessToken } = require('../utils/jwt')

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Not authorized', 401))
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyAccessToken(token)
    if(!decoded) return next(new AppError('Invalid or expired token', 401))

    req.user = { id: decoded.id }
    next()
}

module.exports = authMiddleware