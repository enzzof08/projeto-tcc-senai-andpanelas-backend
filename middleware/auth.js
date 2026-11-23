const configMessages = require('../controller/modulo/configMessages.js')

const jwt = require('./middlewareJWT.js')

const verifyToken = function (request, response, next) {
    let authorization = request.headers.authorization

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return response
            .status(configMessages.ERROR_INVALID_TOKEN.status_code)
            .json(configMessages.ERROR_INVALID_TOKEN)
    }

    let token = authorization.slice(7)

    let autenticidadeToken = jwt.validateJWT(token)


    if (!autenticidadeToken || !Number.isInteger(autenticidadeToken.id_usuario) || autenticidadeToken.id_usuario < 1) {
        return response
            .status(configMessages.ERROR_INVALID_TOKEN.status_code)
            .json(configMessages.ERROR_INVALID_TOKEN)
    }

    request.id_usuario = autenticidadeToken.id_usuario

    next()
}

module.exports = {
    verifyToken
}