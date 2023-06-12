// Importamos el módulo "fs" para manejar archivos
import fs from 'fs';

export class ProductManager {

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

// Método para agregar un producto. con getProducts() devolvemos todos los productos y se guardamos en "data"
async addProduct(obj) {
    const data = await this.getProducts()
    // si ya existe un producto con el mismo código que el nuevo producto a agregar, Si no, se agrega el nuevo producto a la lista de productos en "data"
    if (obj) {
        if (data.find((product) => product.code === obj.code)) {
            return ("The product already exists");
        } else {
            data.push(
              obj
            );
    // Se convierte la lista de productos a una cadena de texto JSON
            const productsString = JSON.stringify(data, null, 2)
    // Se escribe la nueva lista de productos en el archivo JSON        
            await fs.promises.writeFile(this.path, productsString)
        }
    }
  } 
  // devuelve la información de los productos en el archivo
async getProducts() {
      const productsString = await fs.promises.readFile(this.path, "utf-8")
      const productsFile = JSON.parse(productsString)
      return productsFile
}

// busca un producto por ID 
async getProductById(id) {
      const productsString = await fs.promises.readFile(this.path, 'utf-8'); 
      const productsFile = JSON.parse(productsString); 
      const product = productsFile.find((product) => product.id === id); 
      // Si el producto existe, se devuelve el objeto que lo contiene, sino se devuelve un mensaje de error
  if (product) { 
    return product;
  } else { 
    return 'No existe el producto';
  }
}

// actualiza un producto por ID 
async updateProduct(id, object) {
  const productsString = await fs.promises.readFile(this.path, 'utf-8'); 
  const productsFile = JSON.parse(productsString); 
// Se busca el producto en el objeto usando el ID como referencia
  const product = productsFile.find((product) => product.id == id); 
// Si el producto existe, se actualiza con la información del objeto 
  if (product) { 
    const updatedProduct = { ...product, ...object };
    const index = productsFile.indexOf(product);
// Se reemplaza el objeto antiguo con el objeto actualizado
    productsFile.splice(index, 1, updatedProduct); 
    const productsString = JSON.stringify(productsFile, null, 2); 
    await fs.promises.writeFile(this.path, productsString); 
  }    
    return product; 
}

// Método para borrar un producto
async deleteProduct(id) {
  const productsString = await fs.promises.readFile(this.path, "utf-8")
  const productsFile = JSON.parse(productsString)

  // Buscamos el producto en la lista por su ID
  const product = productsFile.find((product) => product.id == id);
  if (product) {
      // Si encontramos el producto, lo eliminamos de la lista
      const index = productsFile.indexOf(product)
      productsFile.splice(index, 1)

      // Convertimos la lista actualizada de productos a formato JSON y la escribimos en el archivo
      const productsString = JSON.stringify(productsFile, null, 2)
      await fs.promises.writeFile(this.path, productsString)

      // Retornamos el producto eliminado
      return product
  }
}
}