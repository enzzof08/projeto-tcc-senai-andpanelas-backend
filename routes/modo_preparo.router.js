const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerModoPreparo = require('../controller/modo_preparo/controller_modo_preparo')

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerModoPreparo.inserirModoPreparo(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {

    let id = request.params.id

    let result = await controllerModoPreparo.buscarModoPreparo()

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function(request,response){
    let id = request.params.id

    let result = await controllerModoPreparo.excluirModoPreparoPorReceita(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router