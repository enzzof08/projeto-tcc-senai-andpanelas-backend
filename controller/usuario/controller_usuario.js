const configMessages = require('../modulo/configMessages.js')

const userDAO = require('../../model/DAO/usuario/usuario.js')

const inserirNovoUsuario = async function (dados, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDados(dados)

            if (validar) {
                return validar
            } else {
                let result = await genDAO.insertGenero(await tratarDados(dados))
                if (result) {
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = dados

                    return customMessage.DEFAULT_MESSAGE //201
                } else {
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }
        } else {
            return customMessage.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}


const validarDados = async function (usuario) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (usuario.nome == undefined || usuario.nome == '' || usuario.nome == null || usuario.nome.length > 150) {
        customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.username == undefined || usuario.username == '' || usuario.username == null || usuario.username.length > 20) {
        customMessage.ERROR_BAD_REQUEST.field = '[USERNAME] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.email == undefined || usuario.email == '' || usuario.email == null || usuario.email.length > 256 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email)) {
        customMessage.ERROR_BAD_REQUEST.field = '[EMAIL] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.senha == undefined || usuario.senha == '' || usuario.senha == null || usuario.senha.length > 15 ) {
        customMessage.ERROR_BAD_REQUEST.field = '[SENHA] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else if ( usuario.foto_perfil != undefined && usuario.foto_perfil != null && usuario.foto_perfil != '' && ( usuario.foto_perfil.length > 2000 || !/^https?:\/\/.+/.test(usuario.foto_perfil)))  {
        customMessage.ERROR_BAD_REQUEST.field = '[FOTO DE PERFIL] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    }else if (usuario.data_nascimento == undefined || usuario.data_nascimento == null || usuario.data_nascimento == '' || !/^\d{4}-\d{2}-\d{2}$/.test(usuario.data_nascimento) || isNaN(new Date(usuario.data_nascimento).getTime())) {
        customMessage.ERROR_BAD_REQUEST.field = '[DATA DE NASCIMENTO] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    }
     else {
        return false
    }
}

//Função para tratar os dados a serem inseridos
const tratarDados = async function (usuario) {
    //Tratamento para eliminar a chegada da aspas ('') como caracter inválido
    usuario.nome = usuario.nome.replaceAll("'", "")
    usuario.data_nascimento = usuario.data_nascimento.replaceAll("'", "")
    usuario.username = usuario.username.replaceAll("'", '')
    usuario.senha = usuario.senha.replaceAll("'", "")
    usuario.data_nascimento = usuario.data_nascimento.replaceAll("'", "")

    return usuario
}