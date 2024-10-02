import { Router } from 'express'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
import { randomBytes } from 'crypto'

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const movies = require('../movies.json')

export const moviesRouter = Router()

moviesRouter.get('/', (req, res) => {
  const { genre } = req.query

  if (genre) {
    const filteredMovies = movies.filter((movie) => {
      return movie.genre.toLowerCase() === genre.toLowerCase()
    })

    res.json({ data: filteredMovies })
    return
  }

  // Return all movies if no genre is specified
  res.json({ data: movies })
})

moviesRouter.get('/:id', (req, res) => {
  const id = req.params.id

  const movie = movies.find((movies) => {
    return movies.id === parseInt(id)
  })

  if (!movie) {
    res.status(404).json({ error: 'Movie not found' })
  } else {
    res.json({ data: movie })
  }
})

moviesRouter.post('/', (req, res) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: 'something real bad happened' })
  }

  const newMovie = {
    id: randomBytes(16).toString('hex'),
    ...result.data
  }

  movies.push(newMovie)

  res.status(201).json({ data: newMovie })
})

moviesRouter.patch('/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res
      .status(400)
      .json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params

  const movieIndex = movies.findIndex((movie) => movie.id === Number(id))
  console.log('movieIndex', movieIndex)

  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updatedMovie

  return res.json({ updatedMovie })
})

moviesRouter.delete('/:id', (req, res) => {
  const { id } = req.params

  const movieIndex = movies.findIndex((movie) => movie.id === Number(id))

  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ data: movies })
})
