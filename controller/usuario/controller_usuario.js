const configMessages = require('../modulo/configMessages.js')

const userDAO = require('../../model/DAO/usuario/usuario.js')

const bcrypt = require('bcrypt')

const inserirNovoUsuario = async function (dados, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDados(dados)

            if (validar) {
                return validar
            } else {

                const senhaHash = await bcrypt.hash(dados.senha, 10)
                dados.senha = senhaHash

                let result = await userDAO.insertUsuario(await tratarDados(dados))
                if (result) {
                    dados.senha = undefined
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = dados

                    return customMessage.DEFAULT_MESSAGE
                } else {
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }
            }
        } else {
            return customMessage.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const loginUsuario = async function (dados, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDadosLogin(dados)

            if (validar) {
                return validar
            } else {
                let result = await userDAO.selectUsuarioByEmail(dados.email)
                if (result) {

                    const senhaValida = await bcrypt.compare(dados.senha, result.senha)

                    if (senhaValida) {
                        dados.senha = undefined
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_RESPONSE.message
                        customMessage.DEFAULT_MESSAGE.response = {
                            id: result.id,
                            nome: result.nome,
                            username: result.username,
                            email: result.email
                        }

                        return customMessage.DEFAULT_MESSAGE //201
                    } else {
                        return customMessage.ERROR_UNAUTHORIZED
                    }
                } else {
                    return customMessage.ERROR_UNAUTHORIZED //500
                }
            }
        } else {
            return customMessage.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const atualizarUsuario = async function (dados, id, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase().includes('APPLICATION/JSON')) {

            let usuario = await userDAO.selectUsuarioById(id)

            if (usuario) {

                let dadosAtualizados = {
                    nome: dados.nome === undefined ? usuario.nome : dados.nome,
                    username: dados.username === undefined ? usuario.username : dados.username,
                    descricao: dados.descricao === undefined ? usuario.descricao : dados.descricao,
                    banner_url: dados.banner_url === undefined ? usuario.banner_url : dados.banner_url,
                    foto_perfil: dados.foto_perfil === undefined ? usuario.foto_perfil : dados.foto_perfil
                }

                let validar = await validarDadosAtualizacao(dadosAtualizados)

                if (validar) {
                    return validar
                } else {

                    dadosAtualizados.id = id

                    let result = await userDAO.updateUsuario(dadosAtualizados)

                    if (result) {
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATE_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATE_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATE_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = dadosAtualizados

                        return customMessage.DEFAULT_MESSAGE // 200
                    } else {
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL // 500
                    }
                }

            } else {
                return customMessage.ERROR_NOT_FOUND // 404
            }

        } else {
            return customMessage.ERROR_CONTENT_TYPE // 415
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}



const buscarUsuario = async function (id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await userDAO.selectUsuarioById(id)

        if (result) {

            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_RESPONSE.message
            customMessage.DEFAULT_MESSAGE.response = result

            return customMessage.DEFAULT_MESSAGE

        } else {
            return customMessage.ERROR_NOT_FOUND
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
    } else if (usuario.senha == undefined || usuario.senha == '' || usuario.senha == null || usuario.senha.length > 15) {
        customMessage.ERROR_BAD_REQUEST.field = '[SENHA] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.foto_perfil != undefined && usuario.foto_perfil != null && usuario.foto_perfil != '' && (usuario.foto_perfil.length > 2000 || !/^https?:\/\/.+/.test(usuario.foto_perfil))) {
        customMessage.ERROR_BAD_REQUEST.field = '[FOTO DE PERFIL] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.data_nascimento == undefined || usuario.data_nascimento == null || usuario.data_nascimento == '' || !/^\d{4}-\d{2}-\d{2}$/.test(usuario.data_nascimento) || isNaN(new Date(usuario.data_nascimento).getTime())) {
        customMessage.ERROR_BAD_REQUEST.field = '[DATA DE NASCIMENTO] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    }
    else {
        return false
    }
}

const validarDadosLogin = async function (usuario) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    if (usuario.email == undefined || usuario.email == '' || usuario.email == null || usuario.email.length > 256 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email)) {
        customMessage.ERROR_BAD_REQUEST.field = '[EMAIL] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.senha == undefined || usuario.senha == '' || usuario.senha == null || usuario.senha.length > 15) {
        customMessage.ERROR_BAD_REQUEST.field = '[SENHA] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}


const validarDadosAtualizacao = async function (usuario) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (usuario.nome == undefined || usuario.nome == null || typeof usuario.nome != 'string' || usuario.nome.trim() == '' || usuario.nome.length > 150) {
        customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.username == undefined || usuario.username == null || typeof usuario.username != 'string' || usuario.username.trim() == '' || usuario.username.length > 20) {
        customMessage.ERROR_BAD_REQUEST.field = '[USERNAME] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.descricao != undefined && usuario.descricao != null && (typeof usuario.descricao != 'string' || usuario.descricao.length > 200)) {
        customMessage.ERROR_BAD_REQUEST.field = '[DESCRIÇÃO] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.banner_url != undefined && usuario.banner_url != null && usuario.banner_url != '' && (typeof usuario.banner_url != 'string' || usuario.banner_url.length > 2000 || !/^https?:\/\/.+/i.test(usuario.banner_url))) {
        customMessage.ERROR_BAD_REQUEST.field = '[BANNER] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.foto_perfil != undefined && usuario.foto_perfil != null && usuario.foto_perfil != '' && (typeof usuario.foto_perfil != 'string' || usuario.foto_perfil.length > 2000 || !/^https?:\/\/.+/i.test(usuario.foto_perfil))) {
        customMessage.ERROR_BAD_REQUEST.field = '[FOTO DE PERFIL] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}

//Função para tratar os dados a serem inseridos
const tratarDados = async function (usuario) {
    usuario.nome = usuario.nome.replaceAll("'", "")
    usuario.data_nascimento = usuario.data_nascimento.replaceAll("'", "")
    usuario.username = usuario.username.replaceAll("'", '')
    usuario.senha = usuario.senha.replaceAll("'", "")
    usuario.email = usuario.email.replaceAll("'", "")

    return usuario
}

module.exports = {
    inserirNovoUsuario,
    loginUsuario,
    buscarUsuario,
    atualizarUsuario
}