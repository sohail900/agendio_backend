import type { Request, Response, NextFunction } from 'express'
export const errorMiddleware = (
    err: { message: string; statusCode: number },
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.message = err.message || 'Server failed to respond'
    err.statusCode = err.statusCode || 500
    res.status(err.statusCode).json({ success: false, message: err.message })
}
