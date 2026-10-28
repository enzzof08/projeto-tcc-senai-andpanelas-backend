const configMessages = require('../modulo/configMessages')

const receitaDAO = require('../../model/DAO/receita/receita.js')

const ingredienteDAO = require('../../model/DAO/ingrediente/ingrediente.js')

const controllerIngrediente = require('../ingrediente/controller_ingrediente.js')

const controllerMdPreparo = require('../modo_preparo/controller_modo_preparo.js')

const controllerReceitaCategoria = require('../receita/controller_receita_categoria.js')

const controllerUsuario = require('../usuario/controller_usuario.js')

const controllerDificuldade = require('../dificuldade/controller_dificuldade.js')

const controllerCusto = require('../custo/controller_custo.js')

const controllerPorcao = require('../porcao/controller_porcao.js')


const inserirNovaReceita = async function (receita, contentType) {

    //Forma de criar uma cópia dos JSON do arquvio de configuração de mensagens
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {


            let validar = await validarDados(receita)


            //Retorna um JSON de erro caso algum atributo seja inválido,
            //senão retorna um false(Não teve erro)
            if (validar) {

                return validar //400
            } else {


                // Corrige os nomes dos ingredientes usando o catálogo
                for (const ingrediente of receita.ingredientes) {

                    let nomeCorrigido = await ingredienteDAO.corrigirNomeIngrediente(
                        ingrediente.nome
                    )
                    console.log(nomeCorrigido)

                    // Verifica se ocorreu um erro na consulta ao catálogo
                    if (nomeCorrigido === false) {
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL
                    }

                    // Atualiza o nome com a correção encontrada
                    ingrediente.nome = nomeCorrigido
                }

                let result = await receitaDAO.insertReceita(await tratarDados(receita))


                if (result) { //201

                    receita.id = result

                    // Percorre os ingredientes recebidos na requisição
                    for (const itemIngrediente of receita.ingredientes) {

                        // Monta o objeto para cadastrar cada ingrediente
                        let ingredienteReceita = {
                            nome: itemIngrediente.nome,
                            quantidade: itemIngrediente.quantidade,
                            id_receita: receita.id,
                            id_unidade_medida: itemIngrediente.id_unidade_medida
                        }

                        // Chama a Controller de ingredientes
                        let resultIngrediente =
                            await controllerIngrediente.inserirIngrediente(
                                ingredienteReceita
                            )

                        // Verifica se o ingrediente foi cadastrado
                        if (!resultIngrediente || !resultIngrediente.status) {
                            return customMessage.SUCCESS_CREATED_ITEM_WARNING
                        }
                    }

                    // Percorre as etapas do modo de preparo
                    for (const itemPreparo of receita.modo_preparo) {

                        // Monta o objeto do modo de preparo
                        let modoPreparo = {
                            metodo_preparo: itemPreparo.metodo_preparo,
                            ordem_preparo: itemPreparo.ordem_preparo,
                            id_receita: receita.id
                        }

                        // Chama a Controller de modo de preparo
                        let resultPreparo = await controllerMdPreparo.inserirModoPreparo(
                            modoPreparo
                        )


                        // Verifica se a etapa foi cadastrada
                        if (!resultPreparo || !resultPreparo.status) {
                            return customMessage.SUCCESS_CREATED_ITEM_WARNING
                        }
                    }

                    for (itemCategoria of receita.categoria) {


                        let receitaCategoria = {
                            "id_receita": receita.id,
                            "id_categoria": itemCategoria.id
                        }


                        let resultCategoria = await controllerReceitaCategoria.inserirNovaReceitaCategoria(receitaCategoria)
                        console.log(resultCategoria)

                        if (!resultCategoria.status) {
                            return customMessage.SUCCESS_CREATED_ITEM_WARNING  //201 com alerta de cadastro
                        }

                    }

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = receita

                    return customMessage.DEFAULT_MESSAGE //201

                } else {

                    return customMessage.ERROR_INTERNAL_SERVER_MODEL //500
                }

            }
        } else {
            return customMessage.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

// Função para listar todas as receitas
const listarReceitas = async function () {

    // Cria uma cópia das mensagens padronizadas
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await receitaDAO.selectALLReceita()


        if (result) {
            if (result.length > 0) {

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


                    let resultCategoria = await controllerReceitaCategoria.buscarCategoriasIdReceita(receita.id)
                    if (resultCategoria) {
                        receita.categoria = resultCategoria.response.categoria

                    } else
                        return resultCategoria


                    let resultCusto = await controllerCusto.buscarCusto(receita.id_custo)
                    if (resultCusto) {
                        receita.custo = resultDificuldade.response.custo
                        delete receita.id_custo
                    } else
                        return resultCusto


                    let resultPorcao = await controllerPorcao.buscarPorcao(receita.id_porcao)
                    if (resultPorcao) {
                        receita.porcao = resultPorcao.response.porcao
                        delete receita.id_porcao
                    } else
                        return resultPorcao


                    let resultIngrediente = await controllerIngrediente.listarIngredientesPorReceita(receita.id)
                    if (resultIngrediente) {
                        receita.ingredientes = resultIngrediente.response.ingrediente
                    } else
                        return resultIngrediente

                    let resultMdPreparo = await controllerMdPreparo.buscarModoPreparo(receita.id)
                    if (resultMdPreparo) {
                        receita.modo_preparo = resultMdPreparo.response.modo_preparo
                    } else
                        return resultMdPreparo

                }

                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_RESPONSE.message
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response = result

                return customMessage.DEFAULT_MESSAGE // 200

            } else {
                return customMessage.ERROR_NOT_FOUND //404
            }
        } else {
            customMessage.ERROR_INTERNAL_SERVER_MODEL //404
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarReceita = async function (idReceita) {

    // Cria uma cópia das mensagens padronizadas
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await receitaDAO.selectReceitaByID(idReceita)


        if (result) {
            if (result.length > 0) {

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


                    let resultCategoria = await controllerReceitaCategoria.buscarCategoriasIdReceita(receita.id)
                    console.log(resultCategoria)
                    if (resultCategoria) {
                        receita.categoria = resultCategoria.response.categoria

                    } else
                        return resultCategoria


                    let resultCusto = await controllerCusto.buscarCusto(receita.id_custo)
                    if (resultCusto) {
                        receita.custo = resultDificuldade.response.custo
                        delete receita.id_custo
                    } else
                        return resultCusto


                    let resultPorcao = await controllerPorcao.buscarPorcao(receita.id_porcao)
                    if (resultPorcao) {
                        receita.porcao = resultPorcao.response.porcao
                        delete receita.id_porcao
                    } else
                        return resultPorcao


                    let resultIngrediente = await controllerIngrediente.listarIngredientesPorReceita(receita.id)
                    if (resultIngrediente) {
                        receita.ingredientes = resultIngrediente.response.ingrediente
                    } else
                        return resultIngrediente

                    let resultMdPreparo = await controllerMdPreparo.buscarModoPreparo(receita.id)
                    if (resultMdPreparo && resultMdPreparo.status) {
                        receita.modo_preparo = resultMdPreparo.response.modo_preparo
                    } else
                        return resultMdPreparo

                }

                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_RESPONSE.message
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response = result

                return customMessage.DEFAULT_MESSAGE // 200

            } else {
                return customMessage.ERROR_NOT_FOUND //404
            }

        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL //404
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarReceitasPorIngredientes = async function (ingredientes) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (ingredientes != undefined && !Array.isArray(ingredientes)) {
            ingredientes = [ingredientes]
        }

        let validar = await validarDadosBuscaIngredientes(ingredientes)

        if (validar) {

            return validar

        } else {

            let ingredientesCorrigidos = []

            for (const ingrediente of ingredientes) {

                let resultIngrediente = await controllerIngrediente.corrigirIngredienteNome(ingrediente)

                if (resultIngrediente && resultIngrediente.status) {

                    ingredientesCorrigidos.push(
                        resultIngrediente.response
                    )

                } else {

                    return resultIngrediente
                }
            }

            let result = await receitaDAO.selectReceitasPorIngredientes(ingredientesCorrigidos)

            if (result) {
                if (result.length > 0) {

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
                            receita.custo = resultDificuldade.response.custo
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
                            let quantidadeEncontrada = 0

                            for (const itemIngrediente of ingredientesReceita) {

                                if (ingredientesCorrigidos.includes(itemIngrediente.nome)) {
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


const excluirReceita = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarReceita = await buscarReceita(id)

        if (resultBuscarReceita.status) {

            let result = await receitaDAO.deleteReceita(id)

            if (result){
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETED_ITEM.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
            customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_DELETED_ITEM.message

            return customMessage.DEFAULT_MESSAGE 

            }else
                return customMessage.ERROR_INTERNAL_SERVER_MODEL

        } else {
            return resultBuscarReceita
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function (receita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (receita.titulo == undefined || receita.titulo == '' || receita.titulo == null || receita.titulo.length > 50) {
        customMessage.ERROR_BAD_REQUEST.field = '[TITULO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (receita.descricao == undefined || receita.descricao == '' || receita.descricao == null || receita.descricao.length > 200) {
        customMessage.ERROR_BAD_REQUEST.field = '[DESCRICAO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (receita.tempo == undefined || receita.tempo == '' || receita.tempo == null) {
        customMessage.ERROR_BAD_REQUEST.field = '[TEMPO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (receita.foto.length > 2000 || !/^https?:\/\/.+/.test(receita.foto)) {
        customMessage.ERROR_BAD_REQUEST.field = '[FOTO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (receita.id_porcao == undefined || receita.id_porcao == '' || receita.id_porcao == null || isNaN(receita.id_porcao) || receita.id_porcao <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_PORCAO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (receita.id_dificuldade == undefined || receita.id_dificuldade == '' || receita.id_dificuldade == null || isNaN(receita.id_dificuldade) || receita.id_dificuldade <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_DIFICULDADE] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (receita.id_custo == undefined || receita.id_custo == '' || receita.id_custo == null || isNaN(receita.id_custo) || receita.id_custo <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_CUSTO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (receita.id_usuario == undefined || receita.id_usuario == '' || receita.id_usuario == null || isNaN(receita.id_usuario) || receita.id_usuario <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (!Array.isArray(receita.ingredientes) || receita.ingredientes.length == 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[INGREDIENTES] INVÁLIDOS'
        return customMessage.ERROR_BAD_REQUEST
    } else if (!Array.isArray(receita.modo_preparo) || receita.modo_preparo.length == 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[MODO DE PREPARO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (!Array.isArray(receita.categoria) || receita.categoria.length == 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[CATEGORIA] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}

const tratarDados = async function (receita) {
    //Tratamento para eliminar a chegada da aspas ('') como caracter inválido
    receita.titulo = receita.titulo.replaceAll("'", "")
    receita.descricao = receita.descricao.replaceAll("'", "")
    receita.tempo = receita.tempo.replaceAll("'", '')
    receita.foto = receita.foto.replaceAll("'", "")

    return receita
}

const validarDadosBuscaIngredientes = async function (ingredientes) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (!Array.isArray(ingredientes) || ingredientes.length == 0) {

        customMessage.ERROR_BAD_REQUEST.field = '[INGREDIENTES] INVÁLIDOS'
        return customMessage.ERROR_BAD_REQUEST

    } else {

        for (const ingrediente of ingredientes) {

            if (
                typeof ingrediente != 'string' ||
                ingrediente.trim() == ''
            ) {
                customMessage.ERROR_BAD_REQUEST.field = '[INGREDIENTES] INVÁLIDOS'
                return customMessage.ERROR_BAD_REQUEST
            }
        }

        return false
    }
}

module.exports = {
    inserirNovaReceita,
    listarReceitas,
    buscarReceita,
    buscarReceitasPorIngredientes,
    excluirReceita
}
