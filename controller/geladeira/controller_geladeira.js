const configMessages = require('../modulo/configMessages')

const geladeiraDAO = require('../../model/DAO/geladeira/geladeira.js')

const controllerUsuario = require('../usuario/controller_usuario.js')

const ingredienteDAO = require('../../model/DAO/ingrediente/ingrediente.js')



const inserirNovaGeladeiraIngrediente = async function (geladeiraIngrediente, contentType) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDados(geladeiraIngrediente)

            if (validar) {
                return validar
            } else {

                    let nomeCorrigido = await ingredienteDAO.corrigirNomeIngrediente(
                        geladeiraIngrediente.nome_ingrediente
                    )
                    console.log(nomeCorrigido)

                    // Verifica se ocorreu um erro na consulta ao catálogo
                    if (nomeCorrigido === false) {
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL
                    }

                    // Atualiza o nome com a correção encontrada
                    geladeiraIngrediente.nome_ingrediente = nomeCorrigido
                

                let result = await geladeiraDAO.insertGeladeiraIngrediente(await tratarDados(geladeiraIngrediente))

                if (result) {
                    geladeiraIngrediente.id = result

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = geladeiraIngrediente

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

const listarGeladeiraIngredientes = async function (idUsuario) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (idUsuario == undefined || idUsuario == '' || idUsuario == null || isNaN(idUsuario) || idUsuario <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST
        }

        let result = await geladeiraDAO.selectALLGeladeiraIngrediente(idUsuario)

        if (result) {
            if (result.length > 0) {

                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_RESPONSE.message
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response = result

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

const excluirGeladeirasIngredientes = async function (idGeladeiraIngrediente) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let resultBuscarIngrediente = await buscarGeladeiraIngrediente(idGeladeiraIngrediente)

        if (resultBuscarIngrediente.status) {

            let result = await geladeiraDAO.deleteGeladeiraIngrediente(idGeladeiraIngrediente)

            if (result) {
                if (result.length > 0) {

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_DELETED_ITEM.message

                    return customMessage.DEFAULT_MESSAGE
                } else {
                    return customMessage.ERROR_NOT_FOUND
                }
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            return resultBuscarIngrediente
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarGeladeiraIngrediente = async function (id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (id == undefined || String(id).replaceAll('', '') == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_GELADEIRA_INGREDIENTE] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        } else {
            let result = await geladeiraDAO.selectGeladeiraIngredienteByID(id)

            if (result) {
                if (result.length > 0) {

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.geladeira_ingrediente = result

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

const validarDados = async function (ingrediente) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (ingrediente.nome_ingrediente == undefined || ingrediente.nome_ingrediente == '' || ingrediente.nome_ingrediente == null || ingrediente.nome_ingrediente.length > 35) {
        customMessage.ERROR_BAD_REQUEST.field = '[NOME INGREDIENTE] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST

    } else if (ingrediente.id_usuario == undefined || ingrediente.id_usuario == '' || ingrediente.id_usuario == null || isNaN(ingrediente.id_usuario) || ingrediente.id_usuario <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}


const tratarDados = async function (ingrediente) {
    ingrediente.nome_ingrediente = ingrediente.nome_ingrediente.replaceAll("'", "")

    return ingrediente
}

module.exports = {
    inserirNovaGeladeiraIngrediente,
    listarGeladeiraIngredientes,
    excluirGeladeirasIngredientes
}