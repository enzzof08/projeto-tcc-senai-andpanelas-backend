const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerGeladeira = require('../controller/geladeira/controller_geladeira.js')

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerGeladeira.inserirNovaGeladeiraIngrediente(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let idUsuario = request.params.id

    let result = await controllerGeladeira.listarGeladeiraIngredientes(idUsuario)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function(request,response){
    let id = request.params.id

    let result = await controllerGeladeira.excluirGeladeirasIngredientes(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router