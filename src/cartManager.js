// Importamos el módulo "fs" para manejar archivos
import fs from 'fs';

export class CartManager {

  constructor(path) {
    this.path = path;

    // Verificamos si el archivo JSON ya existe
    if (fs.existsSync(path)) {
      // Si el archivo existe, lo leemos y almacenamos la lista de productos, sino lo creamos con una lista vacía de productos
      const productsString = fs.readFileSync(this.path, "utf-8")
      const productsFile = JSON.parse(productsString)
      this.products = productsFile
    } else { 
      fs.writeFileSync(path, "[]")
      this.products = []
    }
  }

    // agregar carritos a nuestra lista de carritos
async addCart(object) {
    try {
        // Obtiene la lista actual de carritos
        const data = await this.getCarts(); 
        if (data.length > 0) { 
    // Obtiene el último ID y le suma 1 para el nuevo carrito
            const lastId = data[data.length - 1].id + 1; 
    // Crea el nuevo carrito con el objeto pasado como parámetro y el nuevo ID con spreed
            const newCart = { ...object, id: lastId }; 
    // Agrega el nuevo carrito a la lista de carritos        
            data.push(newCart); 
            const productsString = JSON.stringify(data, null, 2); 
            fs.writeFileSync(this.path, productsString); 
    // Devuelve el nuevo carrito creado
            return newCart; 
    // Si la lista de carritos está vacía
        } else {
            const newCart = { ...object, id: 1 }; 
    // Crea el nuevo carrito con el objeto pasado como parámetro y el ID 1 y Agrega el nuevo carrito a la lista de carritos
            data.push(newCart); // 
            const productsString = JSON.stringify(data, null, 2); 
            fs.writeFileSync(this.path, productsString); 
    // Devuelve el nuevo carrito creado
            return newCart; 
        }
    // Agarramos el error
    } catch (err) { 
        console.log(err); 
    }
}

//  buscar un carrito por su id en la lista de carritos 
async getCartById(id) {
  try {
      // Se obtiene la lista de carritos
      const data = await this.getCarts()
      // Se busca el carrito que coincida con el id proporcionado
      const cart = data.find((cart) => cart.id === id);
      // Si se encuentra el carrito, se devuelve el objeto carrito, sino se devuelve un mensaje indicando que no existe
      if (cart) {

      return cart;

      } else {
      
          return (`No existe el carrito id: ${id}`);
      }
      // Agarramos el error
  } catch (err) {
      console.log(err)
  }
}

//  actualizar en carrito por su id  
async updateCart(id, productId) {
    try {
        // Obtenemos los datos de los carritos
        const data = await this.getCarts()
        // Buscamos el carrito correspondiente al id recibido
        const cart = data.find((cart) => cart.id == id);
        if (cart) {
            // Buscamos el producto correspondiente al id recibido en el array de productos del carrito
            const product = cart.products.find((product) => product.idProduct == productId);
            // Si el producto ya está en el carrito, aumentamos su cantidad en uno, sino lo agregamos al carrito con cantidad de 1
            if (product) {
                product.quantity = product.quantity + 1
                const index = cart.products.indexOf(product)
                cart.products.splice(index, 1, product)
                // Actualizamos el carrito en el array de carritos
                const indexCart = data.indexOf(cart)
                data.splice(indexCart, 1, cart)
                // Convertimos los datos actualizados en un string JSON y escribimos el archivo correspondiente en el disco
                const productsString = JSON.stringify(data, null, 2)
                fs.writeFileSync(this.path, productsString)
                return product
            } else {
                cart.products.push({idProduct: productId, quantity: 1})
                // Actualizamos el carrito en el array de carritos
                const indexCart = data.indexOf(cart)
                data.splice(indexCart, 1, cart)
                // Convertimos los datos actualizados en un string JSON y escribimos el archivo correspondiente en el disco
                const productsString = JSON.stringify(data, null, 2)
                fs.writeFileSync(this.path, productsString)
            }
        } else {
            return ("El carrito no existe");
        }
        // Agarramos el error
    } catch (err) {
        console.log(err)
    }
}
// buscar un carrito
async getCarts() {
  // Verifica si el archivo 'carts.json' existe, sino lo crea con un array vacío
  if (!fs.existsSync("carts.json")) {
      fs.writeFileSync("carts.json", "[]", "utf-8")
      return ("Carrito creado!!")
  } else {
  // Si existe, lee el archivo y parsea su contenido a un objeto 
      const read = await fs.promises.readFile(this.path, "utf-8")
      const data = JSON.parse(read)
      return data
  }
}
//eliminar un carrito y se busca un ID especifico
async deleteCart(id) {
  try {
      const data = await this.getCarts()
      const cart = data.find((cart) => cart.id == id);
     // Si se encuentra el carrito, se elimina de la lista, sino se devuelve un mensaje de error
      if (cart) {          
          const index = data.indexOf(cart)
          data.splice(index, 1)     
          const productsString = JSON.stringify(data, null, 2)
          fs.writeFileSync(this.path, productsString)
          return ("Carrito eliminado con éxito");
      } else {
          return ("No existe el carrito");
      }
       // Agarramos el error
  } catch (err) {
      console.log(err)
  }
}
//eliminar todo
async deleteAll() {
  try {
      // escribe un array vacío en el archivo 'carts.json', sobrescribiendo cualquier dato anterior
      fs.writeFileSync("carts.json", "[]", "utf-8")
      // devuelve un mensaje de éxito
      return ("Carritos eliminados con éxito");
  } catch (err) {
      // Agarramos el error
      console.log(err)
  }
}
}