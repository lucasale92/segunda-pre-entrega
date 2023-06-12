const { Schema, model } = require('mongoose')

const collection = 'usuarios'

const usersSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        index: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cartID: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        default: 'user'
    },
    age: Number,
    password: String
})

const userModel = model(collection, usersSchema)

module.exports = {
    userModel
}