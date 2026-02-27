const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middlewares/errorHandler')
const { apiLimiter } = require('./config/rateLimit')


const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

const userRoute = require('./routes/userRoute')
const workspaceRoute = require('./routes/workspaceRoute')
const noteRoute = require('./routes/noteRoute')

app.use('/api', apiLimiter)
app.use('/api/users', userRoute)
app.use('/api/workspaces', workspaceRoute)
app.use('/api/notes', noteRoute)

app.use(errorHandler)

module.exports = app