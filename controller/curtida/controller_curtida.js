const configMessages = require('../modulo/configMessages')

const curtidaDAO = require('../../model/DAO/curtida/curtida.js')

const inserirCurtida = async function (idUsuario, idReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = await validarDados(idUsuario, idReceita)

        if (validar) {
            return validar
        }

        let result = await curtidaDAO.insertCurtidaReceita(idUsuario, idReceita)

        if (result === 'DUPLICADO') {
            customMessage.ERROR_BAD_REQUEST.message = 'Você já curtiu esta receita.'
            return customMessage.ERROR_BAD_REQUEST
        }

        if (result) {
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
            customMessage.DEFAULT_MESSAGE.message = 'Receita curtida com sucesso!'

            return customMessage.DEFAULT_MESSAGE
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirCurtida = async function (idUsuario, idReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = await validarDados(idUsuario, idReceita)

        if (validar) {
            return validar
        }

        let result = await curtidaDAO.deleteCurtidaReceita(idUsuario, idReceita)

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

const listarCurtidasReceita = async function (idReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idReceita == undefined || idReceita == null || isNaN(idReceita) || idReceita <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID RECEITA] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        }

        let result = await curtidaDAO.selectCurtidasReceita(idReceita)

        if (result) {
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.response.qtd_curtida = result.qtd_curtida

            return customMessage.DEFAULT_MESSAGE
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const verificarCurtidaUsuario = async function (idUsuario, idReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = await validarDados(idUsuario, idReceita)

        if (validar) {
            return validar
        }

        let result = await curtidaDAO.selectCurtidaUsuario(idUsuario, idReceita)

        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
        customMessage.DEFAULT_MESSAGE.response.curtida_usuario = result

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
inserirCurtida,
excluirCurtida,
listarCurtidasReceita,
verificarCurtidaUsuario
}