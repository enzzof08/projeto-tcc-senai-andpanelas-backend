const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerDificuldade = require('../controller/dificuldade/controller_dificuldade')

router.get('/', async function (request, response) {
    let result = await controllerDificuldade.listarDificuldade()

    response.status(result.status_code)
    response.json(result)
})


router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerDificuldade.buscarDificuldade(id)

    response.status(result.status_code)
    response.json(result)
})


module.exports = router