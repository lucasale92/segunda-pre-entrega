const jwt = require('jsonwebtoken');
require('dotenv').config()

const JWT_PRIVATE_KEY = 'PalabraJWTSecreta';
//clave secreta: process.env.JWT_SECRET_KEY
//La palabra secreta será un código secreto que estará en nuestros enviroment variables, está comprobará que las peticiones vengan con la misma palabra secreta, de no ser así, podemos notar que la petición viene corrupta

//Esta función recibe al usuario y genera un token junto a la palabra secreta y al usuario, además se le puede colocar un tiempo de expiración.
const generateToken = (user) => {
    //El token generado utiliza un método de JWT, el cual recibe 3 argumentos, el primer argumento es un objeto con la información del usuario, el segundo parametro es la llave privada con la cual se realizará el cifrado, y el 3er argumento es el tiempo de expiración
    const token = jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: '24h' })
    return token
}

//Esta función verificar que el token no haya sido modificado.
const authToken = async (req, res, next) => {
    try {
        //guardamos el authorization dentro de la variable authHeader
        const authHeader = await req.headers['authorization']

        //Si no recibimos nada lo sacamos
        if (!authHeader) {
            return res.status(401).send({
                status: 'error',
                payload: 'No autenticado'
            })
        }
        //El formato del token será el siguiente:
        //['Bearer', 'asdasdasdada']
        //No requerimos utilizar el bearer, solo el token por lo tanto hacemos lo siguiente:
        const token = authHeader.split(' ')[1]


        //Jsonwebtoken se encarga de verificar el token con el siguiente método, el cual recibe 3 argumentos, el token, la palabra secreta y una callback
        jwt.verify(token, JWT_PRIVATE_KEY, (error, credential) => {
            if (error) return res.status(403).send({
                status: 'error',
                payload: 'No autorizado'
            })
            req.user = credential.user
            next()
        })
    } catch (error) {
        return res.status(404).send({ status: 'error', error })
    }
}

module.exports = {
    generateToken,
    authToken
}