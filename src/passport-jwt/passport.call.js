const passport = require('passport')

const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {
            const { user: currentUser } = user
            if (err) return next(err)
            if (!currentUser) return res.status(401).send({ status: 'error', error: info.message ? info.message : info.toString() })
            req.user = currentUser
            next()
        })(req, res, next)
    }
}

module.exports = passportCall