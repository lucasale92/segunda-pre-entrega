const bcrypt = require('bcrypt')

//Funcion para crear el hash
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
//hashSync es el encargado de encriptar la contraseña, de manera asíncrona.
//genSaltSync es el encargado de generar todas las llaves que usará hashSync para encriptar la contraseña. El cual tiene un sistema de profundidad, entre más alto sea el valor numerico, mayor será la seguridad, pero también será más lenta de generar. 12 se considera ya un valor muy alto, generalmente se coloca 10

//Generar la funcion para comparar la clave hasheada y la contraseña del formulario.
const isValidPass = (pass, user) => bcrypt.compareSync(pass, user.password)
//el párametro user lo extraemos de la base de datos, y el párametro pass, se obtiene del formulario extraido desde el frontEnd

module.exports = {
    isValidPass,
    createHash
}