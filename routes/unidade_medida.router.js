const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerUnidadeMedida = require('../controller/unidade_medida/controller_unidade_medida')

router.get('/', async function (request, response) {

    let result = await controllerUnidadeMedida.listarUnidadeMedida()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {

    let id = request.params.id

    let result = await controllerUnidadeMedida.buscarUnidadeMedida()

    response.status(result.status_code)
    response.json(result)
})

module.exports = router