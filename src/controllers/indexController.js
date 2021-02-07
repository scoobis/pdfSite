const controller = {}

controller.index = async (req, res, next) => {
  try {
    res.render('index')
  } catch (err) {
    next(err)
  }
}

module.exports = controller
