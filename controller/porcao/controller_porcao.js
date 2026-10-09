const configMessages = require('../modulo/configMessages')

const porcaoDAO = require('../../model/DAO/porcao/porcao')

const listarPorcao = async function(){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await porcaoDAO.selectallPorcao()

        if(result){

            if(result.length > 0){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCES_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCES_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.porcao = result

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

const buscarPorcao = async function(id){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if(id == undefined || String(id).replaceAll('', '') == '' || id == null || id <= 0){
            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST 
        }else{
            let result = await porcaoDAO.selectByIdPorcao(id)

            if(result){

                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCES_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCES_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.porcao = result

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

const validarDados = async function(porcao){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(porcao.numero_porcoes == undefined || isNaN(porcao.numero_porcoes)){
        customMessage.ERROR_BAD_REQUEST.field = '[NUMERO DE PORCOES] INVALIDO'
    }else{
        return false
    }
}

module.exports = {
    listarPorcao,
    buscarPorcao
}