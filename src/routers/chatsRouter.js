const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {

    const rend = {
        title: "Contacto",
        script: "chat.js",
        style: "chat.css"
    }

    res.render('chat', rend)
})

module.exports = router