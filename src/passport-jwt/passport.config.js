const passport = require('passport')
const jwt = require('passport-jwt')

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const cookieExtractor = req => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies['coderCookieToken']
    }
    return token
}
const initPassport = () => {
    //Cómo passport no controla las cookies por el mismo, vamos a realizar una función que nos ayudará en este proceso.
    //Ya que el modulo session a través de es quien controlaba las cookies hay que recordar que si vamos a usar JWT no usaremos session.
    //estrategia JWT
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "PalabraJWTSecreta"//Esta palabra debe estar privada desde el .env
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))

    //estraregia current
    passport.use('current', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "PalabraJWTSecreta"
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
}


module.exports = {
    initPassport
}