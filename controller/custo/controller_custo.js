const configMessages = require('../modulo/configMessages')

const custoDAO = require('../../model/DAO/custo/custo')

const listarCategoria = async function () {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await custoDAO.selectAllCusto()


        if (result) {

            if (result.length > 0) {
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.custo = result

                return customMessage.DEFAULT_MESSAGE
            } else {
                return customMessage.ERROR_NOT_FOUND
            }
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }


    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function(custo){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(custo.tipo_custo == undefined || custo.tipo_custo == '' || custo.tipo_custo == null){
        customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST

    }else{
        return false
    }
}

module.exports = {
    listarCategoria
}