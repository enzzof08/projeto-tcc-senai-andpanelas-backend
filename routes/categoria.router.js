const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerCategoria = require('../controller/categoria/controller_categoria')

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerCategoria.inserirNovaCategoria(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {
    let result = await controllerCategoria.listarCategoria()

    response.status(result.status_code)
    response.json(result)
})

module.exports = router