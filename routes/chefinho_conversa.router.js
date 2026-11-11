const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerChefinhoConversa = require('../controller/chefinho_conversa/controller_chefinho_conversa')

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerChefinhoConversa.inserirChefinhoConversa(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {

    let result = await controllerChefinhoConversa.listarChefinhoConversa()

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function(request,response){
    let id = request.params.id

    let result = await controllerChefinhoConversa.excluirChefinhoConversa(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router