import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()

// remove x-powered-by header
app.disable('x-powered-by')

app.use(json())

app.use(corsMiddleware())

app.use('/movies', moviesRouter)

const desiredPort = process.env.PORT || 3001

app.listen(desiredPort, () => {
  console.log(`Listening on port ${desiredPort}`)
})
