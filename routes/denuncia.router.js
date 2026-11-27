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
    let idUsuarioDenunciante = request.id_usuario
    let idComunidade = request.params.id
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerDenuncia.inserirDenunciaComunidade(idComunidade, dados, contentType, idUsuarioDenunciante)

    response.status(result.status_code)
    response.json(result)
})

router.post('/receita/:id', auth.verifyToken, bodyParserJSON, async function (request, response) {
    let idUsuarioDenunciante = request.id_usuario
    let idReceita = request.params.id
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerDenuncia.inserirDenunciaReceita(idReceita, dados, contentType, idUsuarioDenunciante)

    response.status(result.status_code)
    response.json(result)
})

router.post('/usuario/:id', auth.verifyToken, bodyParserJSON, async function (request, response) {
    let idUsuarioDenunciante = request.id_usuario
    let idUsuarioDenunciado = request.params.id
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerDenuncia.inserirDenunciaUsuario(idUsuarioDenunciado, dados, contentType, idUsuarioDenunciante)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router