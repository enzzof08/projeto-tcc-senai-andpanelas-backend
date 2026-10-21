const configMessages = require('../modulo/configMessages')

const statusDAO = require('../../model/DAO/status/status')

const listarStatus = async function(){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{

        let result = await statusDAO.selectAllStatus()

        if(result){

            if(result.length > 0){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.status = result

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_NOT_FOUND
            }
        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function(status){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(status.status == undefined || status.status == '' || status.status == null){
        customMessage.ERROR_BAD_REQUEST.field = '[STATUS] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else{
        return false
    }
}

module.exports = {
    listarStatus
}