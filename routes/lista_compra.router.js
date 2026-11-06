const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerListaCompra = require('../controller/lista_compra/controller_lista_compra.js')

router.post('/receita/:idUsuario/:idReceita', bodyParserJSON, async function (request, response) {
    let receita = request.params.idReceita
    let usuario = request.params.idUsuario

    let result = await controllerListaCompra.inserirListaCompra(usuario, receita)

    response.status(result.status_code)
    response.json(result)
})

router.get('/receitas/receitas/:id' , async function (request, response) {
    let idUsuario = request.params.id

    let result = await controllerListaCompra.listarReceitasListaCompra(idUsuario)

    response.status(result.status_code)
    response.json(result)
})


// router.get('/:id', async function (request, response) {
//     let idUsuario = request.params.id

//     let result = await controllerGeladeira.listarGeladeiraIngredientes(idUsuario)

//     response.status(result.status_code)
//     response.json(result)
// })

// router.delete('/:id', async function(request,response){
//     let id = request.params.id

//     let result = await controllerGeladeira.excluirGeladeirasIngredientes(id)

//     response.status(result.status_code)
//     response.json(result)
// })



module.exports = router