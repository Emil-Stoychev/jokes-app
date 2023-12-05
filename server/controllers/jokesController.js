const router = require('express').Router()
const { authMiddlewareStrict } = require('../Middlewares/authMiddlewareStrict')

const jokesService = require('../Services/jokesService')

router.get('/', async (req, res) => {
    res.json(await jokesService.getAll())
})

router.get('/getAllJokesByUser/:userId', async (req, res) => {
    res.json(await jokesService.getAllByUser(req.params.userId))
})

router.get('/getAllLikedJokesByUser/:userId', async (req, res) => {
    res.json(await jokesService.getAllLikedByUser(req.params.userId))
})

router.post('/createJoke/:token', authMiddlewareStrict, async (req, res) => {
    let result = await jokesService.createJoke(req.body, req.params.user?._id)

    return res.status(200).json(result)
})

router.put('/likeJoke/:jokeId/:token', authMiddlewareStrict, async (req, res) => {
    let result = await jokesService.likeJoke(req.params.jokeId, req.params.user?._id)

    return res.status(200).json(result)
})

router.delete('/deleteJoke/:jokeId/:token', authMiddlewareStrict, async (req, res) => {
    let result = await jokesService.deleteJoke(req.params.jokeId, req.params.user._id)

    return res.status(200).json(result)
})


module.exports = router
