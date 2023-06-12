import express from "express";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/cart.router.js";
import { __dirname } from './utils.js';
import path from 'path';
import handlebars from "express-handlebars"
import { Server } from 'socket.io';
import {productRouterHtml} from './routes/home.router.js';
import {realTimeRouterSockets} from './routes/realTimeProducts.router.js';
import { ProductManager } from "./productManager.js";

const app = express(); 
const port = 8080; 
// Middleware para analizar el cuerpo de las solicitudes en formato JSON, analizar los datos enviados en formularios, servir archivos estáticos desde la carpeta 'public'
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

// Creación del servidor HTTP y escucha en el puerto especificado
const httpServer = app.listen(port, () => {
    console.log(`🚀 Server on and running on port: http://localhost:${port} 🚀`);
});
// Crea un servidor de Socket.io en base al servidor HTTP
const socketServer = new Server(httpServer); 

// Configuración de las rutas
// Ruta para las vistas HTML de productos y API en tiempo real con sockets
app.use('/html/product', productRouterHtml); 
app.use('/realtimeproducts', realTimeRouterSockets); 

// Configuración de Handlebars (motor de plantillas, ubicación de las vistas)
app.engine("handlebars", handlebars.engine()); 
app.set("views", __dirname + "/views"); 
app.set("view engine", "handlebars"); 

// Configuración de las rutas de la API REST (productos y carritos )
app.use("/api/product", productsRouter);  
app.use("/api/carts", cartsRouter); 

// Evento de conexión en el servidor de sockets
socketServer.on("connection", (socket) => {
    console.log("Un cliente se ha conectado " + socket.id);
    socket.emit('mensaje', 'Bienvenido!');

    // Evento para recibir nuevos productos
    socket.on("newProduct", async (req, res) => {
        const products = new ProductManager("./productos.json");
        await products.addProduct(req);
        socketServer.emit("newProduct", req);
    });
});

// Ruta para manejar las solicitudes no encontradas (404)
app.get("*"), (req, res, next) => {
    res.status(404).json({ status: "error", msg: "Not Found", data: {} });
};
