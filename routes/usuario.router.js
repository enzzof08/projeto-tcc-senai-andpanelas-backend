const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerUsuario = require('../controller/usuario/controller_usuario.js')
const controllerSeguidor = require('../controller/seguidores/controller_seguidores.js')
const controllerReceita = require('../controller/receita/controller_receita.js')

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

router.get('/', async function (request, response) {

    let result = await controllerUsuario.listarTodosUsuarios()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:idUserPerfil', async function (request, response) {
    let idUserPerfil = request.params.idUserPerfil
    let idUserLogado = request.query.idUserLogado

    let result = await controllerUsuario.buscarUsuario(idUserPerfil, idUserLogado)

    response.status(result.status_code)
    response.json(result)
})

router.get('/me/:idUserPerfil', async function (request, response) {
    let idUserPerfil = request.params.idUserPerfil

    let result = await controllerUsuario.buscarUsuario(idUserPerfil)

    response.status(result.status_code)
    response.json(result)
})

router.get('/busca/username', async function (request, response) {
    let username = request.query.nome

    let result = await controllerUsuario.buscarUsuariosPorNome(username)

    response.status(result.status_code)
    response.json(result)
})

router.put('/me/:idUserPerfil', bodyParserJSON, async function (request, response) {
    let idUserPerfil = request.params.idUserPerfil
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerUsuario.atualizarUsuario(dados, idUserPerfil, contentType)

    response.status(result.status_code)
    response.json(result)
})

// BUSCAR RECEITAS DO USUARIO
router.get('/:idUsuario/receitas', async function (request, response) {

    let idUsuario = request.params.idUsuario

    let result = await controllerReceita.buscarReceitasPorUsuario(idUsuario)

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