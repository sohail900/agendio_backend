import type { Request, Express } from 'express'
declare global {
    namespace Express {
        interface Request {
            id?: number
            role?: string
        }
    }
}
