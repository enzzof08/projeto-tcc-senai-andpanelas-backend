const configMessages = require('../modulo/configMessages')

const comunidadeUsuarioDAO = require('../../model/DAO/comunidade_usuario/comunidade_usuario')

const inserirNovaComunidadeUsuario = async function (comunidadeUsuario){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{

        let validar = await validarDados(comunidadeUsuario)

        if(validar){
            return validar
        }else{
            let result = await comunidadeUsuarioDAO.insertComunidadeUsuario(comunidadeUsuario)

            if(result){
                comunidadeUsuario.id = result
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message

                customMessage.DEFAULT_MESSAGE.response = comunidadeUsuario

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    }catch(error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarComunidadePorUsuario = async function(idUsuario){
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

const buscarUsuarioPorComunidade = async function (idComunidade){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        if (idComunidade == undefined || String(idComunidade).replaceAll('', '') == '' || idComunidade == '' || idComunidade == null || isNaN(idComunidade) || idComunidade <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_COMUNIDADE] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        }else{
            let result = await comunidadeUsuarioDAO.selectComunidadeByIdUsuario(idComunidade)
            if(result){
                if(result == false){
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }

                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response = comunidadeReceita

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    }catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirComunidadeUsuario = async function (idUsuario){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        let result = await comunidadeUsuarioDAO.deleteComunidadeByIdUsuario(idUsuario)

        if(result){
            return customMessage.SUCCESS_DELETED_ITEM
        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch(error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirUsuarioComunidade = async function (idComunidade){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        let result = await comunidadeUsuarioDAO.deleteUsuarioByIdComunidade(idComunidade)
        if (result) {
            return customMessage.SUCCESS_DELETED_ITEM
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }


    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
    
}

const validarDados = async function (comunidadeUsuario) {
    if (comunidadeUsuario.id_usuario == undefined || comunidadeUsuario.id_usuario == '' || comunidadeUsuario.id_usuario == null || comunidadeReceita.id_usuario <= 0 || isNaN(comunidadeUsuario.id_usuario)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (comunidadeUsuario.id_comunidade == undefined || comunidadeUsuario.id_comunidade == '' || comunidadeUsuario.id_comunidade == null || comunidadeUsuario.id_comunidade <= 0 || isNaN(comunidadeUsuario.id_comunidade)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_COMUNIDADE] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }

}

module.exports ={
    inserirNovaComunidadeUsuario,
    buscarComunidadePorUsuario,
    buscarUsuarioPorComunidade,
    excluirComunidadeUsuario,
    excluirUsuarioComunidade
}