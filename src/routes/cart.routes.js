import express from "express";
import { ProductManager } from "../productManager.js"
import { CartManager } from '../cartManager.js';

const products = new ProductManager("./productos.json")
const carts = new CartManager("./carts.json")

export const cartsRouter = express.Router();

// Define una ruta GET en el router cartsRouter para obtener todos los carritos de compras
cartsRouter.get("/", async (req, res, next) => {
    try {
        // Obtiene los carritos de compras con el método getCarts 
        const data = await carts.getCart();
        // Estado => estado 200 (OK)
        res.status(200).json(data)
    } catch (err) {
        // devuelve una respuesta HTTP con un estado 500 (Error interno del servidor)
        if (err instanceof Error) {
            res.status(500).json({ status: "error", msg: "Invalid input", data: {} })
        } else {
            res.status(500).json({ status: "error", msg: "Error in server", data: {} })
        }
    }
}
)
// Define una ruta POST en el router cartsRouter para obtener todos los carritos de compras
cartsRouter.post("/", async (req, res, next) => {
    try {
        // Obtiene todos los carritos existentes
        const data = await carts.getCarts();
        // Agrega un nuevo carrito vacío
        await carts.addCart({ products: [] })
       // Estado => estado 200 (OK)
        res.status(200).json(data)
    } catch (err) {
         // devuelve una respuesta HTTP con un estado 500 (Error interno del servidor)
        if (err instanceof Error) {
            res.status(500).json({ status: "error", msg: "Invalid input", data: {} })
        } else {
            res.status(500).json({ status: "error", msg: "Error in server", data: {} })
        }
    }
})
//Definimos la ruta con el método get y el parámetro de ID
cartsRouter.get("/:cid", async (req, res, next) => { 
    try {
        const dataCarts = await carts.getCarts() 
//Obtenemos el ID de la URL
        const id = req.params.cid 
        const dataId = await carts.getCartById(parseInt(id)); //Obtenemos el carrito específico por su ID
        //Si el carrito existe, sino enviamos un mensaje de error
        if (dataId) {
            res.status(200).json(dataId) 
        } else { 
            res.status(200).json(`No existe el carrito id: ${id}`)
        }
    } catch {
//Si hay algún error, enviamos una respuesta de error del servidor
}
        res.status(500).json({ status: "error", msg: "Error in server", data: {} }) 
})

//Definimos la ruta con el método post y el parámetro de ID
cartsRouter.post("/:cid/products/:pid", async (req, res, next) => {
    try {
        const dataCarts = await carts.getCarts()
        const dataProducts = await products.getProducts()
        
        //Obtener el ID del carrito y el ID del producto de los parámetros de la solicitud
        const cartId = req.params.cid
        const productId = req.params.pid
        
        //Buscar el carrito correspondiente al ID proporcionado
        const cartFound = dataCarts.find((ele) => ele.id == cartId)
        //Si no se encuentra el carrito, enviar una respuesta con un mensaje de error
        if (!cartFound) {            
            res.status(200).json(`No existe el carrito id: ${cartId}`)
        }
        
        //Buscar el producto correspondiente al ID proporcionado
        const productFound = dataProducts.find((ele) => ele.id == parseInt(productId))
        if (!productFound) {
            //Si no se encuentra el producto, enviar una respuesta con un mensaje de error
            res.status(200).json(`No existe el producto id: ${productId}`)
        }
        
        //Actualizar el carrito con el producto especificado y devolver el carrito actualizado
        const product = await carts.updateCart(parseInt(cartId), parseInt(productId))
        res.status(200).json(product)
    } catch {
        //Si ocurre algún error durante el procesamiento, enviar una respuesta con un mensaje de error
        res.status(500).json({ status: "error", msg: "Error en el servidor", data: {} })
    }
})

cartsRouter.get("*", (req, res, next) => {
    res.status(404).json({ status: "error", msg: "Route not found", data: {} })
})

