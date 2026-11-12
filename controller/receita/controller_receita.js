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

const controllerComunidadeReceita = require('./controller_comunidade_receita.js')

const controllerTagReceita = require('../receita/controller_tag_receita.js')

const controllerTag = require('../tag/controller_tag.js')

const tagDAO = require('../../model/DAO/tag/tag.js')

const controllerCutir = require('../curtida/controller_curtida.js')
const controllerSalvar = require('../salvar/controller_salvar.js')

const inserirNovaReceita = async function (receita, contentType) {

    //Forma de criar uma cópia dos JSON do arquvio de configuração de mensagens
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {


            let validar = await validarDados(receita)

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

                    // MODO PREPARO
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

                    // CATEGORIA
                    for (itemCategoria of receita.categoria) {


                        let receitaCategoria = {
                            "id_receita": receita.id,
                            "id_categoria": itemCategoria.id
                        }


                        let resultCategoria = await controllerReceitaCategoria.inserirNovaReceitaCategoria(receitaCategoria)


                        if (!resultCategoria.status) {
                            return customMessage.SUCCESS_CREATED_ITEM_WARNING  //201 com alerta de cadastro
                        }

                    }


                    //COMUNIDADE
                    if (receita.comunidade && receita.comunidade.length > 0) {

                        for (itemComunidade of receita.comunidade) {

                            let dadosComunidade = {
                                id_receita: receita.id,
                                id_comunidade: itemComunidade.id
                            }

                            let resultComunidade = await controllerComunidadeReceita.inserirNovaComunidadeReceita(dadosComunidade)

                            if (!resultComunidade || !resultComunidade.status) {
                                return customMessage.SUCCESS_CREATED_ITEM_WARNING
                            }
                        }
                    }

                    // TAGS
                    if (receita.tags && receita.tags.length > 0) {

                        for (const itemTag of receita.tags) {

                            // Busca a tag pelo nome
                            let resultTag = await tagDAO.selectTagByNome(itemTag.nome_tag)

                            if (resultTag === false) {
                                return customMessage.ERROR_INTERNAL_SERVER_MODEL
                            }

                            let idTag

                            // Verifica se a tag já existe
                            if (resultTag.length > 0) {

                                idTag = resultTag[0].id

                            } else {

                                // Cadastra a tag caso não exista
                                idTag = await tagDAO.insertTag(itemTag.nome_tag)

                                if (!idTag) {
                                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                                }
                            }

                            // Relaciona a tag com a receita
                            let dadosTagReceita = {
                                id_receita: receita.id,
                                id_tag: idTag
                            }

                            let resultTagReceita = await controllerTagReceita.inserirNovaTagReceita(dadosTagReceita)

                            if (!resultTagReceita) {
                                return customMessage.SUCCESS_CREATED_ITEM_WARNING
                            }
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
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const listarReceitas = async function (idUsuario) {

    // Cria uma cópia das mensagens padronizadas
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await receitaDAO.selectALLReceita()


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


                    let resultCurtida = await controllerCutir.listarCurtidasReceita(receita.id)
                    if (resultCurtida.status) {
                        receita.qtd_curtidas = resultCurtida.response.qtd_curtida
                    } else
                        return resultCurtida


                    let resultSalvo = await controllerSalvar.listarSalvosReceita(receita.id)
                    if (resultSalvo.status) {
                        receita.qtd_salvos = resultSalvo.response.qtd_salvo
                    } else
                        return resultSalvo


                    if (idUsuario != undefined) {

                        let resultVerificarCurtida = await controllerCutir.verificarCurtidaUsuario(
                            idUsuario,
                            receita.id
                        )

                        if (resultVerificarCurtida.status) {
                            receita.curtida_pelo_usuario = resultVerificarCurtida.response.curtida_usuario
                        } else {
                            return resultVerificarCurtida
                        }



                        let resultVerificarSalvo = await controllerSalvar.verificarSalvoUsuario(
                            idUsuario,
                            receita.id
                        )

                        if (resultVerificarSalvo.status) {
                            receita.salvo_pelo_usuario = resultVerificarSalvo.response.salvo_usuario
                        } else {
                            return resultVerificarSalvo
                        }
                    }

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

const atualizarReceita = async function (dados, id, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase().includes('APPLICATION/JSON')) {

            let receitaBusca = await buscarReceita(id)

            if (receitaBusca.status) {

                let validar = await validarDados(dados)

                if (validar) {
                    return validar
                } else {

                    dados.id = id

                    // let result = await .updateUsuario(dadosAtualizados)
                    let result = await receitaDAO.updateReceita(dados)

                    if (result) {

                        //Ingredientes
                        if (dados.ingredientes !== undefined) {

                            await controllerIngrediente.excluirIngredientesPorReceita(id)

                            // Corrige os nomes dos ingredientes usando o catálogo
                            for (const ingrediente of dados.ingredientes) {

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

                            // Percorre os ingredientes recebidos na requisição
                            for (const itemIngrediente of dados.ingredientes) {

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

                        }


                        if (dados.modo_preparo !== undefined) {

                            // Exclui as etapas antigas
                            await controllerMdPreparo.excluirModoPreparoPorReceita(id)

                            // Cadastra as novas etapas
                            for (const itemPreparo of dados.modo_preparo) {

                                let modoPreparo = {
                                    metodo_preparo: itemPreparo.metodo_preparo,
                                    ordem_preparo: itemPreparo.ordem_preparo,
                                    id_receita: id
                                }

                                let resultPreparo = await controllerMdPreparo.inserirModoPreparo(
                                    modoPreparo
                                )

                                if (!resultPreparo || !resultPreparo.status) {
                                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                                }
                            }
                        }


                        if (dados.categoria !== undefined) {

                            // Exclui as categorias antigas
                            await controllerReceitaCategoria.excluirCategoriasIdReceita(id)

                            // Cadastra as novas categorias
                            for (const itemCategoria of dados.categoria) {

                                let receitaCategoria = {
                                    id_receita: id,
                                    id_categoria: itemCategoria.id
                                }

                                let resultCategoria = await controllerReceitaCategoria.inserirNovaReceitaCategoria(
                                    receitaCategoria
                                )

                                if (!resultCategoria || !resultCategoria.status) {
                                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                                }
                            }
                        }

                        if (dados.comunidade !== undefined) {

                            // Exclui as comunidades antigas
                            await controllerComunidadeReceita.excluirComunidadeIdReceita(id)

                            // Cadastra as novas comunidades
                            for (const itemComunidade of dados.comunidade) {

                                let dadosComunidade = {
                                    id_receita: id,
                                    id_comunidade: itemComunidade.id
                                }

                                let resultComunidade = await controllerComunidadeReceita.inserirNovaComunidadeReceita(
                                    dadosComunidade
                                )

                                if (!resultComunidade || !resultComunidade.status) {
                                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                                }
                            }
                        }


                        if (dados.tags !== undefined) {

                            // Exclui as tags antigas
                            let resultRemoverTags = await controllerTagReceita.excluirTagsIdReceita(id)

                            // Cadastra as novas tags
                            for (const itemTag of dados.tags) {

                                let resultTag = await tagDAO.selectTagByNome(itemTag.nome_tag)

                                if (resultTag === false) {
                                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                                }

                                let idTag

                                if (resultTag.length > 0) {
                                    idTag = resultTag[0].id

                                } else {
                                    let resultNovaTag = await controllerTag.inserirNovaTag(
                                        itemTag.nome_tag,
                                        'APPLICATION/JSON'
                                    )
                                    console.log(resultNovaTag)

                                    if (!resultNovaTag || !resultNovaTag.status) {
                                        return resultNovaTag
                                    }

                                    idTag = resultNovaTag.response.id_tag
                                }

                                let dadosTagReceita = {
                                    id_receita: id,
                                    id_tag: idTag
                                }

                                let resultTagReceita = await controllerTagReceita.inserirNovaTagReceita(
                                    dadosTagReceita
                                )

                                console.log(resultTagReceita)

                                if (!resultTagReceita || !resultTagReceita.status) {
                                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                                }
                            }
                        }




                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATE_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATE_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATE_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = dados

                        return customMessage.DEFAULT_MESSAGE // 200
                    } else {
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL // 500
                    }
                }

            } else {
                return receitaBusca
            }

        } else {
            return customMessage.ERROR_CONTENT_TYPE // 415
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

//Id Usuario é para ver quem esta acessando a receita , para ver se curtiu ou nao
const buscarReceita = async function (idReceita, idUsuario) {

    // Cria uma cópia das mensagens padronizadas
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await receitaDAO.selectReceitaByID(idReceita)


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


                    let resultIngrediente = await controllerIngrediente.listarIngredientesPorReceita(receita.id)
                    if (resultIngrediente.status) {
                        receita.ingredientes = resultIngrediente.response.ingrediente
                    } else
                        return resultIngrediente

                    let resultMdPreparo = await controllerMdPreparo.buscarModoPreparo(receita.id)
                    if (resultMdPreparo.status) {
                        receita.modo_preparo = resultMdPreparo.response.modo_preparo
                    } else
                        return resultMdPreparo


                    let resultComunidade = await controllerComunidadeReceita.buscarComunidadePorReceita(receita.id)
                    if (resultComunidade.status) {
                        receita.comunidade = resultComunidade.response.comunidade

                    } else
                        return resultComunidade


                    let resultTag = await controllerTagReceita.buscarTagsIdReceita(receita.id)
                    if (resultTag.status) {
                        receita.tag = resultTag.response.tag

                    } else
                        return resultTag


                    let resultCurtida = await controllerCutir.listarCurtidasReceita(receita.id)
                    if (resultCurtida.status) {
                        receita.qtd_curtidas = resultCurtida.response.qtd_curtida
                    } else
                        return resultCurtida


                    let resultSalvo = await controllerSalvar.listarSalvosReceita(receita.id)
                    if (resultSalvo.status) {
                        receita.qtd_salvos = resultSalvo.response.qtd_salvo
                    } else
                        return resultSalvo


                    if (idUsuario != undefined) {

                        let resultVerificarCurtida = await controllerCutir.verificarCurtidaUsuario(
                            idUsuario,
                            receita.id
                        )

                        if (resultVerificarCurtida.status) {
                            receita.curtida_pelo_usuario = resultVerificarCurtida.response.curtida_usuario
                        } else {
                            return resultVerificarCurtida
                        }



                        let resultVerificarSalvo = await controllerSalvar.verificarSalvoUsuario(
                            idUsuario,
                            receita.id
                        )

                        if (resultVerificarSalvo.status) {
                            receita.salvo_pelo_usuario = resultVerificarSalvo.response.salvo_usuario
                        } else {
                            return resultVerificarSalvo
                        }
                    }

                }


                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_RESPONSE.message
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

const buscarReceitasPorIngredientes = async function (ingredientes, idUsuario) {

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


                        if (idUsuario != undefined) {

                            let resultVerificarCurtida = await controllerCutir.verificarCurtidaUsuario(
                                idUsuario,
                                receita.id
                            )

                            if (resultVerificarCurtida.status) {
                                receita.curtida_pelo_usuario = resultVerificarCurtida.response.curtida_usuario
                            } else {
                                return resultVerificarCurtida
                            }



                            let resultVerificarSalvo = await controllerSalvar.verificarSalvoUsuario(
                                idUsuario,
                                receita.id
                            )

                            if (resultVerificarSalvo.status) {
                                receita.salvo_pelo_usuario = resultVerificarSalvo.response.salvo_usuario
                            } else {
                                return resultVerificarSalvo
                            }
                        }


                        // let resultIngredientes = await controllerIngrediente.listarIngredientesPorReceita(receita.id)
                        // if (resultIngredientes) {

                        //     let ingredientesReceita = resultIngredientes.response.ingrediente
                        //     let quantidadeEncontrada = 0

                        //     for (const itemIngrediente of ingredientesReceita) {

                        //         if (ingredientesCorrigidos.includes(itemIngrediente.nome)) {
                        //             quantidadeEncontrada++
                        //         }
                        //     }

                        //     if (ingredientesReceita.length > 0) {

                        //         //Retornar o valor da compatibilidade (em numero inteiro)
                        //         receita.compatibilidade = Math.round(
                        //             ((quantidadeEncontrada / ingredientesReceita.length) * 100)
                        //         )

                        //     } else {

                        //         receita.compatibilidade = 0
                        //     }

                        // } else {
                        //     return resultIngredientes
                        // }

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

const buscarReceitasPorNome = async function (titulo, idUsuario) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (titulo == undefined || titulo == null || titulo.trim() == '') {
            customMessage.ERROR_BAD_REQUEST.field = '[TITULO] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        }

        let result = await receitaDAO.selectReceitasPorNome(titulo)

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


                    let resultCurtida = await controllerCutir.listarCurtidasReceita(receita.id)
                    if (resultCurtida.status) {
                        receita.qtd_curtidas = resultCurtida.response.qtd_curtida
                    } else
                        return resultCurtida


                    let resultSalvo = await controllerSalvar.listarSalvosReceita(receita.id)
                    if (resultSalvo.status) {
                        receita.qtd_salvos = resultSalvo.response.qtd_salvo
                    } else
                        return resultSalvo


                    if (idUsuario != undefined) {

                        let resultVerificarCurtida = await controllerCutir.verificarCurtidaUsuario(
                            idUsuario,
                            receita.id
                        )

                        if (resultVerificarCurtida.status) {
                            receita.curtida_pelo_usuario = resultVerificarCurtida.response.curtida_usuario
                        } else {
                            return resultVerificarCurtida
                        }



                        let resultVerificarSalvo = await controllerSalvar.verificarSalvoUsuario(
                            idUsuario,
                            receita.id
                        )

                        if (resultVerificarSalvo.status) {
                            receita.salvo_pelo_usuario = resultVerificarSalvo.response.salvo_usuario
                        } else {
                            return resultVerificarSalvo
                        }
                    }

                }

                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.receitas = result

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

const buscarReceitasPorUsuario = async function (idUsuario) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (idUsuario == undefined || idUsuario == null || idUsuario == '' || isNaN(idUsuario) || !Number.isInteger(Number(idUsuario)) || idUsuario <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        }

        let result = await receitaDAO.selectReceitasPorUsuario(idUsuario)

        if (result) {

            if (result.length > 0) {

                for (let receita of result) {

                    let resultUsuario = await controllerUsuario.buscarUsuario(receita.id_usuario)

                    if (resultUsuario.status) {
                        receita.usuario = resultUsuario.response.usuario
                        delete receita.id_usuario
                    } else {
                        return resultUsuario
                    }


                    let resultDificuldade = await controllerDificuldade.buscarDificuldade(receita.id_dificuldade)

                    if (resultDificuldade.status) {
                        receita.dificuldade = resultDificuldade.response.dificuldade
                        delete receita.id_dificuldade
                    } else {
                        return resultDificuldade
                    }


                    let resultCategoria = await controllerReceitaCategoria.buscarCategoriasIdReceita(receita.id)

                    if (resultCategoria.status) {
                        receita.categoria = resultCategoria.response.categoria
                    } else {
                        return resultCategoria
                    }


                    let resultCusto = await controllerCusto.buscarCusto(receita.id_custo)

                    if (resultCusto.status) {
                        receita.custo = resultCusto.response.custo
                        delete receita.id_custo
                    } else {
                        return resultCusto
                    }


                    let resultPorcao = await controllerPorcao.buscarPorcao(receita.id_porcao)

                    if (resultPorcao.status) {
                        receita.porcao = resultPorcao.response.porcao
                        delete receita.id_porcao
                    } else {
                        return resultPorcao
                    }


                    let resultCurtida = await controllerCutir.listarCurtidasReceita(receita.id)

                    if (resultCurtida.status) {
                        receita.qtd_curtidas = resultCurtida.response.qtd_curtida
                    } else {
                        return resultCurtida
                    }


                    let resultSalvo = await controllerSalvar.listarSalvosReceita(receita.id)

                    if (resultSalvo.status) {
                        receita.qtd_salvos = resultSalvo.response.qtd_salvo
                    } else {
                        return resultSalvo
                    }


                    if (idUsuario != undefined) {

                        let resultVerificarCurtida = await controllerCutir.verificarCurtidaUsuario(
                            idUsuario,
                            receita.id
                        )

                        if (resultVerificarCurtida.status) {
                            receita.curtida_pelo_usuario = resultVerificarCurtida.response.curtida_usuario
                        } else {
                            return resultVerificarCurtida
                        }



                        let resultVerificarSalvo = await controllerSalvar.verificarSalvoUsuario(
                            idUsuario,
                            receita.id
                        )

                        if (resultVerificarSalvo.status) {
                            receita.salvo_pelo_usuario = resultVerificarSalvo.response.salvo_usuario
                        } else {
                            return resultVerificarSalvo
                        }
                    }

                }

                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.receitas = result

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

const excluirReceita = async function (id) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarReceita = await buscarReceita(id)

        if (resultBuscarReceita.status) {

            let result = await receitaDAO.deleteReceita(id)

            if (result) {
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_DELETED_ITEM.message

                return customMessage.DEFAULT_MESSAGE

            } else
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
    excluirReceita,
    atualizarReceita,
    buscarReceitasPorNome,
    buscarReceitasPorUsuario
}
