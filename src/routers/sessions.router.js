const { Router } = require('express')
const { UserManager } = require('../DAO/productManagerMongo/usersManagerM')
const passport = require('passport')
const { generateToken, authToken } = require('../config/passportJWT')
const passportCall = require('../passport-JWT/passport.call')
const authorization = require('../passport-JWT/authJWT')
const router = Router()
const manager = new UserManager()

/* 
router.post('/registro', async (req, res) => {
    try {
        await manager.addUser(req.body)
        res.redirect('/views/session/login')
    } catch (error) {
        if (error) {
            res.redirect('/views/session/register')
        }
    }
}) 
*/

// router.post('/login', async (req, res) => {
//     try {
//         const logUser = await manager.loginUser(req.body)
//         req.session.user = {
//             first_name: logUser.first_name,
//             last_name: logUser.last_name,
//             age: logUser.age
//         }
//         if (logUser) {
//             if (logUser.email === 'adminCoder@coder.com') {
//                 req.session.user.rol = 'admin'
//                 return res.redirect('/views/products')
//             }
//             req.session.user.rol = 'usuario'
//             return res.redirect('/views/products')
//         }
//     } catch (error) {
//         if (error) {
//             res.status(401).redirect('/views/session/login')
//         }
//     }
// })

/* 
//passport local
router.post('/registro', passport.authenticate('register', { failureRedirect: '/views/session/register', successRedirect: '/views/session/login' }), async (req, res) => {
    try {
        res.send({
            status: 'success',
            msg: 'Registro exitoso'
        })
    } catch (error) {
        if (error) return error
    }
})
router.post('/login', passport.authenticate('login', { failureRedirect: '/views/session/login' }), async (req, res) => {
    try {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email
        }
        if (req.user.email === 'adminCoder@coder.com') {
            req.session.user.rol = 'admin'
            return res.redirect('/views/products')
        }
        req.session.user.rol = 'user'
        res.redirect('/views/products')
    } catch (error) {
        return `${error}`
    }
})
*/


//passport JWT
router.post('/registro', async (req, res) => {
    try {
        const { first_name, role, email } = await manager.addUser(req.body)
        res.status(201).send({
            status: 'success',
            user: { first_name, role, email }
        })
    } catch (error) {
        if (error) {
            res.status(409).send({
                status: 'Error',
                payload: error.message
            })
            //res.redirect('/views/session/register')
        }
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email } = req.body
        if (email === 'adminCoder@coder.com') {
            req.body.role = "admin"
            const token = generateToken(req.body)
            return res.cookie('coderCookieToken', token, {
                maxAge: 60 * 60 * 100,
                httpOnly: true
            }).send({
                status: 'success',
                message: 'Login success',
                payload: req.body
            })
        }
        const userDB = await manager.loginUser(req.body)
        //Recordar, no pasar datos sensibles como la palabra secreta o la contraseña del usuario a la hora de generar el token.
        res.cookie('coderCookieToken', userDB, {
            maxAge: 60 * 60 * 100,
            httpOnly: true//Con esta configuración evitamos que las cookies solo sean accesibles mediante peticiones http
        }).send({
            status: 'success',
            message: 'Login success'
        })
    } catch (error) {
        if (error) return res.status(401).send({
            status: 'Error',
            payload: error.message
        })
    }
})

router.get('/pruebas', authToken, async (req, res) => {
    try {
        res.send({
            payload: "autorizado"
        })
    } catch (error) {
        return error
    }
})

//passportCall es una función creada en la carpeta passport-JWT dónde pasamos la estrategia que estamos utilizando que es la encargada de manejar los errores (en caso de tener errores).
//Passportcall ya cumple con validaciones si el token viene corrupto o no viene el token del logueo.
//authorization es un middleware que valida el rol del usuario, en caso de que haya vistas dependiendo el rol del usuario.
router.get('/current', passportCall('current'), authorization('user'), async (req, res) => {
    try {
        res.send(req.user)
    } catch (error) {
        return error
    }
})


router.post('/logout', async (req, res) => {
    try {
        req.session.destroy()
        res.redirect('/views/session/login')
    } catch (error) {
        return `ERROR: ${error}`
    }

})

router.post('/restore', async (req, res) => {
    try {
        const changes = await manager.changePassword(req.body)
        if (!changes) return res.status(404).send({
            status: 'unsuccess',
            payload: 'No se efectuarion los cambios'
        })

        res.status(200).redirect('/views/session/login')
    } catch (error) {
        if (error) return error
    }
})

//github
router.get('/github', passport.authenticate('github', {
    scope: ['user: email']
}))
router.get('/githubcallback', passport.authenticate('github', {
    failureRedirect: '/views/session/login'
}), async (req, res) => {
    try {
        req.session.user = req.user
        res.redirect('/views/products')
    } catch (error) {
        if (error) return error
    }
})

module.exports = router