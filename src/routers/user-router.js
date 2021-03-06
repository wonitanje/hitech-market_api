import { Router } from 'express'
import userController from '../controllers/user-controller'
import { body } from 'express-validator'
import authMiddleware from '../middlewares/auth-middleware'

const router = new Router()

router.post('/register',
  body('email').isEmail(),
  body('phone').isMobilePhone(),
  body('password').isLength({ min: 3, max: 32 }),
  userController.registration
)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/', authMiddleware, userController.getUser)

export default router