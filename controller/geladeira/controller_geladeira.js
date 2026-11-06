const configMessages = require('../modulo/configMessages')

const geladeiraDAO = require('../../model/DAO/geladeira/geladeira.js')

const controllerUsuario = require('../usuario/controller_usuario.js')

const ingredienteDAO = require('../../model/DAO/ingrediente/ingrediente.js')

const controllerDificuldade = require('../dificuldade/controller_dificuldade.js')

const controllerCusto = require('../custo/controller_custo.js')

const controllerPorcao = require('../porcao/controller_porcao.js')

const controllerIngrediente = require('../ingrediente/controller_ingrediente.js')

const controllerMdPreparo = require('../modo_preparo/controller_modo_preparo.js')

const controllerReceitaCategoria = require('../receita/controller_receita_categoria.js')

const receitaDAO = require('../../model/DAO/receita/receita.js')


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
        if (error.code === 'ER_DUP_ENTRY') {
            customMessage.ERROR_BAD_REQUEST.field = '[INGREDIENTE] JÁ CADASTRADO NA GELADEIRA'
            return customMessage.ERROR_BAD_REQUEST
        }
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

const buscarGeladeiraUsuarioReceitas = async function (idUsuario) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idUsuario == undefined || String(idUsuario).replaceAll('', '') == '' || idUsuario == null || isNaN(idUsuario) || idUsuario <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_GELADEIRA_INGREDIENTE] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        } else {
            let ingredientes = await geladeiraDAO.selectALLGeladeiraIngrediente(idUsuario)
            console.log('INGREDIENTES DA GELADEIRA:', ingredientes)

            if (ingredientes != undefined && !Array.isArray(ingredientes)) {
                ingredientes = [ingredientes]
            }

            if (ingredientes) {

                if (ingredientes.length > 0) {

                    let result = await receitaDAO.selectReceitasPorIngredientesGeladeira(ingredientes)

                    if (result) {
                        for (receita of result) {

                            let resultUsuario = await controllerUsuario.buscarUsuario(receita.id_usuario)
                            if (resultUsuario) {
                                receita.usuario = resultUsuario.response.usuario
                                delete receita.id_usuario
                            } else
                                return resultUsuario

                            let resultDificuldade = await controllerDificuldade.buscarDificuldade(receita.id_dificuldade)
                            if (resultDificuldade) {
                                receita.dificuldade = resultDificuldade.response.dificuldade
                                delete receita.id_dificuldade
                            } else
                                return resultDificuldade


                            let resultCusto = await controllerCusto.buscarCusto(receita.id_custo)
                            if (resultCusto) {
                                receita.custo = resultCusto.response.custo
                                delete receita.id_custo
                            } else
                                return resultCusto


                            let resultPorcao = await controllerPorcao.buscarPorcao(receita.id_porcao)
                            if (resultPorcao) {
                                receita.porcao = resultPorcao.response.porcao
                                delete receita.id_porcao
                            } else
                                return resultPorcao

                            let resultIngredientes = await controllerIngrediente.listarIngredientesPorReceita(receita.id)
                            if (resultIngredientes) {

                                let ingredientesReceita = resultIngredientes.response.ingrediente
                                console.log(ingredientesReceita)

                                let quantidadeEncontrada = 0

                                for (const itemIngrediente of ingredientesReceita) {

                                    if (ingredientes.some(item =>
                                        item.nome_ingrediente.toLowerCase() === itemIngrediente.nome.toLowerCase()
                                    )) {
                                        quantidadeEncontrada++
                                    }
                                }

                                if (ingredientesReceita.length > 0) {

                                    //Retornar o valor da compatibilidade (em numero inteiro)
                                    receita.compatibilidade = Math.round(
                                        ((quantidadeEncontrada / ingredientesReceita.length) * 100)
                                    )

                                } else {

                                    receita.compatibilidade = 0
                                }

                            } else {
                                return resultIngredientes
                            }

                        }

                        // Ordenar as receitas de acordo com a compatibilidade
                        result.sort((a, b) => b.compatibilidade - a.compatibilidade)


                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_RESPONSE.message
                        customMessage.DEFAULT_MESSAGE.response.count = result.length
                        customMessage.DEFAULT_MESSAGE.response.receitas = result

                        return customMessage.DEFAULT_MESSAGE

                    } else {
                        customMessage.ERROR_NOT_FOUND.message = "Receitas não encontradas"
                        return customMessage.ERROR_NOT_FOUND
                    }
                } else {
                    customMessage.ERROR_NOT_FOUND.message = "Ingredientes não encontrados"
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
    excluirGeladeirasIngredientes,
    buscarGeladeiraUsuarioReceitas
}