const { Schema, model } = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const collection = 'carts'

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
        index: true
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'products'
        },
        qty: {
            type: Number,
            default: 1
        },
        _id: false
    }]
})

cartSchema.plugin(paginate)
const cartModel = model(collection, cartSchema)

module.exports = {
    cartModel
}

/*
carts:
[
    {
        _id: IDCarrito1,
        usuario: IDUser1,
        products:[
            {
                product: IDProducto1,
                qty: 9
            },
            {
                product: IDProducto2,
                qty: 1
            },
            {
                product: IDProducto3,
                qty: 69
            }
        ]
    },
    {
        _id: IDCarrito2,
        usuario: IDUser1,
        products: [
            {
                producto: IDProduct4,
                qty: 1
            }
        ]
    },
    {
        _id: IDCarrito3
    }
]
*/
//Si el usuario tiene un carrito con un producto nuevo a agregar, que lo sume.