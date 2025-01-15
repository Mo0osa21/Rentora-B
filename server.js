const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const AuthRouter = require('./routes/AuthRouter')
const CategoryRouter = require('./routes/CategoryRouter')
const BookRouter = require('./routes/BookRouter')
const PropertyRouter = require('./routes/PropertyRouter')
const ReviewRouter = require('./routes/ReviewRouter')

const PORT = process.env.PORT || 3001

const db = require('./db')

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/auth', AuthRouter)
app.use('/properties', PropertyRouter)
app.use('/categories', CategoryRouter)
app.use('/books', BookRouter)
app.use('/reviews', ReviewRouter)

app.use('/', (req, res) => {
  res.send(`Connected!`)
})

app.listen(PORT, () => {
  console.log(`Running Express server on Port ${PORT} . . .`)
})
