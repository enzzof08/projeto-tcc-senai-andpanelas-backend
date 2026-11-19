const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET

const calcularTempoExpiracao = function () {
    let horarioAtual = new Date()

    let meiaNoite = new Date(horarioAtual)
    meiaNoite.setHours(24, 0, 0, 0)


    return Math.ceil((meiaNoite.getTime() - horarioAtual.getTime()) / 1000)
}

const createJWT = function (idUsuario) {

    const EXPIRES = calcularTempoExpiracao()

    const token = jwt.sign(
        { id_usuario: idUsuario },
        SECRET,
        {
            expiresIn: EXPIRES,
            algorithm: 'HS256'
        }
    )

    return token
}

const validateJWT = function (token) {
    try {

        return jwt.verify(token, SECRET, {
            algorithms: ['HS256']
        })

    } catch (error) {
        return false
    }
}

module.exports = {
    createJWT,
    validateJWT
}