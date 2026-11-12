const configMessages = require('../modulo/configMessages')

const denunciaDAO = require('../../model/DAO/denuncia/denuncia.js')

const controllerChefinho = require('../chefinho/controller_chefinho.js')

const inserirDenuncia = async function(denuncia, contentType){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDados(denuncia)

            if(validar){
                return validar
            }else{

                let result = await denunciaDAO.insertDenuncia(denuncia)

                if(denuncia){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message

                    return customMessage.DEFAULT_MESSAGE
                }else{
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }

            }

        }else{
            return customMessage.ERROR_CONTENT_TYPE
        }

    } catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    } 

}

const listarDenuncia = async function(){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{

        let result = await denunciaDAO.selectAllDenuncia()

        if(result){

            if(result.length > 0){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.denuncia = result

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_NOT_FOUND
            }
            
        }

    } catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function(denuncia){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(denuncia.data == undefined || denuncia.data == ''|| denuncia.data == null || denuncia.data.length != 10){
        customMessage.ERROR_BAD_REQUEST.field = '[DATA] INVALIDA'
        return customMessage.ERROR_BAD_REQUEST
    }else if(denuncia.motivo == undefined || denuncia.motivo == ''|| denuncia.motivo == null){
        customMessage.ERROR_BAD_REQUEST.field = '[MOTIVO] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if(denuncia.detalhe || denuncia.detalhe == ''|| denuncia.detalhe == null){
        customMessage.ERROR_BAD_REQUEST.field = '[DETALHE] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if(denuncia.id_usuario == undefined || isNaN(denuncia.id_usuario) || denuncia.id_usuario.length > 5){
        customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else{
        return false
    }
}

const inserirDenunciaComunidade = async function (idComunidade, dados, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() != 'APPLICATION/JSON') {
            return customMessage.ERROR_CONTENT_TYPE
        }

        let motivo = typeof dados.motivo == 'string' ? dados.motivo.trim() : ''
        let detalhe = typeof dados.detalhe == 'string' && dados.detalhe.trim() != '' ? dados.detalhe.trim() : null

        if (isNaN(idComunidade) || motivo == '' || motivo.length > 50 || (detalhe && detalhe.length > 200) || !dados.id_usuario || isNaN(dados.id_usuario)) {
            return customMessage.ERROR_BAD_REQUEST
        }

        let comunidade = await denunciaDAO.selectComunidadeById(idComunidade)

        if (!comunidade) {
            return customMessage.ERROR_NOT_FOUND
        }

        await denunciaDAO.insertDenunciaComunidade(idComunidade, { motivo, detalhe, id_usuario: dados.id_usuario })

        let total = await denunciaDAO.selectTotalDenunciasComunidade(idComunidade)

        let apagada = false

        if (total > 15) {
            await denunciaDAO.deleteComunidadeComDenuncias(idComunidade)
            apagada = true
        } else if (total > 10) {
            let apagar = await controllerChefinho.avaliarComunidade(comunidade, motivo, detalhe)

            if (apagar === true) {
                await denunciaDAO.deleteComunidadeComDenuncias(idComunidade)
                apagada = true
            }
        }

        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
        customMessage.DEFAULT_MESSAGE.response = { total_denuncias: total, comunidade_apagada: apagada }

        return customMessage.DEFAULT_MESSAGE
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirDenuncia,
    listarDenuncia,
    inserirDenunciaComunidade
}