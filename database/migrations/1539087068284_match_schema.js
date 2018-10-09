'use strict'

const Schema = use('Schema')

class MatchSchema extends Schema {
  up () {
    this.create('matches', (table) => {
      table.increments()
      table.integer('tournament_id').unsigned().references('id').inTable('tournaments').onDelete('cascade')
      table.integer('winner_id').unsigned().references('id').inTable('users').onDelete('cascade')
      table.integer('loser_id').unsigned().references('id').inTable('users').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('matches')
  }
}

module.exports = MatchSchema
