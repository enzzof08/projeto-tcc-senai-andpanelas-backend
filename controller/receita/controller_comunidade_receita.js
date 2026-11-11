const configMessages = require('../modulo/configMessages')

const comunidadeReceitaDAO = require('../../model/DAO/comunidade_receita/comunidade_receita.js')

const controllerReceitaCategoria = require('../receita/controller_receita_categoria.js')

const controllerUsuario = require('../usuario/controller_usuario.js')

const controllerDificuldade = require('../dificuldade/controller_dificuldade.js')

const controllerCusto = require('../custo/controller_custo.js')

const controllerPorcao = require('../porcao/controller_porcao.js')

const inserirNovaComunidadeReceita = async function (comunidadeReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let validar = await validarDados(comunidadeReceita)

        if (validar) {
            return validar
        } else {
            let result = await comunidadeReceitaDAO.insertComunidadeReceita(comunidadeReceita)

            if (result === 'DUPLICADO') {
                customMessage.ERROR_BAD_REQUEST.field = 'RECEITA JA ESTÁ NESSA COMUNIDADE'
                return customMessage.ERROR_BAD_REQUEST
            }

            if (result) {
                comunidadeReceita.id = result
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message

                customMessage.DEFAULT_MESSAGE.response = comunidadeReceita

                return customMessage.DEFAULT_MESSAGE
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarComunidadePorReceita = async function (idReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idReceita == undefined || String(idReceita).replaceAll('', '') == '' || idReceita == '' || idReceita == null || isNaN(idReceita) || idReceita <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_RECEITA] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        } else {
            let result = await comunidadeReceitaDAO.selectComunidadeByIdReceita(idReceita)

            if (result) {

                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.comunidade = result

                return customMessage.DEFAULT_MESSAGE

            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarReceitaPorComunidade = async function (idComunidade) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idComunidade == undefined || String(idComunidade).replaceAll('', '') == '' || idComunidade == '' || idComunidade == null || isNaN(idComunidade) || idComunidade <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_COMUNIDADE] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        } else {
            let result = await comunidadeReceitaDAO.selectReceitaByIdComunidade(idComunidade)

            if (result) {

            if (result.length > 0) {

                for (receita of result) {

                    let resultUsuario = await controllerUsuario.buscarUsuario(receita.id_usuario)
                    if (resultUsuario.status) {
                        receita.usuario = resultUsuario.response.usuario
                        delete receita.id_usuario
                    } else
                        return resultUsuario


                    let resultDificuldade = await controllerDificuldade.buscarDificuldade(receita.id_dificuldade)
                    if (resultDificuldade.status) {
                        receita.dificuldade = resultDificuldade.response.dificuldade
                        delete receita.id_dificuldade
                    } else
                        return resultDificuldade

                    let resultCategoria = await controllerReceitaCategoria.buscarCategoriasIdReceita(receita.id)
                    if (resultCategoria.status) {
                        receita.categoria = resultCategoria.response.categoria

                    } else
                        return resultCategoria




                    let resultCusto = await controllerCusto.buscarCusto(receita.id_custo)
                    //console.log(resultCusto)
                    if (resultCusto.status) {
                        receita.custo = resultDificuldade.response.custo
                        delete receita.id_custo
                    } else
                        return resultCusto


                    let resultPorcao = await controllerPorcao.buscarPorcao(receita.id_porcao)
                    if (resultPorcao.status) {
                        receita.porcao = resultPorcao.response.porcao
                        delete receita.id_porcao
                    } else
                        return resultPorcao

                }

                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_RESPONSE.message
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.receitas = result

                return customMessage.DEFAULT_MESSAGE // 200

            } else {
                return customMessage.ERROR_NOT_FOUND //404
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

const buscarReceitaComunidade = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (id == undefined || String(id).replaceAll('', '') == '' || id == '' || id == null || isNaN(id) || id <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_COMUNIDADE] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        } else {
            let result = await comunidadeReceitaDAO.selectComunidadeReceita(idComunidade)
            if (result) {
                if (result == false) {
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response = comunidadeReceita

                return customMessage.DEFAULT_MESSAGE
            } else {
                return customMessage.ERROR_INTERNAL_MODEL
            }
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirComunidadeReceita = async function (idReceita) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await comunidadeReceitaDAO.deleteComunidadeByIdReceita(idReceita)
        if (result) {
            return customMessage.SUCCESS_DELETED_ITEM
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirComunidadeIdReceita = async function (idReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    try {

        //Chamar a função do DAO para excluir o genero
        let result = await comunidadeReceitaDAO.deleteComunidadeByIdReceita(idReceita)
        if (result) {
            return customMessage.SUCCESS_DELETED_ITEM
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }


    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirReceitaComunidade = async function (idComunidade) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await receitaComunidadeDAO.deleteReceitaByIdComunidade(idComunidade)
        if (result) {
            return customMessage.SUCCESS_DELETED_ITEM
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function (comunidadeReceita) {
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

module.exports = {
    inserirNovaComunidadeReceita,
    buscarReceitaComunidade,
    excluirComunidadeReceita,
    excluirReceitaComunidade,
    buscarComunidadePorReceita,
    excluirComunidadeIdReceita,
    buscarReceitaPorComunidade
}