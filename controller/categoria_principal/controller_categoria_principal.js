const configMessages = require('../modulo/configMessages')

const categoriaPrincipalDAO = require('../../model/DAO/categoria_principal/categoria_principal')

const listarCategoriaPrincipal = async function(){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{

        let result = await categoriaPrincipalDAO.selectAllCategoriaPrincipal()

        if(result){

            if(result.length > 0){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.categoriaPrincipal = result

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_NOT_FOUND
            }
        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarCategoriaPrincipal = async function(id){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{

        if(id == undefined || String(id).replaceAll('', '') == '' || id == null || isNaN(id) || id <= 0){
            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        }else{

            let result = await categoriaPrincipalDAO.selectByIdCategoriaPrincipal(id)

            if(result){
                if(result.length > 0){

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.categoriaPrincipal = result
    
                    return customMessage.DEFAULT_MESSAGE
                }else{
                    return customMessage.ERROR_NOT_FOUND
                }

            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }

            
        }

    } catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function(categoriaPrincipal){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(categoriaPrincipal.categoria_principal == undefined || categoriaPrincipal.categoria_principal == '' || categoriaPrincipal.categoria_principal == null){
        customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else{
        return false
    }    
}

module.exports = {
    listarCategoriaPrincipal,
    buscarCategoriaPrincipal
}