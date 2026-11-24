const auth = require('../middleware/auth.js')

const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerComunidade = require('../controller/comunidade/controller_comunidade.js')
const controllerComunidadeReceita = require('../controller/receita/controller_comunidade_receita.js')
const controllerComunidadeUsuario = require('../controller/comunidade_usuario/controller_comunidade_usuario.js')

router.post('/',  bodyParserJSON, auth.verifyToken, async function (request, response) {
    let idUser = request.id_usuario

    let dados = request.body

    //let idUser = request.params.idUser

    let contentType = request.headers['content-type']
    console.log(idUser)

    let result = await controllerComunidade.inserirNovaComunidade(dados, idUser, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id',  bodyParserJSON, auth.verifyToken, async function (request, response) {

    let idUser = request.id_usuario

    let dados = request.body

    let idComunidade = request.params.id

    let contentType = request.headers['content-type']

    let result = await controllerComunidade.atualizarComunidade(dados, idUser, idComunidade, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/',auth.verifyToken, async function (request, response) {

    let idUser = request.id_usuario
    let result = await controllerComunidade.listarComunidade(idUser)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id',auth.verifyToken, async function (request, response) {
    let idComunidade = request.params.id
    let idUser = request.id_usuario

    let result = await controllerComunidade.buscarComunidade(idUser, idComunidade)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', auth.verifyToken, async function(request,response){
    let idUsuario = request.id_usuario
    let idComunidade = request.params.id

    let result = await controllerComunidade.excluirComunidade(idUsuario, idComunidade)

    response.status(result.status_code)
    response.json(result)
})

//RECEITAS
router.get('/:id/receitas', auth.verifyToken, async function (request, response) {
    let idComunidade = request.params.id
    let idUsuario = request.id_usuario

    let result = await controllerComunidadeReceita.buscarReceitaPorComunidade(idUsuario, idComunidade)

    response.status(result.status_code)
    response.json(result)
})


//USUARIO INTERACOES
router.post('/:idComunidade/entrar' , auth.verifyToken, async function (request, response) {
    let idUser = request.id_usuario
    let idComunidade = request.params.idComunidade

    let result = await controllerComunidadeUsuario.inserirNovaComunidadeUsuario(idUser, idComunidade)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:idComunidade/sair', auth.verifyToken, async function (request, response) {
    let idUser = request.id_usuario
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