import type { NextFunction, Request, Response } from 'express'
import { PrismaClient } from '../../node_modules/@prisma/client'
const prisma = new PrismaClient()
const Signup = (req: Request, resp: Response, next: NextFunction) => {
    const { name, email, password } = req.body
    // check if email already exists or not
}
const Login = (req: Request, resp: Response, next: NextFunction) => {
    resp.status(200).json({ message: 'Login successful' })
}

const UserController = {
    Login,
    Signup,
}
export default UserController
