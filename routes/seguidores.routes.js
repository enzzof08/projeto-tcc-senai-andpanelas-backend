const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerSeguidores = require('../controller/seguidores/controller_seguidores')

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerSeguidores.inserirNovoSeguidor(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {

    let result = await controllerSeguidores.listarSeguidores()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerSeguidores.buscarSeguidores(id)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function(request,response){
    let id = request.params.id

    let result = await controllerSeguidores.excluirSeguidores(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router