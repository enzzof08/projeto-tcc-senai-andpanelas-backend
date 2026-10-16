const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerCusto = require('../controller/custo/controller_custo.js')

router.get('/', async function (request, response) {
    let result = await controllerCusto.listarCusto()

    response.status(result.status_code)
    response.json(result)
})


module.exports = router