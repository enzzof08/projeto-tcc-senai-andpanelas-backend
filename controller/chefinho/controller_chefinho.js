const configMessages = require('../modulo/configMessages.js')

const chefinhoDAO = require('../../model/DAO/chefinho/chefinho.js')
const controllerReceita = require('../receita/controller_receita.js')
const controllerUsuario = require('../usuario/controller_usuario.js')
const dificuldadeDAO = require('../../model/DAO/dificuldade/dificuldade.js')
const custoDAO = require('../../model/DAO/custo/custo.js')
const porcaoDAO = require('../../model/DAO/porcao/porcao.js')
const categoriaDAO = require('../../model/DAO/categoria/categoria.js')
const unidadeMedidaDAO = require('../../model/DAO/unidade_medida/unidade_medida.js')

const ID_USUARIO_CHEFINHO = 1

const LIMITE_HISTORICO = 10
const LIMITE_PERGUNTA = 2000
const LIMITE_TITULO = 100
const TIMEOUT_CHEFINHO = 60000
const LIMITE_PESQUISA = 200
const LIMITE_ENCONTRADOS = 50

const chamarChatChefinho = async function (historico, perguntaAtual) {
    let resposta = await fetch(`${process.env.CHEFINHO_URL}/v1/chefinho/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.CHEFINHO_API_KEY
        },
        body: JSON.stringify({ historico_conversa: historico, pergunta_atual: perguntaAtual }),
        signal: AbortSignal.timeout(TIMEOUT_CHEFINHO)
    })

    return await resposta.json()
}

const inserirConversa = async function (dados, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() != 'APPLICATION/JSON') {
            return customMessage.ERROR_CONTENT_TYPE
        }

        let titulo = typeof dados.titulo == 'string' ? dados.titulo.trim() : ''

        if (titulo == '' || titulo.length > LIMITE_TITULO || isNaN(dados.id_usuario)) {
            return customMessage.ERROR_BAD_REQUEST
        }

        let id = await chefinhoDAO.insertConversa(titulo, dados.id_usuario)

        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
        customMessage.DEFAULT_MESSAGE.response = { id }

        return customMessage.DEFAULT_MESSAGE
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const inserirNovaMensagemConversa = async function (idConversa, dados, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() != 'APPLICATION/JSON') {
            return customMessage.ERROR_CONTENT_TYPE
        }

        let mensagem = typeof dados.mensagem == 'string' ? dados.mensagem.trim() : ''

        if (isNaN(idConversa) || mensagem == '' || mensagem.length > LIMITE_PERGUNTA) {
            return customMessage.ERROR_BAD_REQUEST
        }

        let conversa = await chefinhoDAO.selectConversaById(idConversa)

        if (!conversa) {
            return customMessage.ERROR_NOT_FOUND
        }

        let historico = await chefinhoDAO.selectUltimasMensagens(idConversa, LIMITE_HISTORICO)

        let retornoIA = await chamarChatChefinho(historico, mensagem)

        if (!retornoIA.success) {
            return { status: false, status_code: 502, message: 'O Chefinho não conseguiu responder agora. Tente novamente.' }
        }

        await chefinhoDAO.insertMensagens(idConversa, mensagem, retornoIA.response_ia.message)

        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_RESPONSE.message
        customMessage.DEFAULT_MESSAGE.response = { mensagem: retornoIA.response_ia.message }

        return customMessage.DEFAULT_MESSAGE
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const sugerirReceita = async function (dados, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() != 'APPLICATION/JSON') {
            return customMessage.ERROR_CONTENT_TYPE
        }

        let pesquisaUsuario = typeof dados.pesquisa_usuario == 'string' ? dados.pesquisa_usuario.trim() : ''
        let encontrados = Array.isArray(dados.encontrados_db) ? dados.encontrados_db : []

        if (pesquisaUsuario == '' || pesquisaUsuario.length > LIMITE_PESQUISA) {
            return customMessage.ERROR_BAD_REQUEST
        }

        let resposta = await fetch(`${process.env.CHEFINHO_URL}/v1/chefinho/pesquisa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.CHEFINHO_API_KEY
            },
            body: JSON.stringify({
                pesquisa_usuario: pesquisaUsuario,
                encontrados_db: encontrados.slice(0, LIMITE_ENCONTRADOS)
            }),
            signal: AbortSignal.timeout(TIMEOUT_CHEFINHO)
        })

        let retorno = await resposta.json()

        if (!retorno.success) {
            return retorno
        }

        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
        customMessage.DEFAULT_MESSAGE.message = retorno.message
        customMessage.DEFAULT_MESSAGE.response = retorno.response_ia

        return customMessage.DEFAULT_MESSAGE
    } catch (error) {
        if (error.name == 'TimeoutError' || error.name == 'AbortError') {
            return { status: false, status_code: 504, message: 'O Chefinho demorou para responder. Tente novamente.' }
        }

        return { status: false, status_code: 502, message: 'O Chefinho não conseguiu responder agora. Tente novamente.' }
    }
}

