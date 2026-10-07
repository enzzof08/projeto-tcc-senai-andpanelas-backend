const configMessages = require('../modulo/configMessages')

const categoriaDAO = require('../../model/DAO/categoria/categoria')

const inserirNovaCategoria = async function(categoria, contentType){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDados(categoria)

            if(validar){
                return validar
            }else{
                let result = await categoriaDAO.insertCategoria(categoria)

                if(result){
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

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }


}

const listarCategoria = async function(){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await categoriaDAO.selectAllCategoria()

        if(result){

            if(result.length > 0){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                configMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.categoria = result

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

const validarDados = async function(categoria){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(categoria == undefined || categoria == '' || categoria == null){
        customMessage.ERROR_BAD_REQUEST.field = '[CATEGORIA] INVALIDA'
        return customMessage.ERROR_BAD_REQUEST
    }else{
        return false
    }
}

module.exports = {
    inserirNovaCategoria,
    listarCategoria
}