const express = require('express')
const hbs = require('express-hbs')
const { join } = require('path')
const session = require('express-session')
const morgan = require('morgan')
const helmet = require('helmet')
const mongoose = require('./configs/mongoose.js')
require('dotenv').config()

const app = express()

app.use(helmet())
app.use(morgan('common'))

// Connect to the database.
mongoose.connect().catch((error) => {
  console.error(error)
  process.exit(1)
})

app.engine(
  'hbs',
  hbs.express4({
    defaultLayout: join(__dirname, 'views', 'layouts', 'default'),
    partialsDir: join(__dirname, 'views', 'partials')
  })
)
app.set('view engine', 'hbs')
app.set('views', join(__dirname, 'views'))

app.use(express.static(join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

const sessionOptions = {
  name: 'This is another name',
  secret: 'Myabe my name?',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'lax'
  }
}

app.use(session(sessionOptions))

app.use((req, res, next) => {
  // Flash messages - survives only a round trip.
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }
  next()
})

/* ROUTES */
app.use('/', require('./routes/indexRouter'))
app.use('/register', require('./routes/registerRouter'))

// NOT FOUND
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})
