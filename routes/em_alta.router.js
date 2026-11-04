const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerEmAlta = require('../controller/em_alta/controller_em_alta')

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerEmAlta.inserirNovoEmAlta(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let id = request.params.id

    let result = await controllerEmAlta.atualizarEmAlta(dados,id ,contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {

    let result = await controllerEmAlta.listarEmAlta()

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function(request,response){
    let id = request.params.id

    let result = await controllerEmAlta.excluirEmAlta(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router