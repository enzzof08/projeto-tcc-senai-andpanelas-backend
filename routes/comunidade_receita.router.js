const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerComunidadeReceita = require('../controller/comunidade_receita/controller_comunidade_receita')

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerComunidadeReceita.inserirNovaComunidadeReceita(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerComunidadeReceita.buscarComunidadeReceita(id)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerComunidadeReceita.buscarReceitaComunidade(id)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function(request,response){
    let id = request.params.id

    let result = await controllerComunidadeReceita.excluirComunidadeReceita(id)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function(request,response){
    let id = request.params.id

    let result = await controllerComunidadeReceita.excluirReceitaComunidade(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router