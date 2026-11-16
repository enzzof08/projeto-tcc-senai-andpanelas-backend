const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerDenunciaComunidade = require('../controller/denuncia_comunidade/controller_denuncia_comunidade')

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerDenunciaComunidade.inserirDenunciaComunidade(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let dados = request.body

    let result = await controllerDenunciaComunidade.buscarDenunciaByIdComunidade(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let dados = request.body

    let result = await controllerDenunciaComunidade.buscarComunidadeByIdDenuncia(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router