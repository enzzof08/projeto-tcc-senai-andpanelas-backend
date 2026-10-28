const configMessages = require('../modulo/configMessages')

const comunidadeDAO = require('../../model/DAO/comunidade/comunidade')

const controllerCategoriaPrincipal = require('../categoria_principal/controller_categoria_principal')

const inserirNovaComunidade = async function (comunidade, contentType){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDados(comunidade)

            if(validar){
                return validar
            }else{

                let result = await comunidadeDAO.insertComunidade(comunidade)

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

    }catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarComunidade = async function(comunidade, id, contentType){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let resultBuscarComunidade = await buscarComunidade(id)

            if(resultBuscarComunidade.status){

                let validar = await validarDados(comunidade)

                if(!validar){

                    comunidade.id = Number(id)

                    let result = await comunidadeDAO.updateComunidade(comunidade)
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
                return resultBuscarComunidade
            }
            
        }

    }catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarComunidade = async function(){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        let result = await comunidadeDAO.selectAllComunidade()

        if(result){
            if(result.length > 0){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.comunidade = result

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

const buscarComunidade = async function(id){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        if(id == undefined || String (id).replaceAll('', '') == '' || id == null || isNaN(id) || id <= 0){
            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        }else{
            let result = await comunidadeDAO.selectComunidadeById(id)

            if(result){
                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.comunidade = result

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

const excluirComunidade = async function(){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        let resultBuscarComunidade = await buscarComunidade(id)

        if(resultBuscarComunidade.status){
            let result = await comunidadeDAO.deleteComunidade(id)
            if(result){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_DELETED_ITEM.message

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }else{
            return resultBuscarComunidade
        }

    }catch(error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function(comunidade){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(comunidade.foto_url == undefined || comunidade.foto_url == '' || comunidade.foto_url == null){
        customMessage.ERROR_BAD_REQUEST.field = '[FOTO URL] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if(comunidade.nome == undefined || comunidade.nome == '' || comunidade.nome == null){
        customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if(comunidade.banner_url == undefined || comunidade.banner_url == '' || comunidade.banner_url == null){
        customMessage.ERROR_BAD_REQUEST.field = '[BANNER URL] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if(comunidade.id_categoria_principal == undefined || isNaN(comunidade.id_categoria_principal)){
        customMessage.ERROR_BAD_REQUEST.field = '[ID CATEGORIA PRINCIPAL] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if(comunidade.descricacao == undefined || comunidade.descricacao == '' || comunidade.descricacao == null){
        customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else{
        return false
    }        
}

module.exports = {
    inserirNovaComunidade,
    atualizarComunidade,
    listarComunidade,
    buscarComunidade,
    excluirComunidade
}