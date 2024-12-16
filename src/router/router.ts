import { Router } from 'express'
import UserController from '../controller/UserController'
import { validateData } from '../middlewares/validateData'
import { loginSchema, signUpSchema } from '../schema/userSchema'
const router = Router()

router.route('/signup').post(validateData(signUpSchema), UserController.Signup)
router.route('/login').post(validateData(loginSchema), UserController.Login)

export default router
