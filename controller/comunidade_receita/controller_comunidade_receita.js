const configMessages = require('../modulo/configMessages')

const comunidadeReceitaDAO = require('../model/comunidadeReceitaDAO') 

const inserirNovaComunidadeReceita = async function (comunidadeReceita){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{

        let validar = await validarDados(comunidadeReceita)
        
        if (validar){
            return validar
        } else {
            let result = await comunidadeReceitaDAO.insertComunidadeReceita(comunidadeReceita)
            if (result){
                comunidadeReceita.id = result
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                
                customMessage.DEFAULT_MESSAGE.response = comunidadeReceita 

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    }catch(error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarComunidadeReceita = async function (idReceita){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        if (idReceita == undefined || String(idReceita).replaceAll('', '') == '' || idReceita == '' || idReceita == null || isNaN(idReceita) || idReceita <= 0){
            customMessage.ERROR_BAD_REQUEST.field = '[ID_RECEITA] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        }else{
            let result = await comunidadeReceitaDAO.selectComunidadeByIdReceita(idReceita)
            if(result){
                if(result == false){
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response = comunidadeReceita

                return customMessage.DEFAULT_MESSAGE
            } else{
                return customMessage.ERROR_INTERNAL_MODEL
            }
        }

    } catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarReceitaComunidade = async function (idComunidade){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        if (idComunidade == undefined || String(idComunidade).replaceAll('', '') == '' || idComunidade == '' || idComunidade == null || isNaN(idComunidade) || idComunidade <= 0){
            customMessage.ERROR_BAD_REQUEST.field = '[ID_COMUNIDADE] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        }else{
            let result = await comunidadeReceitaDAO.selectComunidadeByIdReceita(idComunidade)
            if(result){
                if(result == false){
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response = comunidadeReceita

                return customMessage.DEFAULT_MESSAGE
            } else{
                return customMessage.ERROR_INTERNAL_MODEL
            }
        }

    } catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirComunidadeReceita = async function(idReceita){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        let result = await comunidadeReceitaDAO.deleteComunidadeByIdReceita(idReceita)
        if(result){
            return customMessage.SUCCESS_DELETED_ITEM
        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    }catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirReceitaComunidade = async function(idComunidade){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        let result = await receitaComunidadeDAO.deleteReceitaByIdComunidade(idComunidade)
        if(result){
            return customMessage.SUCCESS_DELETED_ITEM
        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    }catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function (comunidadeReceita){
    if (comunidadeReceita.id_receita == undefined || comunidadeReceita.id_receita == '' || comunidadeReceita.id_receita == null || comunidadeReceita.id_receita <= 0 || isNaN(comunidadeReceita.id_receita)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_RECEITA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (comunidadeReceita.id_comunidade == undefined || comunidadeReceita.id_comunidade == '' || comunidadeReceita.id_comunidade == null || comunidadeReceita.id_comunidade <= 0 || isNaN(comunidadeReceita.id_comunidade)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_COMUNIDADE] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }    
   
}

