const socket = io()
const form = document.querySelector("#addForm")
const deleteProduct = document.querySelector("#deleteProducts")

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const [title, description, price, thumbnail, code, stock, status, category] = form

    socket.emit('client:addProduct', {
        'title': title.value,
        'description': description.value,
        'price': price.value,
        'thumbnail': thumbnail.value,
        'code': code.value,
        'stock': stock.value,
        'status': status.value === 'on' ? status.value = true : status.value = false,
        'category': category.value
    })

    form.reset()
})

socket.on('server:products', (data) => {
    let products = document.querySelector("#newProducts")

    let renderProducts = ''

    for (let value of data) {
        renderProducts += `
        <h2>${value.title}</h2>
        <h3>${value.description}</h3>
        <p>ID: ${value._id}</p>
        <p>Costo: ${value.price}</p>
        <p>Disponibles: ${value.stock}</p>
        <p>${value.category}</p>
        <img src="${value.thumbnail}">
        <hr>
        `
    }
    products.innerHTML = renderProducts
})

const [idProduct, delButton] = deleteProduct

delButton.addEventListener('click', (e) => {
    e.preventDefault()


    const confirmar = confirm(`ATENCION!!!\n¿Esta seguro de eliminar el producto con ID: ${idProduct.value}?`)

    if (confirmar) {
        socket.emit('client:deleteProduct', idProduct.value)
    }
    deleteProduct.reset()
})
