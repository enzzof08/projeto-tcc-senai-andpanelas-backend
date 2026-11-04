const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerDenuncia = require('../controller/denuncia/controller_denuncia')

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerDenuncia.inserirDenuncia(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {
    let result = await controllerDenuncia.listarDenuncia()

    response.status(result.status_code)
    response.json(result)
})

module.exports = router