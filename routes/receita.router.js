const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerReceita = require('../controller/receita/controller_receita.js')
const controllerCurtida = require('../controller/curtida/controller_curtida.js')
const controllerSalvo = require('../controller/salvar/controller_salvar.js')


router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerReceita.inserirNovaReceita(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let dados = request.body

    let contentType = request.headers['content-type']

    let id = request.params.id

    let result = await controllerReceita.atualizarReceita(dados,id ,contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/busca/nome', async (req, res) => {
    let nome = req.query.nome

    let result = await controllerReceita.buscarReceitasPorNome(nome)

    res.status(result.status_code).json(result)
})

router.get('/', async function (request, response) {

    let result = await controllerReceita.listarReceitas()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id
    let idUsuario = request.query.usuario

    let result = await controllerReceita.buscarReceita(id, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

//Buscar de acordo com os ingredientes
router.get('/ingrediente/buscar', async function (request, response) {

    let ingredientes = request.query.ingredientes

    let result = await controllerReceita.buscarReceitasPorIngredientes(ingredientes)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function(request,response){
    let id = request.params.id

    let result = await controllerReceita.excluirReceita(id)

    response.status(result.status_code)
    response.json(result)
})

//INTERACOES
router.post('/:idUser/:idReceita/curtir', bodyParserJSON, async function (request, response) {
    let idUser = request.params.idUser
    let idReceita = request.params.idReceita

    let result = await controllerCurtida.inserirCurtida(idUser, idReceita)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:idUser/:idReceita/curtir' , async function (request, response) {
    let idUser = request.params.idUser
    let idReceita = request.params.idReceita

    let result = await controllerCurtida.excluirCurtida(idUser, idReceita)

    response.status(result.status_code)
    response.json(result)
})

router.post('/:idUser/:idReceita/salvar', bodyParserJSON, async function (request, response) {
    let idUser = request.params.idUser
    let idReceita = request.params.idReceita

    let result = await controllerSalvo.inserirSalvo(idUser, idReceita)

    response.status(result.status_code)
    response.json(result)
})


router.delete('/:idUser/:idReceita/salvar' , async function (request, response) {
    let idUser = request.params.idUser
    let idReceita = request.params.idReceita

    let result = await controllerSalvo.excluirSalvo(idUser, idReceita)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router