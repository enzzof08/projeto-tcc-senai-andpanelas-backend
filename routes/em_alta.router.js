const auth = require('../middleware/auth.js')

const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerEmAlta = require('../controller/em_alta/controller_em_alta')

router.post('/', auth.verifyToken, bodyParserJSON, async function (request, response) {
    let idUsuario = request.id_usuario
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerEmAlta.inserirNovoEmAlta(dados, contentType, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

// router.put('/:id', bodyParserJSON, async function (request, response) {
//     let dados = request.body

//     let contentType = request.headers['content-type']

//     let id = request.params.id

//     let result = await controllerEmAlta.atualizarEmAlta(dados,id ,contentType)

//     response.status(result.status_code)
//     response.json(result)
// })

router.get('/', async function (request, response) {

    let result = await controllerEmAlta.listarMaisPesquisados()

    response.status(result.status_code)
    response.json(result)
})

// router.get('/', async function (request, response) {

//     let result = await controllerEmAlta.listarEmAlta()

//     response.status(result.status_code)
//     response.json(result)
// })

router.delete('/:id', auth.verifyToken, async function(request,response){
    let idUsuario = request.id_usuario
    let id = request.params.id

    let result = await controllerEmAlta.excluirEmAlta(id, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router