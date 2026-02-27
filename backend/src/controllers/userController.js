const userService = require('../services/userService')
const catchAsync = require('../utils/catchAsync')

const refreshToken = catchAsync(async( req, res) =>{
    const token = req.cookies.refreshToken
    const { accessToken } = await userService.refreshAccessToken(token)
    res.status(200).json({ success: true, data: { accessToken } })
})

const registerUser = catchAsync(async (req, res) =>{
    const { createUser, accessToken, refreshToken } = await userService.registerUser(req.body)
    res.cookie('refreshToken', refreshToken,{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.status(201).json({ success: true, data: { user: createUser ,accessToken}})
})

const loginUser = catchAsync(async (req, res) =>{
    const { accessToken, refreshToken } = await userService.loginUser(req.body)
    res.cookie('refreshToken', refreshToken,{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.status(200).json({ success: true, data: {accessToken}})
})



module.exports = { refreshToken, registerUser, loginUser }