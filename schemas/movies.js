const zod = require('zod')

const movieSchema = zod.object({
  title: zod.string({
    invalid_type_error: 'Title must be a string'
  }),
  director: zod.string(),
  year: zod.number().positive().int(),
  //  rate: zod.number().positive().int().optional(),
  genre: zod.string()
})

function validateMovie (movieObject) {
  return movieSchema.safeParse(movieObject)
}

const validatePartialMovie = (movieObject) => {
  return movieSchema.partial().safeParse(movieObject)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}
