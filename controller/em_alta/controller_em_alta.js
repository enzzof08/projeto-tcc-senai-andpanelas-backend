const configMessages = require('../modulo/configMessages')

const emAltaDAO = require('../../model/DAO/em_alta/em_alta')

const inserirNovoEmAlta = async function(emAlta, contentType){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDados(emAlta)

            if(validar){
                return validar
            }else{
                let result = await emAltaDAO.insertEmAlta(emAlta)

                if(result){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message

                    return customMessage.DEFAULT_MESSAGE
                }else{
                    return customMessage.ERROR_CONTENT_TYPE
                }

            }
        }

    } catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const atualizarEmAlta = async function(emAlta, id, contentType){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let resultBuscarEmAlta = await buscarEmAlta(id)

            if(resultBuscarEmAlta.status){

                let validar = await validarDados(emAlta)

                if(!validar){

                    emAlta.id = Number(id)

                    let result = await emAltaDAO.updateEmAlta(emAlta)
                    if(result){
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message

                        return customMessage.DEFAULT_MESSAGE
                    }else{
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL
                    }
                }else{
                    return validar
                }
            }else{
                return resultBuscarEmAlta
            }
        }else{
            return customMessage.ERROR_CONTENT_TYPE
        }
    }catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarEmAlta = async function(){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{

        let result = await emAltaDAO.selectAllEmAlta()

        if(result){

            if(result.length > 0){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.emAlta = result

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_NOT_FOUND
            }
        
        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    }catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirEmAlta = async function(id){
    let customMessage = JSON.parse(JSON.stringify(messages))

    try {

        let resultBuscarEmAlta = await buscarEmAlta(id)

        if(resultBuscarEmAlta.status){
            let result = await emAltaDAO.deleteEmAlta(id)
            if(result){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_DELETED_ITEM.message

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }else{
            return resultBuscarEmAlta
        }
    }catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}