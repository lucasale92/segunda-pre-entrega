const auth = (req, res, next) => {
    console.log(req.session);
    const { passport } = req.session
    if (!passport) {
        return res.redirect('/views/session/login')
    }
    next()
}

module.exports = {
    auth
}