//Importaciones
const express = require('express')
const hbs = require('express-handlebars')
const { Server } = require('socket.io')
const { create } = require('connect-mongo')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const main = require('./routers/routes.js')
const { webSocket } = require('./utils/socketIo.js')
const { connectDB } = require('./config/DBConfig.js')
const { initPassportMidd, initPassGitHub } = require('./config/passportConfig.js')
const passport = require('passport')
const { initPassport } = require('./passport-JWT/passport.config.js')

//instanciaciones
const app = express()
connectDB()
initPassportMidd()
initPassGitHub()

//Configuraciones
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', hbs.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')
app.use('/static', express.static(`${__dirname}/public`))
app.use(cookieParser('Mensaje secreto'))
//trabajando con JWT session no se utiliza
app.use(session({
    store: create({
        mongoUrl: 'mongodb://127.0.0.1:27017/ecommerce',
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    secret: 'Mensaje secreto 2',
    resave: false,
    saveUninitialized: false
}))
//SI SE USA JWT, NO USAR SESSION
initPassport()
passport.use(passport.initialize())
passport.use(passport.session())

//routers
app.use(main)
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send("Todo mal")
})

//launcher del server
const httpServer = app.listen(8080, (err) => {
    if (err)`ERROR en el servidor ${err}`
    console.log("Se inició el servidor.")
})

//utilización de sockets
const io = new Server(httpServer)
webSocket(io)