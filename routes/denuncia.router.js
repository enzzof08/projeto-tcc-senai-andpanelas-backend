const auth = require('../middleware/auth.js')

const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerDenuncia = require('../controller/denuncia/controller_denuncia')

router.post('/', auth.verifyToken, bodyParserJSON, async function (request, response) {
    let idUsuario = request.id_usuario

    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerDenuncia.inserirDenuncia(dados, contentType, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {
    let result = await controllerDenuncia.listarDenuncia()

    response.status(result.status_code)
    response.json(result)
})

router.post('/comunidade/:id', auth.verifyToken, bodyParserJSON, async function (request, response) {
    let idUsuario = request.id_usuario
    let id = request.params.id

    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerDenuncia.inserirDenunciaComunidade(id, dados, contentType, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

router.post('/receita/:id', auth.verifyToken, bodyParserJSON, async function (request, response) {
    let idUsuario = request.id_usuario

    let id = request.params.id

    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerDenuncia.inserirDenunciaReceita(id, dados, contentType, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

router.post('/usuario/:id', auth.verifyToken, bodyParserJSON, async function (request, response) {
    let idUsuario = request.id_usuario

    let id = request.params.id

    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerDenuncia.inserirDenunciaUsuario(id, dados, contentType, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router