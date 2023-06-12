import express from 'express'
import {ProductManager} from '../productManager.js'

const products = new ProductManager("./productos.json");
export const productsRouter = express.Router();

// devuelve una lista de todos los productos
productsRouter.get("/", async (req, res, next) => {
    try {
        // Obtener todos los productos, Comprobar si se ha proporcionado un límite de resultados, devolver solo los primeros 'limit' productos
        const data = await products.getProducts();
        const limit = req.query.limit
        const limitedProducts = limit ? data.slice(0, limit) : data;
        res.status(200).json(limitedProducts)
    } catch (err) {
        // Si se produce un error, devolver una respuesta con el estado 500
        if (err instanceof Error) {
            res.status(500).json({ status: "error", msg: "Invalid input", data: {} })
        } else {
            res.status(500).json({ status: "error", msg: "Error en servidor", data: {} })
        }
    }
})
// devuelve un ID de los productos
productsRouter.get("/:pid", async (req, res, next) => {
    try {
        //obtiene el ID del producto desde la ruta
        const id = req.params.pid 
        const dataId = await products.getProductById(parseInt(id)); //obtiene la información del producto por su ID
        res.status(200).json(dataId) 
    } catch (err) {
        //envía un mensaje de error si el tipo de error es Error
        if (err instanceof Error) { 
            res.status(500).json({ status: "error", msg: "Invalid input", data: {} }) 
        } else {
            res.status(500).json({ status: "error", msg: "Error en servidor", data: {} }) 
        }
    }
})
productsRouter.post("/", async (req, res, next) => {
    try {
        const data = await products.getProducts(); // Obtiene todos los productos actuales
        let newProduct = req.body; // Obtiene los datos del nuevo producto desde el cuerpo de la solicitud
        let findproduct = (data.find((ele) => ele.code === newProduct.code)) // Busca si ya existe un producto con el mismo código
        if (findproduct) { // Si ya existe, se responde con un error 400
            return res.status(400).json({
                status: "error",
                msg: "Product already exists"
            })
        }
        const requiredField = ["title", "description", "code", "price", "stock", "category"]
        const allFields = requiredField.every(prop => newProduct[prop]); // Verifica si se proporcionaron todos los campos necesarios
        if (newProduct.id == undefined && allFields) { // Si no se proporcionó un id y se proporcionaron todos los campos, se agrega el producto
            newProduct =
            {
                ...newProduct,
                id: data[data.length - 1].id + 1 // Se asigna un nuevo id al producto
            }
            await products.addProduct({ ...newProduct, status: true }) // Se agrega el producto a la lista de productos
            return res.status(200).json({ // Se responde con un mensaje de éxito y los datos del nuevo producto
                status: "success",
                msg: "Product added successfully",
                data: newProduct
            })
        } else { // Si no se cumplen las condiciones anteriores, se responde con un error 400
            res.status(400).json({
                status: "error",
                msg: "Invalid input"
            })
        }
    } catch (err) { // Si ocurre un error, se responde con un error 500
        if (err instanceof Error) {
            res.status(500).json({ status: "error", msg: "Invalid input", data: {} })
        } else {
            res.status(500).json({ status: "error", msg: "Error in server", data: {} })
        }
    }
})
// Definimos la ruta y utilizamos async para manejar promesas
productsRouter.put("/:pid", async (req, res, next) => {
    try {
        // Obtenemos el id del producto de los parámetros de la ruta
        const id = req.params.pid 
        const data = await products.getProducts() 
        // Obtenemos los cambios que se realizarán en el producto
        let changeProduct = req.body; 
        // Actualizamos el producto en la base de datos
        await products.updateProduct(id, changeProduct); 
        // Enviamos una respuesta con código 201 y un JSON con la información actualizada del producto
        return res.status(201).json({ 
            status: "Success",
            msg: "product updated",
            data: changeProduct
        })
    } catch {
        // Si ocurre un error, devolvemos una respuesta con un código de estado 500 y un mensaje de error
        res.status(500).json({ status: "error", msg: "Invalid input", data: {} }) 
    }
})

// Definimos la ruta y la función que se ejecutará cuando se acceda a ella
productsRouter.delete("/:pid", async (req, res, next) => {
    try {
        // Obtenemos el ID del producto a eliminar de los parámetros de la solicitud
        const id = req.params.pid
        // Obtenemos todos los productos existentes
        const data = await products.getProducts()
        // Buscamos el producto a eliminar en los productos existentes
        let findProduct = data.find((prod) => prod.id == id)
        // Si el producto no se encuentra, devolvemos un error con un mensaje apropiado
        if (!findProduct) {
            return res.status(400).json({
                status: "error",
                msg: "Product not found"
            })
        } else {
            // Si el producto se encuentra, lo eliminamos
            await products.deleteProduct(id);
            // Enviamos una respuesta con un mensaje de éxito y datos vacíos
            return res.status(201).json({
                status: "Success",
                msg: "product deleted",
                data: {}
            })
        }
    } catch {
        // Si se produce un error, enviamos una respuesta con un mensaje de error genérico
        res.status(500).json({ status: "error", msg: "Invalid input", data: {} })
    }
})
  
  productsRouter.get("*", (req, res, next) => {
    res.status(404).json({ status: "error", msg: "Route not found", data: {} })
})
