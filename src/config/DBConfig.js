const { connect } = require('mongoose')

const ecommerce = 'mongodb://127.0.0.1:27017/ecommerce'

module.exports = {
    connectDB: () => {
        connect(ecommerce)
        console.log('Conexion a la base de datos')
    }
}