const configMessages = require('../modulo/configMessages')

const seguidoresDAO = require('../../model/DAO/seguidores/seguidores')

const inserirNovoSeguidor = async function (idSeguindo, idSeguidor) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = await validarDados(idSeguindo, idSeguidor)
        if (validar) {
            return validar
        } else {

            let result = await seguidoresDAO.insertSeguidor(idSeguindo, idSeguidor)

            if (result === 'DUPLICADO') {
                customMessage.ERROR_BAD_REQUEST.field = 'USUARIO JA SEGUE ESTE PERFIL'
                return customMessage.ERROR_BAD_REQUEST
            }

            if (result) {
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message

                return customMessage.DEFAULT_MESSAGE
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }

        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirSeguidor = async function (idSeguindo, idSeguidor) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = await validarDados(idSeguindo, idSeguidor)

        if (validar) {
            return validar
        }

        let result = await seguidoresDAO.deleteSeguidor(idSeguindo, idSeguidor)
        
        if (result) {
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETED_ITEM.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
            customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_DELETED_ITEM.message

            return customMessage.DEFAULT_MESSAGE

        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarSeguidores = async function(idUsuario) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = await validarIdUsuario(idUsuario)

        if (validar) {
            return validar
        }

        let result = await seguidoresDAO.selectSeguidores(idUsuario)

        if (result !== false) {
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.response.seguidores = result

            return customMessage.DEFAULT_MESSAGE
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarSeguindo = async function(idUsuario) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = await validarIdUsuario(idUsuario)

        if (validar) {
            return validar
        }

        let result = await seguidoresDAO.selectSeguindo(idUsuario)

        if (result !== false) {
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.response.seguindo = result

            return customMessage.DEFAULT_MESSAGE
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const verificarSeguindo = async function(idSeguindo, idSeguidor) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = await validarDados(idSeguindo, idSeguidor)

        if (validar) {
            return validar
        }

        let result = await seguidoresDAO.selectVerificarSeguindo(idSeguindo, idSeguidor)

        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
        customMessage.DEFAULT_MESSAGE.response.segue_usuario = result

        return customMessage.DEFAULT_MESSAGE

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function (idSeguindo, idSeguidor) {

    let customMenssagen = JSON.parse(JSON.stringify(configMessages))

    if (idSeguindo == undefined || idSeguindo == null || isNaN(idSeguindo) || !Number.isInteger(Number(idSeguindo)) || idSeguindo <= 0) {
        customMenssagen.ERROR_BAD_REQUEST.field = '[ID_SEGUINDO] INVALIDO'
        return customMenssagen.ERROR_BAD_REQUEST

    } else if (idSeguidor == undefined || idSeguidor == null || isNaN(idSeguidor) || !Number.isInteger(Number(idSeguidor)) || idSeguidor <= 0) {
        customMenssagen.ERROR_BAD_REQUEST.field = '[ID_SEGUIDOR] INVALIDO'
        return customMenssagen.ERROR_BAD_REQUEST

    } else if (Number(idSeguindo) == Number(idSeguidor)) {
        customMenssagen.ERROR_BAD_REQUEST.field = 'UM USUARIO NAO PODE SEGUIR A SI MESMO'
        return customMenssagen.ERROR_BAD_REQUEST

    } else {
        return false
    }
}

const validarIdUsuario = async function(idUsuario) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (idUsuario == undefined || idUsuario == null || idUsuario == '' || isNaN(idUsuario) || !Number.isInteger(Number(idUsuario)) || idUsuario <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }

    return false
}

module.exports = {
    inserirNovoSeguidor,
    excluirSeguidor,
    listarSeguidores,
    listarSeguindo,
    verificarSeguindo
}