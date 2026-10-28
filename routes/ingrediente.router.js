const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerIngrediente = require('../controller/ingrediente/controller_ingrediente.js')


router.get('/buscar/:ingrediente', async function (request, response) {

    let ingrediente = request.params.ingrediente

    let result = await controllerIngrediente.corrigirIngredienteNome(ingrediente)

    response.status(result.status_code)
    response.json(result)
})


module.exports = router