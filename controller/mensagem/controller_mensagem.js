const configMessages = require('../modulo/configMessages')

const mensagemDAO = require('../../model/DAO/mensagem/mensagem')

const inserirNovaMensagem = async function(mensagem, contentType){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDados(mensagem)

            if(validar){
                return validar
            }else{
                let result = await mensagemDAO.insertMensagem(mensagem)

                if(result){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCESS_CREATED_ITEM.message

                    return customMessage.DEFAULT_MESSAGE 
                }else{
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }
            }

        }else{
            return customMessage.ERROR_CONTENT_TYPE 
        }

    }catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
    
}

const listarMensagem = async function(){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        let result = await mensagemDAO.selectAllMensagem()

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

const excluirMensagem = async function (id){
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
    }else if (mensagem.data == undefined || mensagem.data == "" || mensagem.data == null || mensagem.data.length != 10) {
        customMessage.ERROR_BAD_REQUEST.field = '[DATA]  INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if (mensagem.tipo_remetente == undefined || mensagem.tipo_remetente == ''|| mensagem.tipo_remetente == null){
        customMessage.ERROR_BAD_REQUEST.field = '[TIPO_REMETENTE] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (mensagem.id_chefinho_conversa == undefined || mensagem.id_chefinho_conversa == '' || mensagem.id_chefinho_conversa == null || mensagem.id_chefinho_conversa <= 0 || isNaN(mensagem.id_chefinho_conversa)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_CHEFINHO_CONVERSA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }      
}

module.exports ={
    inserirNovaMensagem,
    listarMensagem,
    excluirMensagem
}