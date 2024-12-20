import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import AppError from '../utils/errorHandler'
const prisma = new PrismaClient()
// auth middleware
export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken) {
        return next(new AppError(401, 'Unauthorized user'))
    }
    try {
        const decode: any = jwt.verify(
            accessToken,
            process.env.JW_TOKEN as string
        )
        const user = await prisma.user.findUnique({
            where: { id: Number(decode.id) },
        })
        if (!user) next(new AppError(401, 'Unauthorized user'))
        req.id = user?.id
        req.role = user?.role
        next()
    } catch (error) {
        next(new AppError(401, 'Unauthorized user'))
    }
}
