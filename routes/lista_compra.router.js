const auth = require('../middleware/auth.js')

const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerListaCompra = require('../controller/lista_compra/controller_lista_compra.js')

router.post('/receita/:idUsuario/:idReceita', auth.verifyToken, bodyParserJSON, async function (request, response) {
    let idUsuario = request.id_usuario
    let receita = request.params.idReceita
    let usuario = request.params.idUsuario

    let result = await controllerListaCompra.inserirListaCompra(usuario, receita, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

router.get('/receitas/:idUser' , async function (request, response) {
    let idUsuario = request.params.idUser

    let result = await controllerListaCompra.listarReceitasListaCompra(idUsuario)

    response.status(result.status_code)
    response.json(result)
})

router.get('/receitas/:idUser/:idReceita' , async function (request, response) {
    let idUsuario = request.params.idUser
    let idReceita = request.params.idReceita
    let status = request.query.status

    let result = await controllerListaCompra.listarIngredientesListaCompraReceita(idUsuario, idReceita, status)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:idUser/:idLista/:idStatus' , auth.verifyToken, async function (request, response) {
    let idLista = request.params.idLista
    let idUsuario = request.params.idUser
    let idStatus = request.params.idStatus

    console.log(idUsuario)

    let result = await controllerListaCompra.atualizarStatusListaCompra(idLista, idUsuario, idStatus, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:idUser/:idReceita' , auth.verifyToken, async function (request, response) {
    let idUsuario = request.params.idUser
    let idReceita = request.params.idReceita

    let result = await controllerListaCompra.excluirReceitaListaCompra(idUsuario, idReceita, idUsuario)

    response.status(result.status_code)
    response.json(result)
})




module.exports = router