'use strict'

const Model = use('Model')

class Match extends Model {
  /**
   * Returns the object of the user
   *
   * @method winner
   *
   * @return {object}
   */
  winner () {
    return this.belongsTo('App/Models/User', 'winner_id')
  }

  /**
   * Returns the object of the user
   *
   * @method loser
   *
   * @return {object}
   */
  loser () {
    return this.belongsTo('App/Models/User', 'loser_id')
  }
}

module.exports = Match
