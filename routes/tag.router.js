const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerTag = require('../controller/tag/controller_tag')

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerTag.inserirNovaTag(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let id = request.params.id

    let result = await controllerTag.atualizarTag(dados,id ,contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {

    let result = await controllerTag.listarTag()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {

    let id = request.params.id

    let result = await controllerTag.buscarTag()

    response.status(result.status_code)
    response.json(result)
})

module.exports = router