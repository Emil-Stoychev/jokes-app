const router = require('express').Router()
const { authMiddlewareStrict } = require('../Middlewares/authMiddlewareStrict')

const jokesService = require('../Services/jokesService')

router.get('/:skip/:createdAt', async (req, res) => {
    res.json(await jokesService.getAll(req.params.skip, req.params.createdAt))
})

router.get('/getAllJokesByUser/:userId/:skip', async (req, res) => {
    res.json(await jokesService.getAllByUser(req.params.userId, req.params.skip))
})

router.get('/getAllLikedJokesByUser/:userId/:skip', async (req, res) => {
    res.json(await jokesService.getAllLikedByUser(req.params.userId, req.params.skip))
})

router.get('/getJokeForEditById/:jokeId/:token', authMiddlewareStrict, async (req, res) => {
    res.json(await jokesService.getJokeForEditById(req.params.jokeId, req.params.user?._id))
})

router.post('/createJoke/:token', authMiddlewareStrict, async (req, res) => {
    let result = await jokesService.createJoke(req.body, req.params.user?._id)

    return res.status(200).json(result)
})

router.put('/likeJoke/:jokeId/:token', authMiddlewareStrict, async (req, res) => {
    let result = await jokesService.likeJoke(req.params.jokeId, req.params.user?._id)

    return res.status(200).json(result)
})

router.put('/editJoke/:jokeId/:token', authMiddlewareStrict, async (req, res) => {
    let result = await jokesService.editJoke(req.body, req.params.jokeId, req.params.user?._id)

    return res.status(200).json(result)
})

router.delete('/deleteJoke/:jokeId/:token', authMiddlewareStrict, async (req, res) => {
    let result = await jokesService.deleteJoke(req.params.jokeId, req.params.user._id)

    return res.status(200).json(result)
})


module.exports = router
