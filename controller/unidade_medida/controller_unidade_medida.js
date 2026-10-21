const configMessages = require('../modulo/configMessages.js')

const unidadeDAO = require('../../model/DAO/unidade_medida/unidade_medida.js')

const listarUnidadeMedida = async function(){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        let result = await unidadeDAO.selectALLUnidadeMedida()

        if(result){

            if(result.length > 0){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.unidade_medida = result

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_NOT_FOUND
            }
        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }
    }catch(error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarUnidadeMedida = async function(id){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if(id == undefined || String(id).replaceAll('', '') == '' || id == null || id <= 0){
            customMessage.ERROR_BAD_REQUEST.field = '[ID_UNIDADE_MEDIDA] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST 
        }else{
            let result = await unidadeDAO.selectByIdUnidadeMedida(id)

            if(result){

                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCES_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCES_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.unidade_medida = result

                    return customMessage.DEFAULT_MESSAGE
                }else{
                    return customMessage.ERROR_NOT_FOUND
                }
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch(error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    listarUnidadeMedida,
    buscarUnidadeMedida
}