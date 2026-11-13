const configMessages = require('../modulo/configMessages')

const comentarioDAO = require('../../model/DAO/comentario/comentario')

const inserirComentario =  async function(comentario, contentType){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDados(comentario)

            if(validar){
                return validar
            }else{
                let result = await comentarioDAO.insertComentario(comentario)

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

    }catch{
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarComentario = async function(comentario, id, contentType){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            let resultBuscarComentario = await buscarComentario(id)

            if(resultBuscarComentario.status){
                let validar = await validarDados(comentario)

                if(!validar){
                    comentario.id = Number(id)

                    let result = await comentarioDAO.updateComentario(comentario)
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
                return resultBuscarComentario
            }

        }else{
            return customMessage.ERROR_CONTENT_TYPE
        }

    }catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarComentarioPelaReceita = async function (idReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idReceita == undefined || String(idReceita).replaceAll(' ', '') == '' || idReceita == null || isNaN(idReceita) || idReceita <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_RECEITA] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        } else {
            let result = await comentarioDAO.selectComentariosPorReceita(idReceita)
            
            if (result) {
                if (result.length > 0) {
                    
                    for (let comentario of result) {
                        let resultUsuario = await controllerUsuario.buscarUsuario(comentario.id_usuario)
                        if (resultUsuario.status) {
                            comentario.usuario = resultUsuario.response.usuario
                            delete comentario.id_usuario
                        }
                    }

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.count = result.length
                    customMessage.DEFAULT_MESSAGE.response.comentarios = result

                    return customMessage.DEFAULT_MESSAGE
                } else {
                    return customMessage.ERROR_NOT_FOUND
                }
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirComentario = async function(id){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        let resultBuscarComentario = await buscarComentario(id)

        if (resultBuscarComentario.status){

            let result = await comentarioDAO.deleteComentario(id)

            if(result){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_DELETED_ITEM.message

                return customMessage.DEFAULT_MESSAGE

            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }

        }else{
            return resultBuscarComentario
        }

    }catch(error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function (comentario){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (comentario.comentario == undefined || comentario.comentario == '' || comentario.comentario == null) {
        customMessage.ERROR_BAD_REQUEST.field = '[COMENTARIO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if(comentario.id_receita == undefined || isNaN(comentario.id_receita) || comentario.id_receita.length < 0){
        customMessage.ERROR_BAD_REQUEST.field = '[ID_RECEITA] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if(comentario.id_usuario == undefined || isNaN(comentario.id_usuario) || comentario.id_usuario.length < 0){
        customMessage.ERROR_BAD_REQUEST.field = '[ID_RECEITA] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else{
        return false
    }
}

module.exports ={
    inserirComentario,
    atualizarComentario,
    buscarComentarioPelaReceita,
    excluirComentario
}