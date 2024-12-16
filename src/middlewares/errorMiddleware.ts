import type { Request, Response, NextFunction } from 'express'
const errorMiddleware = (
    err: { message: string; statusCode: number },
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    err.message = err.message || 'Server failed to respond'
    err.statusCode = err.statusCode || 500
    resp.status(err.statusCode).json({ success: false, message: err.message })
}
export default errorMiddleware
