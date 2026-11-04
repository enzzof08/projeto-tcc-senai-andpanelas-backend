const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerCategoriaPrincipal = require('../controller/categoria_principal/controller_categoria_principal')


router.get('/', async function (request, response) {
    let result = await controllerCategoriaPrincipal.listarCategoriaPrincipal()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerCategoriaPrincipal.buscarCategoriaPrincipal(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router