'use strict'

const Match = use('App/Models/Match')
const { validateAll } = use('Validator')

/**
 * Resourceful controller for interacting with matches
 */
class MatchController {
  /**
   * Show a list of all matches.
   * GET matches
   */
  async index ({ request, response }) {
    const { page, limit, tournament_id } = request.get()

    if (limit && (!/^\d+$/.test(limit) || (limit < 1 || limit > 20))) return response.status(400).json({ message: 'Limit deve ser um número maior que 0 e menor que 20' })
    else if (page && (!/^\d+$/.test(page) || page < 1)) return response.status(400).json({ message: 'Page deve ser um número maior que 0' })

    const query = await Match.query()

    if (tournament_id) query.where('tournament_id', tournament_id)

    return await query.paginate(page || 1, limit || 20)
  }

  /**
   * Create/save a new match.
   * POST matches
   */
  async store ({ request, response }) {
    const data = request.only(['tournament_id', 'winner_id', 'loser_id'])
    
    const validation = await validateAll(data, {
      tournament_id: 'required|exists:tournaments,id',
      winner_id: 'required|exists:users,id',
      loser_id: 'required|exists:users,id'
    })

    if (validation.fails())
      return response.status(400).json(validation.messages())
    
    const match = await Match.create(data)
    return response.status(201).json(match)
  }

  /**
   * Display a single match.
   * GET matches/:id
   */
  async show ({ params, response }) {
    const match = await Match.find(params.id)
    if (!match) return response.status(404).json({ message: `Partida com id ${params.id} não encontrada`})
    return response.json(match)
  }

  /**
   * Update match details.
   * PUT or PATCH matches/:id
   */
  async update ({ params, request, response }) {
    const data = request.only(['tournament_id', 'winner_id', 'loser_id'])
    
    const validation = await validateAll(data, {
      tournament_id: 'exists:tournaments,id',
      winner_id: 'exists:users,id',
      loser_id: 'exists:users,id'
    })

    if (validation.fails())
      return response.status(400).json(validation.messages())
    
    const match = await Match.find(params.id)
    if (!match) return response.status(404).json({ message: `Partida com id ${params.id} não encontrada`})

    match.merge(data)
    await match.save()

    return response.json(match)
  }

  /**
   * Delete a match with id.
   * DELETE matches/:id
   */
  async destroy ({ params, response }) {
    const match = await Match.find(params.id)
    if (!match) return response.status(404).json({ message: `Partida com id ${params.id} não encontrada`})
    
    await match.delete()
    return response.json({ message: 'Partida excluída com sucesso' })
  }
}

module.exports = MatchController
