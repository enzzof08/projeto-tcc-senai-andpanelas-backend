const configMessages = require('../modulo/configMessages.js')

const dificuldadeDAO = require('../../model/DAO/dificuldade/dificuldade.js')

const listarDificuldade = async function(){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        let result = await dificuldadeDAO.selectAllDificuldade()

        if(result){

            if(result.length > 0){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.dificuldade = result

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

const validarDados = async function(dificuldade){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(dificuldade == undefined || dificuldade == '' || dificuldade == null){
        customMessage.ERROR_BAD_REQUEST.field = '[DIFICULDADE] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else{
        return false
    } 
}

module.exports = {
    listarDificuldade
}