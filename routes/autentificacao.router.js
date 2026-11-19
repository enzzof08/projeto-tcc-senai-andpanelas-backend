const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerUsuario = require('../controller/usuario/controller_usuario.js')

router.post('/registro', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerUsuario.inserirNovoUsuario(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.post('/:idUser/verificar-email/', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let idUser = request.params.idUser
    let contentType = request.headers['content-type']

    let result = await controllerUsuario.verificarEmail(dados, idUser, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.post('/:idUser/reenviar-codigo', async function (request, response) {

    let idUser = request.params.idUser

    let result = await controllerUsuario.reenviarCodigo(idUser)

    response.status(result.status_code)
    response.json(result)
})

router.post('/login', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerUsuario.loginUsuario(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.post('/recuperar-senha', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerUsuario.esqueciSenha(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

// Front tem q guarda o email temporariamente para enviar aqui dnv
router.post('/verificar-codigo-reset', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerUsuario.verificarCodigoRecuperacao(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.post('/redefinir-senha', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerUsuario.redefinirSenha(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})


module.exports = router