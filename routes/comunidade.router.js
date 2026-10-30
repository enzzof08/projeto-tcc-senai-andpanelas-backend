const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerComunidade = require('../controller/comunidade/controller_comunidade.js')

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerComunidade.inserirNovaComunidade(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let id = request.params.id

    let contentType = request.headers['content-type']

    let result = await controllerComunidade.atualizarComunidade(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {

    let result = await controllerComunidade.listarComunidade()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerComunidade.buscarComunidade(id)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function(request,response){
    let id = request.params.id

    let result = await controllerComunidade.excluirComunidade(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router