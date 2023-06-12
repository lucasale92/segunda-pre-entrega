const passport = require('passport')
const local = require('passport-local')
const { UserManager } = require('../DAO/productManagerMongo/usersManagerM')
const manager = new UserManager()
const GithubStrategy = require('passport-github2')
require('dotenv').config()

/*
Passport local siempre requerirá dos elementos, el username(en este caso es el email) y la password si no encuentra estos elementos, devolverá un error y no permitirá continuar con la estrategia.

Se puede cambiar el valor de username, para que lea el campo que nosotros querramos tomar como identificador.

Passport utiliza un callback llamado "done". el cual recibe 2 parametros. El primer parametro es el de los errores, si le pasamos null como error, le indicamos que no hay errores, el segundo párametro es el usuario generado, o sea que si debemos devolver el usuario sería de la siguiente manera:
    done(null, user);
También podemos colocar el parametro de usuario como false, pero indicariamos que no hay un usuario nuevo generado
    done(null, false);
Cada estrategía configurada, es un middleware, así que si queremos emplear los middleware configurados, tenemos que utilizar passport.use() para configurar diferentes middlewares/estrategías.
*/

const LocalStrategy = local.Strategy

const initPassportMidd = () => {
    //Configuración del manejador de registros de usuarios.
    //Passport recibe un nombre, el cual será el que nosotros querramos.
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,//Si esta configuración la dejamos como false, la callback siguiente, no será capaz de acceder a la request que se haga desde el formulario del front
        usernameField: 'email'//Si dejamos este valor por defecto, la callback tomará como username, el username del formulario/peticion, al configurarlo como email, le estamos diciendo que tome como username los valores del email.
    }, async (req, username, password, done) => {
        try {
            const { first_name, last_name, age } = req.body
            const newUser = {
                first_name,
                last_name,
                email: username,
                age,
                password
            }
            const addUser = await manager.addUser(newUser)

            return done(null, addUser)
        } catch (error) {
            return done(null, false)
        }


    }))

    passport.serializeUser((user, done) => {
        try {
            done(null, user._id)
        } catch (error) {
            if (error) return done(error)
        }
    })
    passport.deserializeUser(async (id, done) => {
        let user = await manager.findUser(id)
        done(null, user)
    })



    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const userData = {
                email: username,
                password
            }
            const user = await manager.loginUser(userData)
            done(null, user)
        } catch (error) {
            return done(null, false)
        }
    }))
}

const initPassGitHub = () => {
    passport.use('github', new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const createUser = await manager.addUserGithub(profile._json)
            return done(null, createUser)
        } catch (error) {
            if (error) return done(null, false)
        }
    }))

    passport.serializeUser((user, done) => {
        try {
            if (user.email === 'adminCoder@coder.com') {
                return user.rol = 'admin'
            }
            user.rol = 'user'
            done(null, user)
        } catch (error) {
            if (error) return done(error)
        }
    })
    passport.deserializeUser(async (id, done) => {
        let user = await manager.findUser(id)
        done(null, user)
    })

}

module.exports = {
    initPassportMidd,
    initPassGitHub
}