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

// signup controller
export const Signup = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
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
                refreshToken: '',
            },
        })
        resp.status(201).json({ message: 'Signup successful', user })
    } catch (error: unknown | any) {
        next(new AppError(400, error.message))
    }
}
// login controller
export const Login = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
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

    const accessToken = generateToken(user.id, '5m') // access token expires in 5 min
    const refreshToken = generateToken(user.id, '1h') // refresh token expires in 1 hour
    const updateUser = await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken, updatedAt: new Date() },
    })
    resp.status(200)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .cookie('accessToken', accessToken, cookieOptions)
        .json({ message: 'Login successful', updateUser })
}
// refresh token controller
export const RefreshToken = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    const { refreshToken } = req.cookies

    // if refresh token is not present
    if (!refreshToken)
        return next(new AppError(400, 'Refresh token is required'))
    // verify refresh token
    try {
        const decoded: any = jwt.verify(
            refreshToken,
            process.env.JW_TOKEN as string
        )
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        })
        if (!user) next(new AppError(400, 'User does not exist'))
        if (user?.refreshToken !== refreshToken)
            return next(new AppError(400, 'Invalid token or token is expired'))
        const accessToken = generateToken(user!.id, '10m')
        const newRefreshToken = generateToken(user!.id, '1h')
        await prisma.user.update({
            where: { id: user?.id },
            data: { refreshToken: newRefreshToken },
        })
        resp.status(200)
            .cookie('refreshToken', refreshToken, cookieOptions)
            .cookie('accessToken', accessToken, cookieOptions)
            .json({ message: 'Refresh token successful', user })
    } catch (error: unknown | any) {
        next(new AppError(401, 'unauthorized user'))
    }
}
//
export const Logout = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    const id = req.id
    await prisma.user.update({
        where: { id: id },
        data: { refreshToken: '' },
    })
    resp.clearCookie('refreshToken', cookieOptions)
        .clearCookie('accessToken', cookieOptions)
        .status(200)
        .json({ success: true, message: 'logout successful' })
}
