const { Router } = require('express')
const router = Router()
const mongoManager = require('../DAO/productManagerMongo/productMMongo.js')
const { auth } = require('../middleware/auth.js')
const Manager = require('../DAO/productManagerMongo/cartManagerM.js')

//const { ProductManager } = require('../DAO/productsManager/proManJSON.js')
//const path = './src/DAO/productsManager/data.json'
//const Manager = new ProductManager(path)

/*Cambiar el auth por el autenticador de JWT*/
router.get('/products', auth, async (req, res) => {
    try {
        const { first_name, last_name, rol } = req.session.user
        let { docs } = await mongoManager.getProduct({})
        const object = {
            title: "Tienda Online",
            docs,
            style: "home.css",
            first_name,
            last_name,
            rol
        }
        res.render('home', object)
    } catch (error) {
        return res.status(500).send(error)
    }
})

/*Cambiat auth por el autenticador de JWT*/
router.get('/products/:pid', auth, async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/views/session/login')
        }
        const product = await mongoManager.getProduct(req.params)
        const object = {
            pageTitle: "producto",
            product,
            style: "home.css",
            script: "viewProducts.js"
        }
        res.status(200).render('productViews', object)
    } catch (error) {
        return res.status(400).send({
            status: `ERROR`,
            error
        })
    }
})

router.get('/carts/:cid', async (req, res) => {
    try {
        const { docs } = await Manager.getCarts(req.params)
        const [cart] = docs
        const viewCart = {
            pageTitle: `Carrito #${req.params.cid}`,
            renderCart: cart.products
        }
        res.render('cartView', viewCart)
    } catch (error) {
        return `ERROR: ${error}`
    }
})

router.get('/session', auth, async (req, res) => {
    try {
        const renderSessionObj = {
            pageTitle: 'Sessions',
            script: 'sessions.js',
            style: 'sessions.css'
        }
        if (!req.session.user) {
            renderSessionObj.showLogin = true
            return res.render('session', renderSessionObj)
        }
        renderSessionObj.showLogin = false
        res.render('session', renderSessionObj)
    } catch (error) {
        if (error) {
            res.status(400).send({
                status: 'Error',
                payload: error
            })
        }
    }
})

/*
passport-local 
router.get('/session/register', async (req, res) => {
    try {
        const renderRegisterObj = {
            title: 'registro',
            script: 'sessions.js',
            style: 'sessions.css'
        }
        if (req.session.user) {
            return res.redirect('/views/products')
        }
        res.status(200).render('register', renderRegisterObj)
    } catch (error) {
        return error.message
    }
}) 
*/

//jwt
router.get('/session/register', async (req, res) => {
    try {
        const renderRegisterObj = {
            title: 'registro',
            script: 'sessions.js',
            style: 'sessions.css'
        }
        res.status(200).render('register', renderRegisterObj)
    } catch (error) {
        return error.message
    }
})
router.get('/session/login', (req, res) => {
    const renderLoginObj = {
        title: 'Login',
        script: 'sessions.js',
        style: 'sessions.css'
    }
    res.status(200).render('login', renderLoginObj)
})

router.get('/session/perfil', auth, (req, res) => {
    const { first_name, last_name, age } = req.session.user
    const renderProfileObj = {
        title: 'Perfil',
        script: 'sessions.js',
        style: 'sessions.css',
        first_name,
        last_name,
        age
    }
    res.status(200).render('perfil', renderProfileObj)
})

router.get('/session/restorepass', async (req, res) => {
    try {
        const renderRestorePass = {
            title: 'Restaurar contraseña',
            script: 'sessions.js',
            style: 'sessions.css',
        }
        res.status(200).render('restore', renderRestorePass)
    } catch (error) {
        if (error) {
            return error
        }
    }
})

//Pruebas de JWT desde el localstorage.
router.get('/test', async (req, res) => {
    try {
        const renderLogin = {
            title: 'titulo',
            script: 'viewProducts.js',
            style: 'products.css'
        }
        res.render('perfil', renderLogin)
    } catch (error) {
        if (error) return error.message
    }
})

module.exports = router