import express from 'express'; 
import { ProductManager } from "../productManager.js"; 

 // Crea una instancia de enrutador de express y ProductManager con la ruta del archivo de productos
export const realTimeRouterSockets = express.Router();
const products = new ProductManager("./productos.json"); 

// Ruta GET para obtener los productos en tiempo real
realTimeRouterSockets.get("/", async (req, res) => {
    try {
// Obtiene los productos mediante ProductManager y Renderiza la vista de "realTimeProducts"
        const data = await products.getProducts(); 
        return res.status(200).render("realTimeProducts", { data }); 
    } catch (err) {
// Capturamos los errores
        return res.status(500).json({ status: "error", msg: "Error in server", data: {} }); 
    }
});
