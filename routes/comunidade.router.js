const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerComunidade = require('../controller/comunidade/controller_comunidade.js')
const controllerComunidadeReceita = require('../controller/receita/controller_comunidade_receita.js')
const controllerComunidadeUsuario = require('../controller/comunidade_usuario/controller_comunidade_usuario.js')

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerComunidade.inserirNovaComunidade(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let id = request.params.id

    let contentType = request.headers['content-type']

    let result = await controllerComunidade.atualizarComunidade(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {

    let result = await controllerComunidade.listarComunidade()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerComunidade.buscarComunidade(id)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function(request,response){
    let id = request.params.id

    let result = await controllerComunidade.excluirComunidade(id)

    response.status(result.status_code)
    response.json(result)
})

//RECEITAS
router.get('/:id/receitas', async function (request, response) {
    let idComunidade = request.params.id

    let result = await controllerComunidadeReceita.buscarReceitaPorComunidade(idComunidade)

    response.status(result.status_code)
    response.json(result)
})


//USUARIO INTERACOES
router.post('/:idUser/:idComunidade/entrar', async function (request, response) {
    let idUser = request.params.idUser
    let idComunidade = request.params.idComunidade

    let result = await controllerComunidadeUsuario.inserirNovaComunidadeUsuario(idUser, idComunidade)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:idUser/:idComunidade/sair', async function (request, response) {
    let idUser = request.params.idUser
    let idComunidade = request.params.idComunidade
    let result = await controllerComunidadeUsuario.excluirComunidadeUsuario(idUser, idComunidade)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:idComunidade/membros', async function (request, response) {
    let idComunidade = request.params.idComunidade

    let result = await controllerComunidadeUsuario.buscarUsuariosPorComunidade(idComunidade)

    response.status(result.status_code)
    response.json(result)
})



module.exports = router