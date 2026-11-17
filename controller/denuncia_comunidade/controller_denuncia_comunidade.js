const configMessages = require('../modulo/configMessages')

const denunciaComunidadeDAO = require('../../model/DAO/denuncia_comunidade/denuncia_comunidade')

const inserirDenunciaComunidade = async function (denunciaComunidade){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        let validar = await validarDados(denunciaComunidade)

        if(validar){
            return validar
        }else{
            let result = await denunciaComunidadeDAO.insertDenunciaComunidade(denunciaComunidade)
            if(result){
                denunciaComunidade.id = result
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                customMessage.DEFAULT_MESSAGE.response = denunciaComunidade

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_INTERNAL_MODEL
            }
            
        }

    }catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarDenunciaByIdComunidade = async function (idComunidade){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        if(idComunidade == undefined || String(idComunidade).replaceAll('', '') == ''|| idComunidade == '' || idComunidade == null || isNaN(idComunidade) || idComunidade <= 0){
            customMessage.ERROR_BAD_REQUEST.field = '[ID_COMUNIDADE] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        }else{
            let result = await denunciaComunidadeDAO.selectDenunciaByIdComunidade(idComunidade)
            if(result){
                if(result === false){
                    return customMessage.ERROR_INTERNAL_MODEL
                }
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.usuario = result

                return customMessage.DEFAULT_MESSAGE

            }else{
                return customMessage.ERROR_INTERNAL_MODEL
            }
        }

    }catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const buscarComunidadeByIdDenuncia = async function(idDenuncia){
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    try{
        if(idDenuncia == undefined || String(idDenuncia).replaceAll('', '') == ''|| idDenuncia == ''|| idDenuncia == null || isNaN(idDenuncia) || idDenuncia <= 0){
            customMessage.ERROR_BAD_REQUEST.field = '[ID_DENUNCIA] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        }else{
            let result = await denunciaComunidadeDAO.selectComunidadeByIdDenuncia(idDenuncia)
            if (result) {
                if (result === false){
                    return customMessage.ERROR_INTERNAL_MODEL
                }
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.denuncia = result

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    } catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function (denunciaComunidade){
    if (denunciaComunidade.id_comunidade == undefined || denunciaComunidade.id_comunidade == '' || denunciaComunidade.id_comunidade == null || denunciaComunidade.id_comunidade <= 0 || isNaN(denunciaComunidade.id_comunidade)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_COMUNIDADE] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (denunciaUsuario.id_denuncia == undefined || denunciaUsuario.id_denuncia == '' || denunciaUsuario.id_denuncia == null || denunciaUsuario.id_denuncia <= 0 || isNaN(denunciaUsuario.id_denuncia)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_DENUNCIA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
    
}

module.exports = {
    inserirDenunciaComunidade,
    buscarComunidadeByIdDenuncia,
    buscarDenunciaByIdComunidade
}