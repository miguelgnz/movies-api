const express = require('express')
const crypto = require('crypto')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')
const cors = require('cors')

const app = express()

const movies = require('./movies.json')

// remove x-powered-by header
app.disable('x-powered-by')

app.use(express.json())

app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:8080',
        'http://localhost:1234',
        'https://movies.com',
        'https://midu.dev'
      ]

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }

      if (!origin) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    }
  })
)

// Get all movies
app.get('/movies', (req, res) => {
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

// Get a single movie by id
app.get('/movies/:id', (req, res) => {
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

// Create a new movie
app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: 'something real bad happened' })
  }

  const newMovie = {
    id: crypto.randomBytes(16).toString('hex'),
    ...result.data
  }

  movies.push(newMovie)

  res.status(201).json({ data: newMovie })
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
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

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params

  const movieIndex = movies.findIndex((movie) => movie.id === Number(id))

  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ data: movies })
})

const desiredPort = process.env.PORT || 3001

app.listen(desiredPort, () => {
  console.log(`Listening on port ${desiredPort}`)
})
