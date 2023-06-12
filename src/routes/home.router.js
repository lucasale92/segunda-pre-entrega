import express from 'express'; 
import { ProductManager } from "../productManager.js"; 

// Crea una instancia de enrutador de express y ProductManager con la ruta del archivo de productos
export const productRouterHtml = express.Router(); 
const products = new ProductManager("./productos.json");

console.log("hola"); 

// Ruta GET para obtener los productos en formato HTML
productRouterHtml.get("/", async (req, res) => {
    try {
// Obtiene los productos mediante ProductManager y Renderiza la vista "home"
        const data = await products.getProducts(); 
        return res.status(200).render("home", { data }); 
    } catch (err) {
// Capturamos los errores
}
        return res.status(500).json({ status: "error", msg: "Error in server", data: {} }); 
});
