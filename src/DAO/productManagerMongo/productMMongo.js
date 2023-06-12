const { productModel } = require("../models/productModel.js");

class ProductManagerMongo {
    getProduct = async (request/*Recibe la req.query para su utilización*/) => {
        try {
            //Si la URL no recibe consulta alguna, regresa TODOS los documentos
            if (Object.keys(request).length === 0) {
                return await productModel.paginate({}, {
                    lean: true,
                    page: 1,
                    limit: 10
                })
            }
            //Si la URL tiene un query por párametro, la desestructuro para simplificar las consultas.
            const { limit = 10, page = 1, sort, pid, ...query } = request

            //Si el URL tiene un ID de producto, entonces lo busca
            if (pid) {
                return await productModel.findOne({ _id: pid }).lean()
            }
            const [queryKey] = Object.keys(query)
            const [queryValues] = Object.values(query)

            //Si no tiene consulta pero tiene todos los demás párametros
            if (!queryKey) {
                return await productModel.paginate({}, {
                    lean: true,
                    limit,
                    page,
                    sort: { price: sort }
                })
            }

            //Si la consulta a realizar es "disponibilidad"  o "categoria" se realiza la siguiente condición
            if (queryKey === 'status' || queryKey === 'category') {
                return await productModel.paginate({ [queryKey]: queryValues }, {
                    lean: true,
                    limit,
                    page,
                    sort: { price: sort }
                })
            }
            throw Error
        } catch (error) {
            if (error) throw error.message
        }
    }
    updateProduct = async (reqPid, changes) => {
        try {
            const { pid } = reqPid
            if (Object.keys(changes).length < 1) {
                throw new Error("There's empty values to update")
            }
            if (!pid) {
                throw new Error(`No se efectuaron los cambios porque no se entregó un ID`)
            }
            const update = await productModel.findByIdAndUpdate(pid, { $set: changes })
            return update
        } catch (error) {
            if (error) throw error.message
        }
    }
    createProduct = async (product) => {
        try {
            const { title, description, price, code, stock, category } = product

            if (!title || !description || !price || !code || !stock || !category) throw new Error("There's empty values")

            const productAlreadyExists = await productModel.findOne({ code: product.code })
            if (productAlreadyExists) {
                throw new Error('Product already exists')
            }

            return await productModel.create(product)
        } catch (error) {
            if (error) throw error.message
        }
    }
    deleteProduct = async (productID) => {
        try {
            const { pid } = productID
            const pExists = await productModel.findById(pid)
            if (!pExists) throw new Error("Products missmatches ID or doesn't exists")

            return await productModel.deleteOne({ _id: pid })
        } catch (error) {
            if (error) throw error.message
        }
    }
}

module.exports = new ProductManagerMongo()