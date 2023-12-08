const router = require('express').Router()
const { authMiddlewareStrict } = require('../Middlewares/authMiddlewareStrict')

const authService = require('../Services/authService')

router.get('/getUserByToken/:token',authMiddlewareStrict, async (req, res) => {
    res.json(await authService.getUserByToken(req.params.user?._id))
})

router.post('/login', async (req, res) => {
    let result = await authService.login(req.body)

    res.json(result)
})

router.post('/register', async (req, res) => {
    let result = await authService.register(req.body)

    res.json(result)
})

router.put('/editProfile/:token', authMiddlewareStrict, async (req, res) => {
    let result = await authService.editProfile(req.body, req.params.user?._id)

    res.json(result)
})

router.put('/toggleStar/:jokeAuthor/:token', authMiddlewareStrict, async (req, res) => {
    let result = await authService.toggleStar(req.params.jokeAuthor, req.params.user?._id)

    res.json(result)
})

router.delete('/deleteAccount/:token', authMiddlewareStrict, async (req, res) => {
    let result = await authService.deleteProfile(req.params.user?._id)

    res.json(result)
})

module.exports = router