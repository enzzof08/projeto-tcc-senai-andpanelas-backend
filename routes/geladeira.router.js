const auth = require('../middleware/auth.js')

const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerGeladeira = require('../controller/geladeira/controller_geladeira.js')

router.post('/', auth.verifyToken, bodyParserJSON, async function (request, response) {
    let idUsuario = request.id_usuario
    
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerGeladeira.inserirNovaGeladeiraIngrediente(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/receitas/compatibilidade/:id' , async function (request, response) {
    let idUsuario = request.params.id

    let result = await controllerGeladeira.buscarGeladeiraUsuarioReceitas(idUsuario)

    response.status(result.status_code)
    response.json(result)
})


router.get('/:id', async function (request, response) {
    let idUsuario = request.params.id

    let result = await controllerGeladeira.listarGeladeiraIngredientes(idUsuario)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', auth.verifyToken, async function(request,response){
    let idUsuario = request.id_usuario
    let id = request.params.id

    let result = await controllerGeladeira.excluirGeladeirasIngredientes(id, idUsuario)

    response.status(result.status_code)
    response.json(result)
})



module.exports = router