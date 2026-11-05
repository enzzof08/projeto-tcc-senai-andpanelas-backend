const configMessages = require('../modulo/configMessages')

const seguidoresDAO = require('../../model/DAO/seguidores/seguidores')

const inserirNovoSeguidor = async function(seguidores, contentType){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{

        if(validar){
            return validar
        }else{

            let result = await seguidoresDAO.insertSeguidores(seguidores)

            if(result){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }

        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarSeguidores = async function(){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        let result = await seguidoresDAO.selectAllSeguidores()

        if(result){

            if(result.length > 0){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.seguidores = result

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

const buscarSeguidores = async function(id){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{

        if(id == undefined || String(id).trim() == '' || id == null || isNaN(id) || id <= 0){
            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        }else{
            let result = await seguidoresDAO.selectByIdSeguidores(id)

            if(result){

                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.seguidores = result

                    return customMessage.DEFAULT_MESSAGE
                }else{
                    return customMessage.ERROR_NOT_FOUND
                }

            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirSeguidores = async function (id){
    let customMessage = JSON.parse(JSON.stringify(messages))

    try{
        let resultBuscarSeguidores = await buscarSeguidores(id)

        if (resultBuscarSeguidores.status){
            let result = await seguidoresDAO.deleteSeguidores(id)
            if(result){
                customMenssagen.DEFAULT_MESSAGE.status = customMenssagen.SUCCESS_DELETE_ITEM.status
                customMenssagen.DEFAULT_MESSAGE.status_code = customMenssagen.SUCCESS_DELETE_ITEM.status_code
                customMenssagen.DEFAULT_MESSAGE.message = customMenssagen.SUCCESS_DELETE_ITEM.message

                return customMenssagen.DEFAULT_MESSAGE

            }else{
                return customMenssagen.ERROR_INTERNAL_SERVER_MODEL
            }

        } else {
            return resultBuscarFilme
        }

    } catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function(seguidores){

    let customMenssagen = JSON.parse(JSON.stringify(configMessages))

    if(seguidores.id_seguindo == undefined || isNaN(seguidores.id_seguindo)){
        customMenssagen.ERROR_BAD_REQUEST.field = '[ID_SEGUINDO] INVALIDO'
        return customMenssagen.ERROR_BAD_REQUEST
    }else if(seguidores.id_seguidor == undefined || isNaN(seguidores.id_seguidor)){
        customMenssagen.ERROR_BAD_REQUEST.field = '[ID_SEGUIDOR] INVALIDO'
        return customMenssagen.ERROR_BAD_REQUEST
    }else{
        return false
    }
}

module.exports ={
    inserirNovoSeguidor,
    listarSeguidores,
    buscarSeguidores,
    excluirSeguidores
}