const { generateToken } = require("../../config/passportJWT");
const { createHash, isValidPass } = require("../../utils/bcrypthash");
const { userModel } = require("../models/usersModel");

class UserManager {
    #calcularEdad = (birthDate) => {
        const actualDate = new Date()
        const userBirth = new Date(birthDate)

        let age = actualDate.getFullYear() - userBirth.getFullYear()
        return age
    }

    addUser = async (data) => {
        try {
            const { first_name, last_name, email, password, age } = data
            const userAge = this.#calcularEdad(age)
            if (!first_name || !last_name || !email || !password) throw new Error('Error al registrar los campos.')

            const validUser = await userModel.findOne({ email: email })

            if (validUser) throw new Error('User already exists')

            const newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password),
                age: userAge
            }
            if (email === 'adminCoder@coder.com') {
                newUser.role = 'admin'
            }
            return await userModel.create(newUser)
        } catch (error) {
            if (error) {
                throw error
            }
        }
    }

    addUserGithub = async (data) => {
        try {
            const { name, email } = data

            const findUser = await userModel.findOne({ email })
            const newUser = {
                first_name: name.split(' ')[0],
                last_name: name.split(' ')[1],
                email,
                password: ""
            }
            if (findUser) {
                return newUser
            }
            await userModel.create(newUser)
            return newUser
        } catch (error) {
            if (error) throw error
        }
    }

    loginUser = async (data) => {
        try {
            const { email, password } = data

            //jwt
            const { _doc } = await userModel.findOne({ email })//Buscamos el user
            const { password: pass, ...restUser } = _doc
            if (!isValidPass(password, _doc)) throw new Error('El usuario o la contraseña son incorrectas.')

            return generateToken(restUser)
        } catch (error) {
            throw error
        }
    }

    changePassword = async (userReq) => {
        try {
            const { email, password } = userReq
            const newPass = createHash(password)
            const test = await userModel.findOneAndUpdate({ email }, { $set: { password: newPass } })
            return test
        } catch (error) {
            return `ERROR: ${error}`
        }
    }
    findUser = async (id) => {
        try {
            return await userModel.findOne({ email: id })
            //return await userModel.findById(id)
        } catch (error) {
            return `ERROR: ${error}`
        }
    }
}

module.exports = {
    UserManager
}