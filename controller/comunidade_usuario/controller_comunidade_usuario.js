const configMessages = require('../modulo/configMessages')

const comunidadeUsuarioDAO = require('../../model/DAO/comunidade_usuario/comunidade_usuario')

const inserirNovaComunidadeUsuario = async function (idUser, idComunidade){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{

        let validar = await validarDados(idUser, idComunidade)

        if(validar){
            return validar
        }else{
            let result = await comunidadeUsuarioDAO.insertComunidadeUsuario(idUser, idComunidade)

            if (result === 'DUPLICADO') {
                customMessage.ERROR_BAD_REQUEST.field = 'USUARIO JA PARTICIPA DESTA COMUNIDADE'
                return customMessage.ERROR_BAD_REQUEST
            }

            if(result){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    }catch(error){
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarComunidadesPorUsuario = async function(idUsuario){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        if (idUsuario == undefined || String(idUsuario).replaceAll('', '') == '' || idUsuario == '' || idUsuario == null || isNaN(idUsuario) || idUsuario <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        } else {
            let result = await comunidadeUsuarioDAO.selectComunidadeByIdUsuario(idUsuario)

            if (result){

                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.comunidade = result

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }  

    } catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarUsuariosPorComunidade = async function (idComunidade){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        if (idComunidade == undefined || String(idComunidade).replaceAll('', '') == '' || idComunidade == '' || idComunidade == null || isNaN(idComunidade) || idComunidade <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_COMUNIDADE] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        }else{
            let result = await comunidadeUsuarioDAO.selectUsuarioByIdComunidade(idComunidade)
            if(result){
                if(result == false){
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }

                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response = result

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    }catch (error){
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirComunidadeUsuario = async function (idUsuario, idComunidade) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = await validarDados(idUsuario, idComunidade)

        if (validar) {
            return validar
        }

        let result = await comunidadeUsuarioDAO.deleteComunidadeUsuario( idUsuario, idComunidade)

        if (result) {
            return customMessage.SUCCESS_DELETED_ITEM
        } else {
            return customMessage.ERROR_NOT_FOUND
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const verificarComunidadeUsuario = async function(idUsuario, idComunidade){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = await validarDados(idUsuario, idComunidade)

        if (validar) {
            return validar
        }

        let result = await comunidadeUsuarioDAO.selectVerificarComunidadeUsuario(
            idUsuario,
            idComunidade
        )

        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
        customMessage.DEFAULT_MESSAGE.response.participando = result

        return customMessage.DEFAULT_MESSAGE

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function (idUser, idComunidade) {
    if (idUser == undefined || idUser == '' || idUser == null || idUser <= 0 || isNaN(idUser)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (idComunidade == undefined || idComunidade == '' || idComunidade == null || idComunidade <= 0 || isNaN(idComunidade)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_COMUNIDADE] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }

}

module.exports ={
    inserirNovaComunidadeUsuario,
    buscarComunidadesPorUsuario,
    buscarUsuariosPorComunidade,
    excluirComunidadeUsuario,
    excluirComunidadeUsuario,
    verificarComunidadeUsuario
}