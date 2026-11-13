const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerComentario = require('../controller/comentario/controller_comentario')

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerComentario.inserirComentario(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let id = request.params.id

    let result = await controllerComentario.atualizarComentario(dados, id ,contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {

    let id = request.params.id
    let idReceita = request.query.receita

    let result = await controllerComentario.buscarComentarioPelaReceita(id, idReceita)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function(request, response){
    let id = request.params.id

    let result = await controllerComentario.excluirComentario(id)

    response.status(result.status_code)
    response.json(result)
})