const normalizarTextoCatalogo = (valor) => String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase('pt-BR')

const salvarSugestaoReceita = async function (dados, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (!String(contentType).toUpperCase().startsWith('APPLICATION/JSON')) {
            return customMessage.ERROR_CONTENT_TYPE
        }

        const sugestao = dados?.receita && typeof dados.receita === 'object'
            ? dados.receita
            : null

        if (!sugestao) return customMessage.ERROR_BAD_REQUEST

        // O usuário autenticado aprova a sugestão, mas o autor fica fixo no usuário
        // reservado ao Chefinho. Nunca aceitamos id_usuario enviado pelo navegador.
        const usuarioChefinho = await controllerUsuario.buscarUsuario(ID_USUARIO_CHEFINHO)
        const identidadeChefinho = usuarioChefinho?.response?.usuario
        if (!usuarioChefinho?.status || identidadeChefinho?.username !== 'chefinho') {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

        const titulo = typeof sugestao.titulo === 'string' ? sugestao.titulo.trim() : ''
        const descricao = typeof sugestao.descricao === 'string' ? sugestao.descricao.trim() : ''
        const foto = typeof sugestao.foto === 'string' ? sugestao.foto.trim() : ''
        const video = typeof sugestao.video === 'string' && sugestao.video.trim() ? sugestao.video.trim() : null
        const tempoRecebido = String(sugestao.tempo ?? '').trim()
        const tempo = /^\d{1,3}:\d{2}:\d{2}$/.test(tempoRecebido)
            ? tempoRecebido
            : (/^\d{1,3}:\d{2}$/.test(tempoRecebido) ? `${tempoRecebido}:00` : '')

        if (!titulo || titulo.length > 50 || !descricao || descricao.length > 200 ||
            !/^https?:\/\/.{1,1990}$/.test(foto) || !tempo ||
            (video && (!/^https?:\/\/.+/.test(video) || video.length > 2083))) {
            customMessage.ERROR_BAD_REQUEST.field = '[DADOS PRINCIPAIS DA RECEITA] INVÁLIDOS'
            return customMessage.ERROR_BAD_REQUEST
        }

        const [dificuldades, custos, porcoes, categoriasDisponiveis, unidades] = await Promise.all([
            dificuldadeDAO.selectAllDificuldade(),
            custoDAO.selectAllCusto(),
            porcaoDAO.selectallPorcao(),
            categoriaDAO.selectAllCategoria(),
            unidadeMedidaDAO.selectALLUnidadeMedida()
        ])

        if ([dificuldades, custos, porcoes, categoriasDisponiveis, unidades].some(lista => !Array.isArray(lista))) {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

        const dificuldadeTexto = normalizarTextoCatalogo(sugestao.dificuldade)
        const dificuldadeAliases = dificuldadeTexto.startsWith('facil')
            ? ['facil']
            : ((dificuldadeTexto.startsWith('med') || dificuldadeTexto.startsWith('moder'))
                ? ['media', 'medio']
                : (dificuldadeTexto.startsWith('dificil') ? ['dificil'] : []))
        const dificuldade = dificuldades.find(item => dificuldadeAliases.includes(normalizarTextoCatalogo(item.dificuldade)))

        const custoTexto = normalizarTextoCatalogo(sugestao.custo)
        const custoAliases = ['baixo', 'economico', 'economica'].includes(custoTexto)
            ? ['economico', 'economica']
            : (['medio', 'media', 'moderado', 'moderada'].includes(custoTexto)
                ? ['moderado', 'moderada']
                : (['alto', 'alta'].includes(custoTexto) ? ['alto', 'alta'] : []))
        const custo = custos.find(item => custoAliases.includes(normalizarTextoCatalogo(item.tipo_custo)))

        const quantidadePorcoes = Number(sugestao.porcao ?? sugestao.id_porcao)
        const porcao = porcoes.find(item => Number(item.numero_porcao) === Math.min(15, Math.max(1, Math.round(quantidadePorcoes))))

        if (!dificuldade || !custo || !porcao || !Number.isFinite(quantidadePorcoes) || quantidadePorcoes < 1) {
            customMessage.ERROR_BAD_REQUEST.field = '[CUSTO, DIFICULDADE OU PORÇÕES] INVÁLIDOS'
            return customMessage.ERROR_BAD_REQUEST
        }

        const categoriasSolicitadas = Array.isArray(sugestao.categorias) ? sugestao.categorias : []
        const categoriasReceita = [...new Set(categoriasSolicitadas
            .map(item => normalizarTextoCatalogo(item))
            .filter(Boolean))]
            .map(nome => categoriasDisponiveis.find(item => normalizarTextoCatalogo(item.categoria) === nome))
            .filter(Boolean)
            .map(item => ({ id: Number(item.id) }))

        if (!categoriasReceita.length) {
            customMessage.ERROR_BAD_REQUEST.field = '[CATEGORIA] NÃO CORRESPONDE AO CATÁLOGO DA PLATAFORMA'
            return customMessage.ERROR_BAD_REQUEST
        }

        const ingredientesRecebidos = Array.isArray(sugestao.ingredientes) ? sugestao.ingredientes : []
        const ingredientes = []
        for (const item of ingredientesRecebidos) {
            const nome = typeof item?.nome === 'string' ? item.nome.trim() : ''
            const quantidadeRecebida = String(item?.quantidade ?? '').trim().replace(',', '.')
            const quantidade = Number(quantidadeRecebida)
            const unidadeTexto = normalizarTextoCatalogo(item?.id_unidade_medida)
            const unidadeNumerica = Number(item?.id_unidade_medida)
            const unidade = Number.isInteger(unidadeNumerica) && unidadeNumerica > 0
                ? unidades.find(registro => Number(registro.id) === unidadeNumerica)
                : unidades.find(registro => normalizarTextoCatalogo(registro.unidade) === unidadeTexto)

            if (!nome || nome.length > 35 || !Number.isFinite(quantidade) || quantidade <= 0 ||
                quantidadeRecebida.length > 10 || !unidade) {
                customMessage.ERROR_BAD_REQUEST.field = '[INGREDIENTES OU UNIDADES] INVÁLIDOS'
                return customMessage.ERROR_BAD_REQUEST
            }

            ingredientes.push({
                nome,
                quantidade: String(quantidade),
                id_unidade_medida: Number(unidade.id)
            })
        }

        const preparoRecebido = Array.isArray(sugestao.modo_preparo) ? sugestao.modo_preparo : []
        const modoPreparo = preparoRecebido
            .map((etapa, indice) => ({
                metodo_preparo: typeof etapa?.metodo_preparo === 'string' ? etapa.metodo_preparo.trim() : '',
                ordem_preparo: Number(etapa?.ordem_preparo ?? indice + 1)
            }))
            .filter(etapa => etapa.metodo_preparo)
            .sort((a, b) => a.ordem_preparo - b.ordem_preparo)

        if (!ingredientes.length || !modoPreparo.length ||
            ingredientes.length > 40 || modoPreparo.some(etapa => etapa.metodo_preparo.length > 250)) {
            customMessage.ERROR_BAD_REQUEST.field = '[INGREDIENTES OU MODO DE PREPARO] INVÁLIDOS'
            return customMessage.ERROR_BAD_REQUEST
        }

        const tags = [...new Set((Array.isArray(sugestao.tags) ? sugestao.tags : [])
            .map(tag => String(tag ?? '').replace(/^#/, '').trim())
            .filter(tag => tag && tag.length <= 30))]
            .slice(0, 20)
            .map(nome_tag => ({ nome_tag }))

        const receitaParaCadastro = {
            titulo,
            descricao,
            foto,
            video,
            tempo,
            id_custo: Number(custo.id),
            id_dificuldade: Number(dificuldade.id),
            id_porcao: Number(porcao.id),
            id_usuario: ID_USUARIO_CHEFINHO,
            ingredientes,
            modo_preparo: modoPreparo,
            categoria: categoriasReceita,
            tags
        }

        const resultadoCadastro = await controllerReceita.inserirNovaReceita(receitaParaCadastro, 'application/json')
        if (!resultadoCadastro?.status) return resultadoCadastro || customMessage.ERROR_INTERNAL_SERVER_CONTROLLER

        const idReceita = Number(resultadoCadastro.response?.id ?? receitaParaCadastro.id)
        if (!Number.isInteger(idReceita) || idReceita <= 0) {
            return {
                status: false,
                status_code: 500,
                message: 'A receita foi processada, mas não foi possível confirmar seu identificador. Verifique a lista de receitas antes de tentar novamente.'
            }
        }

        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
        customMessage.DEFAULT_MESSAGE.message = 'Receita sugerida pelo Chefinho publicada com sucesso.'
        customMessage.DEFAULT_MESSAGE.response = { id: idReceita, id_usuario: ID_USUARIO_CHEFINHO }
        return customMessage.DEFAULT_MESSAGE
    } catch (error) {
        console.log('Erro ao salvar sugestão do Chefinho:', error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarConversasDoUsuario = async function (idUsuario) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let conversas = await chefinhoDAO.selectConversasByUsuario(idUsuario)

        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_RESPONSE.message
        customMessage.DEFAULT_MESSAGE.response = { dados: conversas }

        return customMessage.DEFAULT_MESSAGE
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarDetalhesDeUmaConversa = async function (idConversa, idUsuario) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (isNaN(idConversa)) {
            return customMessage.ERROR_BAD_REQUEST
        }

        let conversa = await chefinhoDAO.selectConversaById(idConversa)

        if (!conversa || conversa.id_usuario != idUsuario) {
            return customMessage.ERROR_NOT_FOUND
        }

        let mensagens = await chefinhoDAO.selectMensagensByConversa(idConversa)

        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_RESPONSE.message
        customMessage.DEFAULT_MESSAGE.response = { id: conversa.id, titulo: conversa.titulo, mensagens }

        return customMessage.DEFAULT_MESSAGE
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const deletarConversa = async function (idConversa, idUsuario) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (isNaN(idConversa)) {
            return customMessage.ERROR_BAD_REQUEST
        }

        let conversa = await chefinhoDAO.selectConversaById(idConversa)

        if (!conversa || conversa.id_usuario != idUsuario) {
            return customMessage.ERROR_NOT_FOUND
        }

        await chefinhoDAO.deleteConversa(idConversa)

        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_DELETED_ITEM.status
        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_DELETED_ITEM.status_code
        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_DELETED_ITEM.message

        return customMessage.DEFAULT_MESSAGE
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const avaliarComunidade = async function (comunidade, motivo, detalhe) {
    try {
        let resposta = await fetch(`${process.env.CHEFINHO_URL}/v1/chefinho/moderacao/comunidade`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.CHEFINHO_API_KEY
            },
            body: JSON.stringify({ motivo, detalhe, comunidade }),
            signal: AbortSignal.timeout(TIMEOUT_CHEFINHO)
        })

        let retorno = await resposta.json()

        return retorno.success ? retorno.response_ia.apagar : null
    } catch (error) {
        return null
    }
}

const avaliarDenuncia = async function (tipo, corpo) {
    try {
        let resposta = await fetch(`${process.env.CHEFINHO_URL}/v1/chefinho/moderacao/${tipo}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.CHEFINHO_API_KEY
            },
            body: JSON.stringify(corpo),
            signal: AbortSignal.timeout(TIMEOUT_CHEFINHO)
        })

        let retorno = await resposta.json()

        return retorno.success ? retorno.response_ia.apagar : null
    } catch (error) {
        return null
    }
}

module.exports = {
    inserirConversa,
    inserirNovaMensagemConversa,
    listarConversasDoUsuario,
    buscarDetalhesDeUmaConversa,
    deletarConversa,
    avaliarComunidade,
    avaliarDenuncia,
    sugerirReceita,
    salvarSugestaoReceita
}