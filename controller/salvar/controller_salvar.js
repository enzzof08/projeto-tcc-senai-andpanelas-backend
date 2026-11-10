const configMessages = require('../modulo/configMessages')

const salvarDAO = require('../../model/DAO/salvar/salvar.js')

const inserirSalvo = async function (idUsuario, idReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = await validarDados(idUsuario, idReceita)

        if (validar) {
            return validar
        }

        let result = await salvarDAO.insertSalvoReceita(idUsuario, idReceita)

        if (result === 'DUPLICADO') {
            customMessage.ERROR_BAD_REQUEST.message = 'Você já salvou esta receita.'
            return customMessage.ERROR_BAD_REQUEST
        }

        if (result) {
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
            customMessage.DEFAULT_MESSAGE.message = 'Receita salvada com sucesso!'

            return customMessage.DEFAULT_MESSAGE
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirSalvo = async function (idUsuario, idReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = await validarDados(idUsuario, idReceita)

        if (validar) {
            return validar
        }

        let result = await salvarDAO.deleteSalvoReceita(idUsuario, idReceita)

        if (result) {
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETED_ITEM.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
            customMessage.DEFAULT_MESSAGE.message = 'Curtida removida com sucesso!'

            return customMessage.DEFAULT_MESSAGE
        } else {
            return customMessage.ERROR_NOT_FOUND
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarSalvosReceita = async function (idReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idReceita == undefined || idReceita == null || isNaN(idReceita) || idReceita <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID RECEITA] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        }

        let result = await salvarDAO.selectSalvosReceita(idReceita)

        if (result) {
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.response.qtd_salvo = result.qtd_salvo

            return customMessage.DEFAULT_MESSAGE
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const verificarSalvoUsuario = async function (idUsuario, idReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = await validarDados(idUsuario, idReceita)

        if (validar) {
            return validar
        }

        let result = await salvarDAO.selectSalvoUsuario(idUsuario, idReceita)

        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
        customMessage.DEFAULT_MESSAGE.response.salvo_usuario = result

        return customMessage.DEFAULT_MESSAGE

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const validarDados = async function (idUsuario, idReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (idUsuario == undefined || idUsuario == null || isNaN(idUsuario) || idUsuario <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID USUARIO] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }

    if (idReceita == undefined || idReceita == null || isNaN(idReceita) || idReceita <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID RECEITA] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }

    return false
}

module.exports = {
inserirSalvo,
excluirSalvo,
listarSalvosReceita,
verificarSalvoUsuario
}