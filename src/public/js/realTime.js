// Obtiene el elemento del formulario por su ID y el elemento de la URL de la imagen 
const formProducts = document.getElementById("form-products"); 
const inputTitle = document.getElementById("form-title"); 
const inputPrice = document.getElementById("form-price"); 
const inputThumbnail = document.getElementById("form-thumbnail"); 

// Enviar nuevo producto al servidor
formProducts.addEventListener("submit", (e) => {
    e.preventDefault(); 
// Verifica que los campos del formulario no estén vacíos
    if (!inputTitle.value == "" && !inputPrice.value == "" && !inputThumbnail.value == "") { 
        const newProduct = {
            title: inputTitle.value, 
            price: +(inputPrice.value), 
            thumbnails: inputThumbnail.value 
        };
 // Envía el nuevo producto al servidor usando socket.io
        socket.emit("newProduct", newProduct);
// Limpia el campo del título, precio y URL de la imagen
        inputTitle.value = ""; 
        inputPrice.value = ""; 
        inputThumbnail.value = ""; 
    } else {
        alert("Completa los datos del formulario"); 
    }
});

// Escucha la recepción de un nuevo producto desde el servidor
socket.on("newProduct", (product) => {
    console.log(product); 
    const newProduct = `
    <div class="card" style="width: 18rem;">
        <img src=${product.thumbnails} class="card-img-top" alt="..." />
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5> <!-- Muestra el título del nuevo producto -->
          <p class="card-text">${product.price}</p> <!-- Muestra el precio del nuevo producto -->
          <a href="#" class="btn btn-primary">Add to cart</a>
        </div>
      </div>
    `;
     // Agrega el nuevo producto al contenedor de productos en el HTML
    document.getElementById("products").innerHTML += newProduct;
});
