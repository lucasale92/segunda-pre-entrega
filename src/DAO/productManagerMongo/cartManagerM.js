const { cartModel } = require('../models/cartModel.js')

class CartManagerM {
    newCart = async (cart) => {
        try {
            //cart.user = "646d5a8109fa4a0a92c3e1d3" El user es opcional pero si se quiere colocar un user dentro del carrito descomentar esta linea
            //Crea un carrito nuevo con un array de productos vacios (de momento sin un usuario vinculado)
            return await cartModel.create(cart)
        } catch (error) {
            return `ERROR: ${error}`
        }
    }

    getCarts = async (params) => {
        try {
            const cart = await cartModel.paginate({ _id: params.cid }, {
                lean: true,
                populate: 'products.product'
            })
            if (!cart) throw new Error('El carrito no existe')
            return cart
        } catch (error) {
            throw error
        }
        //Retorna los carritos según la query que se requiera, ya sea limit, cid y si no es ninguna de las dos, por defecto trae todos los carritos
    }

    incProducts = async (body, params) => {//Crear este
        try {
            const { cid, pid } = params
            const test = await cartModel.findById(cid)

            if (!test) throw new Error('No se encontró el carrito de compras especificado')

            test.products.forEach(prod => {
                if (prod.product.toString() === pid) {
                    prod.qty += body.qty
                }
            })
            return test.save()
        } catch (error) {
            throw error.message
        }
    }

    addProductInCart = async (body, params) => {//hacer un método de inserción de objetos y otro método de actualización.
        try {
            /*---------------------------------------------------------------------
            Recibe por body un array de productos con el siguiente formato:
            [
                {"product": "645894b68e1329db2f521e21"},
                {"product":"6457285a85ea19bcda167afd"},
                {"product": "645acbe08953e77be82ce17e"}
            ]
            Y por defecto siempre tienen la cantidad de 1 a menos de que dentro del array tengan otro valor en la propiedad "qty"
            --------------------------------------------------------------------------------
            */
            //Si no trae productos, retorna un error
            const bodyKeys = Object.keys(body)
            const bodyValues = Object.values(body)
            if (bodyKeys.length === 0 || bodyValues.length === 0) throw new Error(`No hay productos que ingresar`)
            //recorrer el array de productos insertados, si un ID del producto coincide con un producto de "cartsExists", aumentar en 1 la cantidad, si no existe, lo pusheas

            //cid es el req.params que recibe el id del carrito
            const { cid } = params

            //Revisa si el carrito existe y lo trae, si no, retorna un error
            const cartExists = await cartModel.findOne({ _id: cid })

            //Si el carrito no existe, retorna el error
            if (!cartExists) throw new Error(cartExists)

            //Si el carrito está vacio, le pusheamos todo lo que contenga en body
            if (cartExists.products.length === 0) return await cartModel.updateOne({ _id: cid }, { $push: { products: body } })

            //Si no está vacio, recorremos sus elementos y si encuentra similitudes, aumenta en 1 su cantidad, si no encuentra similitudes, pushea el producto.
            body.forEach(element => {
                const finded = cartExists.products.findIndex(prod => prod.product.toString() === element.product)
                if (finded !== -1) {
                    cartExists.products[finded].qty += 1
                } else {
                    cartExists.products.push(element)
                }
            });
            //Y se guarda el producto ya actualizado.
            cartExists.save()
            return cartExists
        } catch (error) {
            throw error
        }
    }

    clearCart = async (param) => {
        try {
            const { cid } = param
            const cart = await cartModel.findById(cid)

            if (!cart) throw new Error('No se encontró el carrito')

            //Actualizar el carrito con el operador $pull el cual remueve de un array las instancias encontradas según la condicion especificada
            //https://www.mongodb.com/docs/v5.2/reference/operator/update/pull/
            return await cartModel.updateOne({ _id: cid }, { $pull: { products: {} } })
        } catch (error) {
            throw error.message
        }
    }
    delProduct = async (params) => {
        try {
            const { cid, pid } = params

            const cart = await cartModel.findOne({ _id: cid })
            if (!cart) throw new Error('No se encontró el carrito')

            return await cartModel.updateOne({ _id: cid }, { $pull: { products: { product: pid } } })
        } catch (error) {
            throw error.message
        }
    }
}

module.exports = new CartManagerM()