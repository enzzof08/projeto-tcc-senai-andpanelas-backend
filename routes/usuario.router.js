const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerUsuario = require('../controller/usuario/controller_usuario.js')
const controllerSeguidor = require('../controller/seguidores/controller_seguidores.js')

router.post('/registro', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerUsuario.inserirNovoUsuario(dados, contentType)

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

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerUsuario.buscarUsuario(id)

    response.status(result.status_code)
    response.json(result)
})


// SEGUIR INTERACOES
router.post('/:idSeguidor/:idSeguindo/seguir', async function (request, response) {
    let idSeguidor = request.params.idSeguidor
    let idSeguindo = request.params.idSeguindo

    let result = await controllerSeguidor.inserirNovoSeguidor(idSeguindo, idSeguidor)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:idSeguidor/:idSeguindo/deixar-seguir', async function (request, response) {
    let idSeguidor = request.params.idSeguidor
    let idSeguindo = request.params.idSeguindo

    let result = await controllerSeguidor.excluirSeguidor(idSeguindo, idSeguidor)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:idUser/seguidores', async function (request, response) {
    let idUsuario = request.params.idUser

    let result = await controllerSeguidor.listarSeguidores(idUsuario)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:idUser/seguindo', async function (request, response) {
    let idUsuario = request.params.idUser

    let result = await controllerSeguidor.listarSeguindo(idUsuario)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router