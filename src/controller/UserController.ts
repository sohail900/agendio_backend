import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import AppError from '../utils/errorHandler.ts'

//  prisma client
const prisma = new PrismaClient()
// generate jwt token
function generateToken(userId: number, expireIn: string) {
    return jwt.sign({ id: userId }, process.env.JW_TOKEN as string, {
        expiresIn: expireIn,
    })
}
// cookies options
const cookieOptions = {
    httpOnly: true,
    secure: true,
}

const Signup = async (req: Request, resp: Response, next: NextFunction) => {
    const { name, email, password } = req.body

    const existingUser = await prisma.user.findUnique({
        where: { email: email },
    })
    if (existingUser) {
        return next(new AppError(400, 'User already exists'))
    }
    try {
        const hashedPassword = await Bun.password.hash(password)
        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                role: 'Admin',
                refreshToken: '',
            },
        })
        resp.status(201).json({ message: 'Signup successful', user })
    } catch (error: unknown | any) {
        next(new AppError(400, error.message))
    }
}
// login controller
const Login = async (req: Request, resp: Response, next: NextFunction) => {
    const { email, password } = req.body
    // check if user is exists or not
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        return next(new AppError(400, 'User does not exist'))
    }
    const isPasswordCorrect = await Bun.password.verify(password, user.password)

    if (!isPasswordCorrect) {
        return next(new AppError(400, 'Invalid password'))
    }

    const accessToken = generateToken(user.id, '10m') // access token expires in 10 min
    const refreshToken = generateToken(user.id, '1h') // refresh token expires in 1 hour
    const updateUser = await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    })
    resp.status(200)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .cookie('accessToken', accessToken, cookieOptions)
        .json({ message: 'Login successful', updateUser })
}

const UserController = {
    Login,
    Signup,
}
export default UserController
