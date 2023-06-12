const { Router } = require('express')
const router = Router()
const views = require('./views.router.js')
const realtime = require('./realTimeProducts.js')
const chats = require('./chatsRouter.js')
const carts = require('./cartsRouter.js')
const users = require('./usersRouter.js')
const products = require("./product.router.js")
const session = require('./sessions.router.js')

router.use('/api/products', products)
router.use('/views', views)
router.use('/api/realtimeproducts', realtime)
router.use('/api/chat', chats)
router.use('/api/carts', carts)
router.use('/api/users', users)
router.use('/api/session', session)

module.exports = router