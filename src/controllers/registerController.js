const bcrypt = require('bcrypt')
const User = require('../models/user')

const controller = {}

controller.register = async (req, res, next) => {
  try {
    const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(12))

    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: password
    })
    await user.save()
    req.session.flash = { type: 'success', text: 'Registration complete!' }
    res.redirect('.')
  } catch (err) {
    if (err.message.includes('User validation failed: username: Error, expected `username` to be unique.')) {
      req.session.flash = { type: 'danger', text: err.message }
      res.redirect('/register')
    } else {
      next(err)
    }
  }
}

controller.index = async (req, res, next) => {
  try {
    res.render('register/register')
  } catch (err) {
    next(err)
  }
}

module.exports = controller
