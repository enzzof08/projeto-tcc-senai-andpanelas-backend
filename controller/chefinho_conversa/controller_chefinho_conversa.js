const configMessages = require('../modulo/configMessages')

const chefinhoConversaDAO = require('../../model/DAO/chefinho_conversa/chefinho_conversa')

const inserirChefinhoConversa = async function(chefinhoConversa, contentType){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDados(chefinhoConversa)

            if(validar){
                return validar
            }else{
                let result = await chefinhoConversaDAO.insertChefinhoConversa(chefinhoConversa)

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

    }catch(error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarChefinhoConversa = async function(){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        let result = await chefinhoConversaDAO.selectAllChefinhoConversa()

        if(result){

            if(result){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCES_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCES_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.mensagem = result

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

const excluirChefinhoConversa = async function (id){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (id == undefined || id == '' || isNaN(id)) {
            return customMessage.ERROR_BAD_REQUEST
        }

        let result = await mensagemDAO.deleteMensagem(id)

        if (result) {
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_DELETED_ITEM.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_DELETED_ITEM.status_code
            customMessage.DEFAULT_MESSAGE.message = customMessage.SUCESS_DELETED_ITEM.message

            return customMessage.DEFAULT_MESSAGE
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function (mensagem){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(mensagem.conteudo == undefined || mensagem.conteudo == ''|| mensagem.conteudo == null){
        customMessage.ERROR_BAD_REQUEST.field = '[CONTEUDO] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if (chefinho_conversa.data_hora == undefined || chefinho_conversa.data_hora == "" || chefinho_conversa.data_hora == null || chefinho_conversa.data_hora.length != 15) {
        customMessage.ERROR_BAD_REQUEST.field = '[DATA_HORA]  INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if (chefinho_conversa.titulo == undefined || chefinho_conversa.titulo == ''|| chefinho_conversa.titulo == null){
        customMessage.ERROR_BAD_REQUEST.field = '[TITULO] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (chefinho_conversa.id_usuario == undefined || chefinho_conversa.id_usuario == '' || chefinho_conversa.id_usuario == null || chefinho_conversa.id_usuario <= 0 || isNaN(chefinho_conversa.id_usuario)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }      
}

module.exports ={
    inserirChefinhoConversa,
    listarChefinhoConversa,
    excluirChefinhoConversa
}