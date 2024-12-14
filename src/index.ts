import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cookieParser from 'cookie-parser'
import http from 'http'
import router from './router/router.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js'
//
const app = express()
const server = http.createServer(app)

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api/v1', router)
app.use(errorMiddleware)

// http server
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
