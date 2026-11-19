const auth = require('../middleware/auth.js')

const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerChefinho = require('../controller/chefinho/controller_chefinho.js')

router.post('/', auth.verifyToken, bodyParserJSON, async function (request, response) {
    let idUsuario = request.id_usuario

    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerChefinho.inserirConversa(dados, contentType, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

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

router.delete('/:id', auth.verifyToken, async function (request, response) {
    let idUsuario = request.id_usuario

    let id = request.params.id

    let result = await controllerChefinho.deletarConversa(id, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

router.post('/:id/mensagens', auth.verifyToken, bodyParserJSON, async function (request, response) {
    let idUsuario = request.id_usuario

    let id = request.params.id

    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerChefinho.inserirNovaMensagemConversa(id, dados, contentType, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router