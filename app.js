//Import das dependencias para criar a API
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

//Permitindo a utilização do JSON no body das requisições
const bodyParserJSON = bodyParser.json()

//Criando um objeto do express para criar a API
const app = express()

//Configuração do CORS da API
const corsOptions = {
    origin: '*',   //Configuração da origem da requisição (IP ou Dominio)
    methods: 'GET, POST, PUT, DELETE, OPTIONS',  //Configuração dos verbos que serão ultilizados na API
    allowedHeaders: ['Content-type', 'Authorization'] //Configurações de permissões
    //Tipo de dados   //Autorização de acesso
}

//Aplica as configurações do CORS no app (EXPRESS)
app.use(cors(corsOptions))

//Import do arquivo de rotas
const chefinhoRouter = require('./routes/chefinho.router.js')
app.use('/v1/chefinho/conversas', cors(), chefinhoRouter)

const dificuldadeRouter = require('./routes/dificuldadade.router.js')
app.use('/v1/entrepanelas/dificuldade', cors(), dificuldadeRouter)

const custoRouter = require('./routes/custo.router.js')
app.use('/v1/entrepanelas/custo', cors(), custoRouter)

const usuarioRouter = require('./routes/usuario.router.js')
app.use('/v1/entrepanelas/usuario', cors(), usuarioRouter)

const receitaRouter = require('./routes/receita.router.js')
app.use('/v1/entrepanelas/receita', cors(), receitaRouter)

const porcaoRouter = require('./routes/porcao.router.js')
app.use('/v1/entrepanelas/porcao', cors(), porcaoRouter)


const ingredienteRouter = require('./routes/ingrediente.router.js')
app.use('/v1/entrepanelas/ingrediente', cors(), ingredienteRouter)

const comunidadeRouter = require('./routes/comunidade.router.js')
app.use('/v1/entrepanelas/comunidade', cors(), comunidadeRouter)

const geladeiraRouter = require('./routes/geladeira.router.js')
app.use('/v1/entrepanelas/geladeira', cors(), geladeiraRouter)

const categoriaRouter = require('./routes/categoria.router.js')
app.use('/v1/entrepanelas/categoria', cors(), categoriaRouter)

const categoriaPrincipalRouter = require('./routes/categoria_principal.router.js')
app.use('/v1/entrepanelas/categoria_principal', cors(), categoriaPrincipalRouter)

const comunidadeReceitaRouter = require('./routes/comunidade_receita.router.js')
app.use('/v1/entrepanelas/comunidade_receita', cors(), comunidadeReceitaRouter)

const denunciaRouter = require('./routes/denuncia.router.js')
app.use('/v1/entrepanelas/denuncia', cors(), denunciaRouter)

const emAltaRouter = require('./routes/em_alta.router.js')
app.use('/v1/entrepanelas/em_alta', cors(), emAltaRouter)

const modoPreparoRouter = require('./routes/modo_preparo.router.js')
app.use('/v1/entrepanelas/modo_preparo', cors(), modoPreparoRouter)

const statusRouter = require('./routes/status.router.js')
app.use('/v1/entrepanelas/status', cors(), statusRouter)

const tagRouter = require('./routes/tag.router.js')
app.use('/v1/entrepanelas/tag', cors(), tagRouter)

const unidadeMedidaRouter = require('./routes/unidade_medida.router.js')
app.use('/v1/entrepanelas/unidade_medida', cors(), unidadeMedidaRouter)

const denunciaUsuarioRouter = require('./routes/denuncia_usuario.router.js')
app.use('/v1/entrepanelas/denuncia_usuario', cors(), denunciaUsuarioRouter)

const seguidoresRouter = require('./routes/seguidores.routes.js')
app.use('/v1/entrepanelas/seguidores', cors(), seguidoresRouter)

//API rodando na porta desejada
app.listen(process.env.PORT, function () {
    console.log('API aguardando novas requisições...')
})