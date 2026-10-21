const configMessages = require('../modulo/configMessages')

const tagDAO = require('../../model/DAO/tag/tag')

const inserirNovaTag = async function(tag, contentType){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            
            let validar = await validarDados(tag)

            if(validar){
                return validar
            }else{
                let result = await tagDAO.insertTag(tag)

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

    } catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarTag = async function(tag, id, contentType){
    
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let resultBuscarTag = await buscarTag(id)

            if(resultBuscarTag.status){

                let validar = await validarDados(tag)

                if(!validar){

                    tag.id = Number(id)

                    let result = await tagDAO.updateTag(tag)
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
                return resultBuscarTag
            }

        }else{
            return customMessage.ERROR_CONTENT_TYPE
        }

    } catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarTag = async function(){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{

        let result = await tagDAO.selectAllTag()

        if(result){

            if(result.length > 0){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.tag = result

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

const buscarTag = async function(id){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{

        if(id == undefined || String(id).replaceAll('', '') == '' || id == null || isNaN(id) || id <= 0){
            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        }else{

            let result = await tagDAO.selectByIdTag(id)

            if(result){

                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.tag = result

                    return customMessage.DEFAULT_MESSAGE
                }else{
                    return customMessage.ERROR_NOT_FOUND
                }
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    }catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function(tag){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(tag.nome_tag == undefined || tag.nome_tag == '' || tag.nome_tag == null){
        customMessage.ERROR_BAD_REQUEST.field = '[NOME_TAG] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else{
        return false
    }
}