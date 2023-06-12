const { Router } = require('express')
const { UserManager } = require('../DAO/productManagerMongo/usersManagerM.js')

const router = Router()
const Manager = new UserManager()

router.get('/', async (req, res) => {
    try {
        const users = await Manager.getUsers(req.query)
        res.status(400).send({
            status: 'success',
            users
        })
    } catch (error) {
        return console.log(`ERROR: ${error}`)
    }
})

router.post('/', async (req, res) => {
    try {
        const add = await Manager.addUser(req.body)

        res.status(400).send({
            status: 'success',
            add
        })
    } catch (error) {
        return console.log(`ERROR: ${error}`)
    }
})

router.put('/:uid', async (req, res) => {
    try {

        const userChanges = await Manager.updateUser(req.params, req.body)
        res.status(400).send({
            status: 'success',
            userChanges
        })
    } catch (error) {
        return console.log(`ERROR: ${error}`)
    }
})

module.exports = router