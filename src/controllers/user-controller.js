import userService from '../services/user-service'
import { validationResult } from 'express-validator'
import ApiError from '../exceptions/api-error.js'

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw ApiError.BadRequest('Ошибка при валидации', errors.array())
      }
      const { name, phone, email, password } = req.body
      const user = await userService.registration(name, phone, email, password)
      res.cookie('refreshToken', user.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

      return res.json(user)
    } catch (e) {
      next(e)
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const user = await userService.login(email, password)
      res.cookie('refreshToken', user.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }).json(user)
      next(false)
    } catch (e) {
      next(e)
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken').json(token)

      next(false)
    } catch (e) {
      next(e)
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link
      await userService.activate(activationLink)
      res.redirect(process.env.CLIENT_URL)
      next(false)
    } catch (e) {
      next(e)
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userAndTokens = await userService.refresh(refreshToken)
      res.cookie('refreshToken', userAndTokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }).json(userAndTokens)
      next(false)
    } catch (e) {
      next(e)
    }
  }

  async getUser(req, res, next) {
    try {
      const user = await userService.getUser(req)

      res.json(user)
      next(false)
    } catch (e) {
      next(e)
    }
  }
}

export default new UserController()