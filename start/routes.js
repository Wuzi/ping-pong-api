'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'PPC API Online' }
})

/**
 * api/v1 routes
 */
Route.group(() => {
  /**
   * Tournament routes
   */
  Route.get('tournaments/lastWinner', 'TournamentController.lastWinner').middleware('auth')
  Route.get('tournaments/:id/wins', 'TournamentController.wins').middleware('auth')
  Route.get('tournaments/:id/losses', 'TournamentController.losses').middleware('auth')
  Route.resource('tournaments', 'TournamentController').apiOnly().middleware('auth')

  /**
   * Match routes
   */
  Route.resource('matches', 'MatchController').apiOnly().middleware('auth')

  /**
   * Auth routes
   */
  Route.post('login', 'AuthController.login')
  Route.post('register', 'AuthController.register')
  Route.post('logout', 'AuthController.logout').middleware('auth')
  Route.post('refreshtoken', 'AuthController.refreshToken').middleware('auth')
  
  Route.get('user', 'AuthController.getAuthenticatedUser').middleware('auth')
}).prefix('api/v1')
