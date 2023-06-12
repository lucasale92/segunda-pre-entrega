const { Router } = require('express')
const router = Router()
const Manager = require('../DAO/productManagerMongo/cartManagerM.js')

//crea un nuevo carrito vacio.
router.post('/', async (req, res) => {//funciona
    try {
        const test = await Manager.newCart(req.body)
        res.send({
            status: 'success',
            payload: test
        })
    } catch (error) {
        return res.status(500).send({
            status: 'Error',
            payload: error
        })
    }
})

//Trae el carrito según el ID otorgado
router.get('/:cid', async (req, res) => {//funciona
    try {
        const { docs } = await Manager.getCarts(req.params)
        const [cart] = docs

        res.status(200).send({
            status: 'success',
            payload: cart
        })
    } catch (error) {
        return res.status(404).send({
            status: 'Error',
            payload: error.message
        })
    }
})

//Agrega al carrito la cantidad de productos pasadas por Body.
router.put('/:cid', async (req, res) => {//Funciona
    try {
        const addProducts = await Manager.addProductInCart(req.body, req.params)

        res.status(200).send({
            status: 'success',
            mensaje: addProducts
        })
    } catch (error) {
        if (error) return res.status(404).send({
            status: 'Error',
            payload: error.message
        })
    }
})

//Si el carrito ya cuenta con el producto, incrementa su cantidad.
router.put('/:cid/product/:pid', async (req, res) => {//funciona
    try {
        const incQuantity = await Manager.incProducts(req.body, req.params)

        res.send({
            status: 'success',
            payload: incQuantity
        })
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            payload: error
        })
    }
})

//Elimina todos los productos del carrito seleccionado
router.delete('/:cid', async (req, res) => {//funciona
    try {

        const delCart = await Manager.clearCart(req.params)

        res.send({
            status: 'success',
            payload: delCart
        })
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            payload: error
        })
    }
})

//Elimina el producto seleccionado del carrito seleccionado
router.delete('/:cid/product/:pid', async (req, res) => {//Funciona
    try {
        const delProductFromCart = await Manager.delProduct(req.params)
        res.send({
            status: 'Eliminado correctamente',
            delProductFromCart
        })
    } catch (error) {
        return `ERROR: ${error}`
    }
})

module.exports = router