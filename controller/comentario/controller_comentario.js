const configMessages = require('../modulo/configMessages')

const comentarioDAO = require('../../model/DAO/comentario/comentario')

const inserirComentario = async function(comentario, contentType){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDados(comentario)

            if (validar) {
                return validar
            } else {

                let result = await comentarioDAO.insertComentario(comentario)

                if (result) {

                    comentario.id = result

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = comentario

                    return customMessage.DEFAULT_MESSAGE

                } else {
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }
            }

        } else {
            return customMessage.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarComentarioPelaReceita = async function(idReceita){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (idReceita == undefined || idReceita == null || idReceita == '' || isNaN(idReceita) || !Number.isInteger(Number(idReceita)) || idReceita <= 0) {

            customMessage.ERROR_BAD_REQUEST.field = '[ID_RECEITA] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST

        } else {

            let result = await comentarioDAO.selectComentariosPorReceita(idReceita)

            if (result) {

                    for (let comentario of result) {

                        comentario.usuario = {
                            id: comentario.id_usuario,
                            nome: comentario.nome,
                            username: comentario.username,
                            foto_perfil: comentario.foto_perfil
                        }

                        delete comentario.id_usuario
                        delete comentario.nome
                        delete comentario.username
                        delete comentario.foto_perfil

                    }

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.count = result.length
                    customMessage.DEFAULT_MESSAGE.response.comentarios = result

                    return customMessage.DEFAULT_MESSAGE


            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarComentario = async function(comentario, idComentario, idUsuario, contentType){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            if (comentario == undefined || comentario == null || comentario.comentario == undefined || comentario.comentario == null || typeof comentario.comentario != 'string' || comentario.comentario.trim() == '') {

                customMessage.ERROR_BAD_REQUEST.field = '[COMENTARIO] INVALIDO'
                return customMessage.ERROR_BAD_REQUEST

            } else if (idComentario == undefined || idComentario == null || idComentario == '' || isNaN(idComentario) || !Number.isInteger(Number(idComentario)) || idComentario <= 0) {

                customMessage.ERROR_BAD_REQUEST.field = '[ID_COMENTARIO] INVALIDO'
                return customMessage.ERROR_BAD_REQUEST

            } else if (idUsuario == undefined || idUsuario == null || idUsuario == '' || isNaN(idUsuario) || !Number.isInteger(Number(idUsuario)) || idUsuario <= 0) {

                customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVALIDO'
                return customMessage.ERROR_BAD_REQUEST

            } else {

                let dadosAtualizados = {
                    id: Number(idComentario),
                    id_usuario: Number(idUsuario),
                    comentario: comentario.comentario.trim()
                }

                let result = await comentarioDAO.updateComentario(dadosAtualizados)

                if (result) {

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATE_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATE_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATE_ITEM.message

                    return customMessage.DEFAULT_MESSAGE

                } else {
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }
            }

        } else {
            return customMessage.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirComentario = async function(idComentario, idUsuario){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (idComentario == undefined || idComentario == null || idComentario == '' || isNaN(idComentario) || !Number.isInteger(Number(idComentario)) || idComentario <= 0) {

            customMessage.ERROR_BAD_REQUEST.field = '[ID_COMENTARIO] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST

        } else if (idUsuario == undefined || idUsuario == null || idUsuario == '' || isNaN(idUsuario) || !Number.isInteger(Number(idUsuario)) || idUsuario <= 0) {

            customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST

        } else {

            let result = await comentarioDAO.deleteComentario(idComentario, idUsuario)

            if (result) {

                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_DELETED_ITEM.message

                return customMessage.DEFAULT_MESSAGE

            } else {
                return customMessage.ERROR_NOT_FOUND
            }
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// LISTAR QUANTIDADE DE COMENTARIOS POR RECEITA
const listarQtdComentariosReceita = async function(idReceita) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await comentarioDAO.selectQtdComentariosPorReceita(idReceita)

        if (result) {
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_RESPONSE.message
            customMessage.DEFAULT_MESSAGE.response = result

            return customMessage.DEFAULT_MESSAGE
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function(comentario){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (comentario == undefined || comentario == null) {
        customMessage.ERROR_BAD_REQUEST.field = '[COMENTARIO] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST

    } else if (comentario.comentario == undefined || comentario.comentario == null || typeof comentario.comentario != 'string' || comentario.comentario.trim() == '') {
        customMessage.ERROR_BAD_REQUEST.field = '[COMENTARIO] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST

    } else if (comentario.id_receita == undefined || comentario.id_receita == null || isNaN(comentario.id_receita) || !Number.isInteger(Number(comentario.id_receita)) || comentario.id_receita <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_RECEITA] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST

    } else if (comentario.id_usuario == undefined || comentario.id_usuario == null || isNaN(comentario.id_usuario) || !Number.isInteger(Number(comentario.id_usuario)) || comentario.id_usuario <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST

    } else {
        return false
    }
}

module.exports = {
    inserirComentario,
    buscarComentarioPelaReceita,
    atualizarComentario,
    excluirComentario,
    listarQtdComentariosReceita
}