import { ZodSchema } from 'zod'

import type { Request, Response, NextFunction } from 'express'
export const validateData =
    (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        const parsed = schema.safeParse(req.body)
        if (!parsed.success) {
            console.log(parsed?.error?.errors[0].message)
            res.status(400).json({ message: parsed?.error?.errors[0].message })
            return
        }
        next()
    }
