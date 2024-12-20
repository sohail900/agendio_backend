import { Router } from 'express'

import * as UserController from '../controller/user.controller'
import * as EventController from '../controller/event.controller'
import { validateData } from '../middlewares/validateData'
import { loginSchema, signUpSchema } from '../schema/userSchema'
import { authMiddleware } from '../middlewares/authMiddleware'
import { createEventSchema } from '../schema/eventSchema'

const router = Router()

// user routes
router.route('/signup').post(validateData(signUpSchema), UserController.Signup)
router.route('/login').post(validateData(loginSchema), UserController.Login)
router.route('/refresh-token').post(UserController.RefreshToken)
router.route('/logout').post(authMiddleware, UserController.Logout)

router.route('/').get(authMiddleware, (req, res) => {
    res.json({ message: 'hello' })
})

// event routes
router
    .route('/event/create')
    .post(
        authMiddleware,
        validateData(createEventSchema),
        EventController.CreateEvent
    )

export default router
