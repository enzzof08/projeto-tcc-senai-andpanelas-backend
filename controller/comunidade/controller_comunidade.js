const configMessages = require('../modulo/configMessages')

const comunidadeDAO = require('../../model/DAO/comunidade/comunidade')

const controllerCategoriaPrincipal = require('../categoria_principal/controller_categoria_principal')
const controllerComunidadeUsuario = require('../comunidade_usuario/controller_comunidade_usuario.js')
const comunidadeUsuarioDAO = require('../../model/DAO/comunidade_usuario/comunidade_usuario.js')
const comunidadeReceitaDAO = require('../../model/DAO/comunidade_receita/comunidade_receita.js')

const inserirNovaComunidade = async function (comunidade, idUsuario, contentType) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDados(comunidade)

            if (validar) {
                return validar
            } else {

                let result = await comunidadeDAO.insertComunidade(await tratarDados(comunidade))

                if (result) {

                    // Associa o criador à comunidade
                    let resultComunidadeUsuario = await controllerComunidadeUsuario.inserirNovaComunidadeUsuario(
                        idUsuario,
                        result,
                        true
                    )

                    if (!resultComunidadeUsuario.status) {
                        return resultComunidadeUsuario
                    }

                    comunidade.id = result

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = comunidade

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

const atualizarComunidade = async function (comunidade, idUsuario, idComunidade, contentType) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let resultBuscarComunidade = await comunidadeDAO.selectComunidadeById(idComunidade)

            if (resultBuscarComunidade === false) {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }

            if (!resultBuscarComunidade || resultBuscarComunidade.length == 0) {
                return customMessage.ERROR_NOT_FOUND
            }

            let resultCriador = await controllerComunidadeUsuario.buscarCriadorPorComunidade(idComunidade)

            if (!resultCriador.status) {
                return resultCriador
            }

            // Verifica se o usuário logado é o criador
            if (Number(resultCriador.response.id) !== Number(idUsuario)) {
                customMessage.ERROR_FORBIDDEN.field = '[COMUNIDADE] SOMENTE O CRIADOR PODE EDITAR'
                return customMessage.ERROR_FORBIDDEN
            }

            // Valida os dados da comunidade
            let validar = await validarDados(comunidade)

            if (!validar) {

                comunidade.id = Number(idComunidade)

                let result = await comunidadeDAO.updateComunidade(await tratarDados(comunidade))

                if (result) {
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATE_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATE_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATE_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = comunidade

                    return customMessage.DEFAULT_MESSAGE

                } else {
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }

            } else {
                return validar
            }

        } else {
            return customMessage.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarComunidade = async function (idUsuario) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await comunidadeDAO.selectAllComunidade()




        if (result) {
            if (result.length > 0) {
                delete result[0].id_categoria_principal

                if (idUsuario != undefined) {

                    for (comunidade of result) {

                        let resultMembros = await comunidadeUsuarioDAO.selectQuantidadeMembrosPorComunidade(comunidade.id)

                        let resultReceitas = await comunidadeReceitaDAO.selectQuantidadeReceitasPorComunidade(comunidade.id)

                        comunidade.qtd_membros = resultMembros
                        comunidade.qtd_receitas = resultReceitas


                        let resultCriador = await controllerComunidadeUsuario.buscarCriadorPorComunidade(comunidade.id)

                        if (resultCriador.status) {
                            result[0].criador = resultCriador.response
                        } else {
                            return resultCriador
                        }

                        result[0].sou_criador = false

                        if (Number(idUsuario) == Number(resultCriador.response.id)) {
                            result[0].sou_criador = true
                        }

                        let resultParticipando = await controllerComunidadeUsuario.verificarComunidadeUsuario(idUsuario, comunidade.id)
                        if (resultParticipando.status) {
                            comunidade.participando = resultParticipando.response.participando
                        } else
                            return resultUsuario
                    }
                }

                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.comunidade = result

                return customMessage.DEFAULT_MESSAGE
            } else {
                return customMessage.ERROR_NOT_FOUND
            }
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarComunidade = async function (idUser, idComunidade) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idComunidade == undefined || String(idComunidade).replaceAll('', '') == '' || idComunidade == null || isNaN(idComunidade) || idComunidade <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_COMUNIDADE] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST

        } else if (idUser !== undefined && (idUser == null || idUser == '' || isNaN(idUser) || !Number.isInteger(Number(idUser)) || idUser <= 0 || String(idComunidade).replaceAll('', '') == '')) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST

        } else {
            let result = await comunidadeDAO.selectComunidadeById(idComunidade)

            if (result) {

                if (result.length > 0) {

                    for (comunidade of result) {
                        let resultMembros = await comunidadeUsuarioDAO.selectQuantidadeMembrosPorComunidade(idComunidade)

                        let resultReceitas = await comunidadeReceitaDAO.selectQuantidadeReceitasPorComunidade(idComunidade)

                        comunidade.qtd_membros = resultMembros
                        comunidade.qtd_receitas = resultReceitas

                        delete result[0].id_categoria_principal

                        let resultCriador = await controllerComunidadeUsuario.buscarCriadorPorComunidade(idComunidade)

                        if (resultCriador.status) {
                            result[0].criador = resultCriador.response
                        } else {
                            return resultCriador
                        }

                        // Verifica se o usuário logado é o criador
                        if (idUser != undefined) {
                            result[0].sou_criador = false

                            if (Number(idUser) == Number(resultCriador.response.id)) {
                                result[0].sou_criador = true
                            }

                            let resultParticipando = await controllerComunidadeUsuario.verificarComunidadeUsuario(idUser, comunidade.id)
                            if (resultParticipando.status) {
                                comunidade.participando = resultParticipando.response.participando
                            } else
                                return resultParticipando
                        }
                    }

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.comunidade = result

                    return customMessage.DEFAULT_MESSAGE
                } else {
                    return customMessage.ERROR_NOT_FOUND
                }
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const excluirComunidade = async function (idUsuario, idComunidade) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Busca a comunidade
        let resultBuscarComunidade = await comunidadeDAO.selectComunidadeById(idComunidade)

        if (resultBuscarComunidade === false) {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

        if (resultBuscarComunidade.length == 0) {
            return customMessage.ERROR_NOT_FOUND
        }

        // Busca o criador da comunidade
        let resultCriador = await controllerComunidadeUsuario.buscarCriadorPorComunidade(idComunidade)

        if (!resultCriador.status) {
            return resultCriador
        }

        // Verifica se o usuário logado é o criador
        if (Number(resultCriador.response.id) !== Number(idUsuario)) {

            customMessage.ERROR_FORBIDDEN.field = '[COMUNIDADE] SOMENTE O CRIADOR PODE EXCLUIR'

            return customMessage.ERROR_FORBIDDEN

        }

        // Exclui a comunidade
        let result = await comunidadeDAO.deleteComunidade(idComunidade)

        if (result) {

            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETED_ITEM.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
            customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_DELETED_ITEM.message

            return customMessage.DEFAULT_MESSAGE

        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// const excluirComunidade = async function (id) {
//     let customMessage = JSON.parse(JSON.stringify(configMessages))

//     try {
//         let resultBuscarComunidade = await buscarComunidade(id)

//         if (resultBuscarComunidade.status) {
//             let result = await comunidadeDAO.deleteComunidade(id)
//             if (result) {
//                 customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETED_ITEM.status
//                 customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
//                 customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_DELETED_ITEM.message

//                 return customMessage.DEFAULT_MESSAGE
//             } else {
//                 return customMessage.ERROR_INTERNAL_SERVER_MODEL
//             }
//         } else {
//             return resultBuscarComunidade
//         }

//     } catch (error) {
//         return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
//     }
// }

const validarDados = async function (comunidade) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (comunidade.foto_url == undefined || comunidade.foto_url == '' || comunidade.foto_url == null) {
        customMessage.ERROR_BAD_REQUEST.field = '[FOTO URL] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (comunidade.nome == undefined || comunidade.nome == '' || comunidade.nome == null) {
        customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (comunidade.banner_url == undefined || comunidade.banner_url == '' || comunidade.banner_url == null) {
        customMessage.ERROR_BAD_REQUEST.field = '[BANNER URL] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (comunidade.id_categoria_principal == undefined || isNaN(comunidade.id_categoria_principal)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID CATEGORIA PRINCIPAL] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (comunidade.descricao == undefined || comunidade.descricao == '' || comunidade.descricao == null) {
        customMessage.ERROR_BAD_REQUEST.field = '[DESCRICAO] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}

const tratarDados = async function (comunidade) {
    //Tratamento para eliminar a chegada da aspas ('') como caracter inválido
    comunidade.foto_url = comunidade.foto_url.replaceAll("'", "")
    comunidade.nome = comunidade.nome.replaceAll("'", "")
    comunidade.banner_url = comunidade.banner_url.replaceAll("'", '')
    comunidade.descricao = comunidade.descricao.replaceAll("'", "")

    return comunidade
}

module.exports = {
    inserirNovaComunidade,
    atualizarComunidade,
    listarComunidade,
    buscarComunidade,
    excluirComunidade
}