const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerChefinho = require('../controller/chefinho/controller_chefinho.js')

router.get('/', async function (request, response) {
    let result = await controllerChefinho.listarConversasDoUsuario()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerChefinho.buscarDetalhesDeUmaConversa(id)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function (request, response) {
    let id = request.params.id
    
    let result = await controllerChefinho.deletarConversa(id)

    response.status(result.status_code)
    response.json(result)
})

router.post('/:id/mensagens', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerChefinho.inserirNovaMensagemConversa(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})