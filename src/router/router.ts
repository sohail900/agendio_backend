import { Router } from 'express'
import UserController from '../controller/UserController'
import { validateData } from '../middlewares/validateData'
import { signUpSchema } from '../schema/userSchema'
const router = Router()

router.route('/signup').post(validateData(signUpSchema), UserController.Signup)
export default router
