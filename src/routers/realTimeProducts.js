const { Router } = require('express')
const router = Router()
const productManager = require('../DAO/productManagerMongo/productMMongo.js')

router.get('/', async (req, res) => {
    try {
        const { docs } = await productManager.getProduct({})
        const object = {
            title: "Agregar productos",
            script: "main.js",
            style: "products.css",
            docs
        }
        res.render('realtimeproducts', object)

    } catch (error) {
        return `ERROR: ${error}`
    }
})

module.exports = router