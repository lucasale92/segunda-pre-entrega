//const { ProductManager } = require('../DAO/productsManager/proManJSON.js')
//const path = './src/DAO/productsManager/data.json'
//const manager = new ProductManager(path)

const MMongo = require('../DAO/productManagerMongo/productMMongo.js')
const chatMongo = require('../DAO/productManagerMongo/chatManagerM.js')

const webSocket = (io) => {
    io.on('connection', async socket => {
        try {

            //Socket de los productos.
            socket.on('client:addProduct', async (data) => {
                await MMongo.createProduct(data)
                let { docs } = await MMongo.getProduct({})
                socket.emit('server:products', docs)
            })

            socket.on('client:deleteProduct', async (data) => {
                await MMongo.deleteProduct(data)
                let { docs } = await MMongo.getProduct({})
                socket.emit('server:products', docs)
            })

            //Socket del chat

            socket.on('client:createUser', async (data) => {
                await chatMongo.newChat({ user: data })
            })

            socket.on('client:newMesage', async (data) => {
                await chatMongo.addMessage(data)

                const mensajes = []
                const fetchMessage = await chatMongo.readLastMessage(data.userName)
                mensajes.push(fetchMessage)

                io.emit('server:chatHistory', mensajes)
            })
        } catch (error) {
            return `ERROR: ${error}`
        }
    })
}

module.exports = {
    webSocket
}

/*  
[
    {
        id: mongoID,
        usuario: nombre del usuario,
        mensajes:[
        {
            fecha: date.Now(),
            mensaje: 
        },
        {
            fecha: date.Now(),
            mensaje:
        }
    },
    {
        id: mongoID,
        usuario: nombre del usuario,
        mensajes:[
            {
                fecha: date.Now(),
                mensaje:
            }
        ]
    }
]
*/