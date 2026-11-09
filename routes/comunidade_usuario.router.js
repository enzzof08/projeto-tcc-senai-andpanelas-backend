const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerComunidadeUsuario = require('../controller/comunidade_usuario/controller_comunidade_usuario')

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerComunidadeUsuario.inserirNovaComunidadeUsuario(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerComunidadeUsuario.buscarComunidadePorUsuario(id)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerComunidadeUsuario.buscarUsuarioPorComunidade(id)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function(request,response){
    let id = request.params.id

    let result = await controllerComunidadeUsuario.excluirComunidadeUsuario(id)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function(request,response){
    let id = request.params.id

    let result = await controllerComunidadeUsuario.excluirUsuarioComunidade(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router