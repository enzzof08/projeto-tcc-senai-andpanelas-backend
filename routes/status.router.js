const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerStatus = require('../controller/status/controller_status')

router.get('/', async function (request, response) {

    let result = await controllerEmAlta.listarEmAlta()

    response.status(result.status_code)
    response.json(result)
})

module.exports = router