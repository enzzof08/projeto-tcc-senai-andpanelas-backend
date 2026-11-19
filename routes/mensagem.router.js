const auth = require('../middleware/auth.js')

const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerMensagem = require('../controller/mensagem/controller_mensagem.js')

router.post('/', auth.verifyToken, bodyParserJSON, async function (request, response) {
    let idUsuario = request.id_usuario
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerMensagem.inserirNovaMensagem(dados, contentType, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {

    let result = await controllerMensagem.listarMensagem()

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', auth.verifyToken, async function(request,response){
    let idUsuario = request.id_usuario
    let id = request.params.id

    let result = await controllerMensagem.excluirMensagem(id, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router