'use strict'

const Tournament = use('App/Models/Tournament')
const { validateAll } = use('Validator')

/**
 * Resourceful controller for interacting with tournaments
 */
class TournamentController {
  /**
   * Show a list of all tournaments.
   * GET tournaments
   */
  async index ({ request, response }) {
    const { page, limit } = request.get()

    if (limit && (!/^\d+$/.test(limit) || (limit < 1 || limit > 20))) return response.status(400).json({ message: 'Limit deve ser um número maior que 0 e menor que 20' })
    else if (page && (!/^\d+$/.test(page) || page < 1)) return response.status(400).json({ message: 'Page deve ser um número maior que 0' })

    const tournaments = await Tournament.query().paginate(page || 1, limit || 20)
    return response.json(tournaments)
  }

  /**
   * Create/save a new tournament.
   * POST tournaments
   */
  async store ({ request, response }) {
    const data = request.only(['name', 'ended_at'])
    
    const validation = await validateAll(data, {
      name: 'required',
      ended_at: 'required'
    })

    if (validation.fails())
      return response.status(400).json(validation.messages())
    
    const tournament = await Tournament.create(data)
    return response.status(201).json(tournament)
  }

  /**
   * Display a single tournament.
   * GET tournaments/:id
   */
  async show ({ params, response }) {
    const tournament = await Tournament.find(params.id)
    if (!tournament) return response.status(404).json({ message: `Torneio com id ${params.id} não encontrado`})
    return response.json(tournament)
  }

  /**
   * Update tournament details.
   * PUT or PATCH tournaments/:id
   */
  async update ({ params, request, response }) {
    const data = request.only(['name', 'ended_at'])
    
    const validation = await validateAll(data, {
      name: 'required',
      ended_at: 'required'
    })

    if (validation.fails())
      return response.status(400).json(validation.messages())
    
    const tournament = await Tournament.find(params.id)
    if (!tournament) return response.status(404).json({ message: `Torneio com id ${params.id} não encontrado`})

    tournament.merge(data)
    await tournament.save()

    return response.json(tournament)
  }

  /**
   * Delete a tournament with id.
   * DELETE tournaments/:id
   */
  async destroy ({ params, response }) {
    const tournament = await Tournament.find(params.id)
    if (!tournament) return response.status(404).json({ message: `Torneio com id ${params.id} não encontrado`})
    
    await tournament.delete()
    return response.json({ message: 'Torneio excluído com sucesso' })
  }
}

module.exports = TournamentController
