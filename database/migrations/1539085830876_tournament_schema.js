'use strict'

const Schema = use('Schema')

class TournamentSchema extends Schema {
  up () {
    this.create('tournaments', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.timestamp('ended_at')
      table.timestamps()
    })
  }

  down () {
    this.drop('tournaments')
  }
}

module.exports = TournamentSchema
