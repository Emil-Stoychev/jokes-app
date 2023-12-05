const router = require('express').Router()

const authController = require('./controllers/authController')
const jokesController = require('./controllers/jokesController')
const errorController = require('./controllers/errorController.js')

router.use('/users', authController)
router.use('/jokes', jokesController)

router.use('*', errorController)

module.exports = router