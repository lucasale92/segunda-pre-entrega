const socket = io()
const sendBtn = document.querySelector('#send')
const msg = document.querySelector('#msgArea')
const form = document.querySelector('#form')

let newUser;

Swal.fire({
    title: 'Identificate',
    input: 'text',
    text: 'Ingresar el nombre de usuario.',
    inputValidator: (value) => {
        return !value && 'El nombre de usuario es obligatorio'
    },
    allowOutsideClick: false,
    allowEscapeKey: false
}).then(result => {
    newUser = result.value
    socket.emit('client:createUser', newUser)
})

sendBtn.addEventListener('click', (e) => {
    e.preventDefault()

    let chatUser = {
        userName: newUser,
        newMsg: msg.value
    }

    socket.emit('client:newMesage', chatUser)

    form.reset()
})

socket.on('server:chatHistory', (data) => {
    const historial = document.querySelector('#mensajes')
    historial.innerText += `\n${data[0].user} Dice: ${data[0].message[0].content}`
})