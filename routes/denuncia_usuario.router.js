const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerDenunciaUsuario = require('../controller/denuncia_usuario/controller_denuncia_usuario')

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerDenunciaUsuario.inserirDenunciaUsuario(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let dados = request.body

    let result = await controllerDenunciaUsuario.buscarDenunciaByIdUsuario(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let dados = request.body

    let result = await controllerDenunciaUsuario.buscarUsuarioByIdDenuncia(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router