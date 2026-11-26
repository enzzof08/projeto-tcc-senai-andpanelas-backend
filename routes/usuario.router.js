const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()
const auth = require('../middleware/auth.js')

const controllerUsuario = require('../controller/usuario/controller_usuario.js')
const controllerSeguidor = require('../controller/seguidores/controller_seguidores.js')
const controllerReceita = require('../controller/receita/controller_receita.js')
const controllerComunidadeUsuario = require('../controller/comunidade_usuario/controller_comunidade_usuario.js')


router.get('/', auth.verifyToken, async function (request, response) {
    let idUserLogado = request.id_usuario

    let result = await controllerUsuario.listarTodosUsuarios(idUserLogado, request.query.limite)

    response.status(result.status_code)
    response.json(result)
})

router.get('/me', auth.verifyToken, async function (request, response) {
    let idUserPerfil = request.id_usuario

    let result = await controllerUsuario.buscarUsuario(idUserPerfil)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:idUserPerfil', auth.verifyToken, async function (request, response) {
    let idUserPerfil = request.params.idUserPerfil
    let idUserLogado = request.id_usuario

    // O Chefinho é um perfil de sistema: suas receitas podem ser públicas,
    // mas a página de perfil não deve ser acessível como a de um usuário comum.
    if (Number(idUserPerfil) === 1) {
        return response.status(404).json({
            status: false,
            status_code: 404,
            message: 'Usuário não encontrado.'
        })
    }

    let result = await controllerUsuario.buscarUsuario(idUserPerfil, idUserLogado)

    response.status(result.status_code)
    response.json(result)
})

router.get('/busca/username', auth.verifyToken, async function (request, response) {
    let username = request.query.nome
    let idUserLogado = request.id_usuario

    let result = await controllerUsuario.buscarUsuariosPorNome(username, idUserLogado)

    response.status(result.status_code)
    response.json(result)
})
router.put('/me', bodyParserJSON, auth.verifyToken, async function (request, response) {
    let idUserPerfil = request.id_usuario
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerUsuario.atualizarUsuario(dados, idUserPerfil, contentType)

    response.status(result.status_code)
    response.json(result)
})

//BUSCAR RECEITAS DO PROPRIO USUARIO
router.get('/me/receitas', auth.verifyToken, async function (request, response) {

    let idUsuario = request.id_usuario
    let idUserLogado = request.id_usuario

    let result = await controllerReceita.buscarReceitasPorUsuario(idUsuario, idUserLogado)

    response.status(result.status_code)
    response.json(result)
})

// BUSCAR RECEITAS DE UM USUARIO
router.get('/:idUsuario/receitas', auth.verifyToken, async function (request, response) {

    let idUsuario = request.params.idUsuario
    let idUserLogado = request.id_usuario

    let result = await controllerReceita.buscarReceitasPorUsuario(idUsuario, idUserLogado)

    response.status(result.status_code)
    response.json(result)
})


// BUSCAR RECEITAS SALVAS DO USUARIO
router.get('/receitas/salvas/me', auth.verifyToken, async function (request, response) {

    let idUsuario = request.id_usuario
    let idUserLogado = request.id_usuario

    let result = await controllerReceita.buscarReceitasSalvasUsuario(idUsuario, idUserLogado)

    response.status(result.status_code)
    response.json(result)
})

router.get('/receitas/salvas/:idUsuario', auth.verifyToken, async function (request, response) {

    let idUsuario = request.params.idUsuario
    let idUserLogado = request.id_usuario

    let result = await controllerReceita.buscarReceitasSalvasUsuario(idUsuario, idUserLogado)

    response.status(result.status_code)
    response.json(result)
})


// BUSCAR COMUNIDADES QUE USUARIO PARTICIPA

router.get('/comunidades/me', auth.verifyToken, async function (request, response) {

    let idUsuario = request.id_usuario

    let result = await controllerComunidadeUsuario.buscarComunidadesPorUsuario(idUsuario)

    response.status(result.status_code)
    response.json(result)
})

router.get('/comunidades/:idUsuario', async function (request, response) {

    let idUsuario = request.params.idUsuario

    let result = await controllerComunidadeUsuario.buscarComunidadesPorUsuario(idUsuario)

    response.status(result.status_code)
    response.json(result)
})


// SEGUIR INTERACOES
router.post('/seguir/:idSeguindo', auth.verifyToken, async function (request, response) {
    let idSeguidor = request.id_usuario
    let idSeguindo = request.params.idSeguindo

    let result = await controllerSeguidor.inserirNovoSeguidor(idSeguindo, idSeguidor)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/deixar-seguir/:idSeguindo', auth.verifyToken, async function (request, response) {
    let idSeguidor = request.id_usuario
    let idSeguindo = request.params.idSeguindo

    let result = await controllerSeguidor.excluirSeguidor(idSeguindo, idSeguidor)

    response.status(result.status_code)
    response.json(result)
})

router.get('/seguidores/:idUser', async function (request, response) {
    let idUsuario = request.params.idUser

    let result = await controllerSeguidor.listarSeguidores(idUsuario)

    response.status(result.status_code)
    response.json(result)
})

router.get('/seguindos/:idUser', async function (request, response) {
    let idUsuario = request.params.idUser

    let result = await controllerSeguidor.listarSeguindo(idUsuario)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router