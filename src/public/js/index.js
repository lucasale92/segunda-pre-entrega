const socket = io()

 socket.on("newProduct", (req, res) => {
     socket.emit("msg_front", {
         msg: "hola mundo"
     })
 })
