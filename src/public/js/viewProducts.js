const formProduct = document.querySelector('#newProduct')
const addButton = document.querySelector("#addButton")


addButton.addEventListener('click', (e) => {
    e.preventDefault()

    const data = addButton.value

    fetch('/api/carts')
})