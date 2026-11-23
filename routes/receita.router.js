const auth = require('../middleware/auth.js')

const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerReceita = require('../controller/receita/controller_receita.js')
const controllerCurtida = require('../controller/curtida/controller_curtida.js')
const controllerSalvo = require('../controller/salvar/controller_salvar.js')
const controllerComentario = require('../controller/comentario/controller_comentario.js')



router.post('/', auth.verifyToken, bodyParserJSON, async function (request, response) {
    let idUsuario = request.id_usuario
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerReceita.inserirNovaReceita(dados, contentType, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', auth.verifyToken, bodyParserJSON, async function (request, response) {
    let idUsuario = request.id_usuario
    let dados = request.body

    let contentType = request.headers['content-type']

    let id = request.params.id

    let result = await controllerReceita.atualizarReceita(dados, id, contentType, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

router.post('/busca/sugestao', auth.verifyToken, bodyParserJSON, async function (request, response) {
    let idUsuario = request.id_usuario
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerChefinho.sugerirReceita(dados, contentType, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

router.get('/busca/nome', auth.verifyToken, async function (request, response) {
    let nome = request.query.nome
    let idUsuario = request.id_usuario

    let result = await controllerReceita.buscarReceitasPorNome(nome, idUsuario)

    response.status(result.status_code).json(result)
})

router.get('/', auth.verifyToken, async function (request, response) {

    let idUsuario = request.id_usuario
    let result = await controllerReceita.listarReceitas(idUsuario)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', auth.verifyToken, async function (request, response) {
    let idReceita = request.params.id
    let idUsuario = request.id_usuario

    let result = await controllerReceita.buscarReceita(idReceita, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

//Buscar de acordo com os ingredientes
router.get('/ingrediente/buscar', auth.verifyToken, async function (request, response) {
    let idUsuario = request.id_usuario
    let ingredientes = request.query.ingredientes

    let result = await controllerReceita.buscarReceitasPorIngredientes(ingredientes, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

//Buscar de acordo com os ingredientes
router.get('/busca/categoria/:idCategoria', auth.verifyToken, async function (request, response) {

    let idCategoria = request.params.idCategoria
    let idUsuario = request.id_usuario

    let result = await controllerReceita.buscarReceitasPorCategoria(idCategoria, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

//Buscar Receitas mais Populares Semana
router.get('/populares/semana', async function (request, response) {

    let result = await controllerReceita.buscarReceitasMaisCurtidasSemana()
    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', auth.verifyToken, async function (request, response) {
    let idUsuario = request_usuario
    let id = request.params.id

    let result = await controllerReceita.excluirReceita(id, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

//INTERACOES
router.post('/:idReceita/curtir', auth.verifyToken, bodyParserJSON, async function (request, response) {
    let idUsuario = request.id_usuario
    let idReceita = request.params.idReceita

    let result = await controllerCurtida.inserirCurtida(idUsuario, idReceita)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:idReceita/curtir', auth.verifyToken, async function (request, response) {
    let idUsuario = request.id_usuario
    let idReceita = request.params.idReceita

    let result = await controllerCurtida.excluirCurtida(idUsuario, idReceita)

    response.status(result.status_code)
    response.json(result)
})

router.post('/:idReceita/salvar', auth.verifyToken, bodyParserJSON, async function (request, response) {
    let idUsuario = request.id_usuario
    let idReceita = request.params.idReceita

    let result = await controllerSalvo.inserirSalvo(idUsuario, idReceita)

    response.status(result.status_code)
    response.json(result)
})


router.delete('/:idUser/:idReceita/salvar', auth.verifyToken, async function (request, response) {
    let idUsuario = request.id_usuario
    let idReceita = request.params.idReceita

    let result = await controllerSalvo.excluirSalvo(idUsuario, idReceita)

    response.status(result.status_code)
    response.json(result)
})


// COMENTARIOS RECEITA
// Inserir novo comentário
// Inserir novo comentário
router.post('/:idReceita/comentarios', auth.verifyToken, bodyParserJSON, async function (request, response) {
    

    let idReceita = request.params.idReceita
    let idUsuario = request.query.idUsuario
    let comentario = request.body
    let contentType = request.headers['content-type']

    comentario.id_receita = idReceita
    comentario.id_usuario = idUsuario

    let result = await controllerComentario.inserirComentario(comentario, contentType, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

// Buscar comentários de uma receita
router.get('/:idReceita/comentarios', async function (request, response) {

    let idReceita = request.params.idReceita

    let result = await controllerComentario.buscarComentarioPelaReceita(idReceita)

    response.status(result.status_code)
    response.json(result)
})

// Atualizar comentário
router.put('/comentarios/:idComentario', auth.verifyToken, bodyParserJSON, async function (request, response) {

    let idComentario = request.params.idComentario
    let idUsuario = request.query.idUsuario
    let comentario = request.body
    let contentType = request.headers['content-type']

    let result = await controllerComentario.atualizarComentario(
        comentario,
        idComentario,
        idUsuario,
        contentType
    )

    response.status(result.status_code)
    response.json(result)
})

// Excluir comentário
router.delete('/comentarios/:idComentario', auth.verifyToken, async function (request, response) {

    let idComentario = request.params.idComentario
    let idUsuario = request.query.idUsuario

    let result = await controllerComentario.excluirComentario(idComentario, idUsuario)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router