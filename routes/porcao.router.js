const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerPorcao = require('../controller/porcao/controller_porcao')


router.get('/', async function (request, response) {

    let result = await controllerPorcao.listarPorcao()

    response.status(result.status_code)
    response.json(result)
})


router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerPorcao.buscarPorcao(id)

    response.status(result.status_code)
    response.json(result)
})


module.exports = router