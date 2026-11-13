const configMessages = require('../modulo/configMessages.js')

const chefinhoDAO = require('../../model/DAO/chefinho/chefinho.js')

const LIMITE_HISTORICO = 10
const LIMITE_PERGUNTA = 2000
const LIMITE_TITULO = 100
const TIMEOUT_CHEFINHO = 60000

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
    avaliarComunidade,
    avaliarDenuncia
}