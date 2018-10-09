'use strict'

const User = use('App/Models/User')
const Encryption = use('Encryption')
const { validateAll } = use('Validator')

class AuthController {
  /**
   * Authenticate a user.
   * POST login
   */
  async login ({ auth, request, response }) {
    const data = request.only(['email', 'password'])

    const validation = await validateAll(data, {
      email: 'required|email',
      password: 'required'
    })

    if (validation.fails())
      return response.status(400).json(validation.messages())

    return auth.withRefreshToken().attempt(data.email, data.password)
  }

  /**
   * Register a new user.
   * POST register
   */
  async register ({ auth, request, response }) {
    const data = request.only(['name', 'email', 'password', 'password_confirmation'])

    const validation = await validateAll(data, {
      name: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required',
      password_confirmation: 'required_if:password|same:password'
    })

    if (validation.fails())
      return response.status(400).json(validation.messages())

    delete data.password_confirmation
    data.role = 'user'
    
    await User.create(data)
    return auth.withRefreshToken().attempt(data.email, data.password)
  }

  /**
   * Logout authenticated user.
   * POST logout
   */
  async logout ({ auth, request, response }) {
    try {
      const user = await auth.getUser()
      const refreshToken = request.header('x-refresh-token')
      const refreshTokenDecrypt = Encryption.decrypt(refreshToken)

      await user
        .tokens()
        .where('token', refreshTokenDecrypt)
        .update({ is_revoked: true })

      return response.json({ message: 'Logout com sucesso.' })
    } catch (error) {
      return response.json({ message: 'Você não está autenticado' })
    }
  }

  /**
   * Refreshes jwt token.
   * POST refreshtoken
   */
  async refreshToken ({ auth, request }) {
    const refreshToken = request.header('x-refresh-token')
    return auth.generateForRefreshToken(refreshToken)
  }

  /**
   * Gets the authenciated user.
   * GET user
   */
  async getAuthenticatedUser ({ auth, response }) {
    return response.json(auth.user)
  }
}

module.exports = AuthController