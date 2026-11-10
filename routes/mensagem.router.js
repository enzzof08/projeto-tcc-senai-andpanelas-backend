const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerMensagem = require('../controller/mensagem/controller_mensagem.js')

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerMensagem.inserirNovaMensagem(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {

    let result = await controllerMensagem.listarMensagem()

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function(request,response){
    let id = request.params.id

    let result = await controllerMensagem.excluirMensagem(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router